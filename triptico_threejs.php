<?php
/**
 * Plugin Name:       Triptico ThreeJS Implementation
 * Plugin URI:        https://apie.cl
 * Description:       Data functions and structure for triptico project
 * Version:           0.1
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Pablo Selin / A Pie
 * Author URI:        https://apie.cl
 * License:           MIT
 * Text Domain:       tri
 * Domain Path:       /languages
 **/

define( 'TRI_VERSION', '0.1' );

require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_custom_content.php' );
require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_custom_fields.php' );
//require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_admin.php' );

function triptico_scripts() {
	wp_enqueue_script( 'tripticojs', plugin_dir_url( __FILE__ ) . '/dist/main.js', TRI_VERSION, true );
	wp_enqueue_style( 'tripticocss', plugin_dir_url( __FILE__ ) . '/tristyle.css', array(), TRI_VERSION, 'screen' );
}

add_action('wp_enqueue_scripts', 'triptico_scripts');

$mainpath = ABSPATH;

$csv_1 = 'tripticoEdge/RPiIMU/';
$csv_2 = 'tripticoEdge/RPiIMU2/';
$imgs = 'tripticoEdge/RPiFotos/';
$audios = 'tripticoEdge/RPiREC/';

define( 'TRI_CSVFOLDER', $mainpath .  $csv_1);
define( 'TRI_CSV2FOLDER', $mainpath . $csv_2);
define( 'TRI_IMGFOLDER', $mainpath . $imgs );
define( 'TRI_AUDIOFOLDER', $mainpath . $audios );

define( 'TRI_CSVURL', get_bloginfo('url') . '/' . $csv_1);
define( 'TRI_CSV2URL', get_bloginfo('url') . '/' . $csv_2);
define( 'TRI_IMGURL', get_bloginfo('url') . '/' . $imgs);
define( 'TRI_AUDIOURL', get_bloginfo('url') . '/' . $audios);

function triptico_dataurls() {
	$urls = array(
		'csv' 	=> TRI_CSVURL,
		'csv_2'	=> TRI_CSV2URL,
		'img'	=> TRI_IMGURL,
		'audio'	=> TRI_AUDIOURL
	);

	return $urls;
}

// Get list of all files in folders
function filesList($path) {
	//$files = array_diff(scandir($path), array('.', '..'));
	$files = array_diff(scandir($path), array('.', '..'));
	return $files;
}

function searchFilesInRange($datestart, $dateend, $postid) {
	
	$sensores = get_post_meta($postid, '_tri_sensores', true);
	
	if($sensores) {
		foreach($sensores as $sensor) {
			if($sensor == 'acc_i') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_CSVFOLDER, '.csv', '_i');
			} elseif($sensor == 'acc_d') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_CSVFOLDER, '.csv', '_d');
			} elseif($sensor == 'img') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_IMGFOLDER, '.jpg', '');
			} elseif($sensor == 'audio') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_AUDIOFOLDER, '.wav', '');
			} elseif($sensor == 'acc2_i') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_CSV2FOLDER, '.csv', '_i');
			} elseif($sensor == 'acc2_d') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_CSV2FOLDER, '.csv', '_d');
			} elseif($sensor == 'video') {
				$files[$sensor] = searchFilesInRangeFolder($datestart, $dateend, TRI_VIDEOFOLDER, '.mp4', '');
			}
		}

		return $files;
	} else {
		return 'No se asignaron sensores';
	}
}

function triptico_debugfiles() {
	return filesList(TRI_IMGFOLDER);
}

function searchFilesInRangeFolder($datestart, $dateend, $folder, $extension, $suffix = '') {
	//Timecode example: 1616506564936
	$files = array();
	$fileslist = filesList($folder);
	$datestart = intval($datestart . '000');
	$dateend = intval($dateend . '000');
	
	//Recorro toda la lista de archivos por directorio
	foreach($fileslist as $file) {
		//Dejo solo la base del nombre de archivo
		$basedate = basename($file, $extension);
		
		
		
		if(strlen($suffix) > 0) {
			//Si tiene sufijo lo guardo aqui _i o _d
			$filesuffix = substr($basedate, -2);
			//Y se lo quito aqui para tener la fecha sola
			$basedate = substr($basedate, 0, -(strlen($suffix)));
			
		}
		
		//Convierto la base a numero entero
		$intbasedate = intval($basedate);

		
		//Si tengo sufijo en el archivo necesito asignar unos al lado derecho y otro al lado
		if(strlen($suffix) > 0) {
			//Comparo el rango de fechas de la performance y veo si hay archivos disponibles
			if($intbasedate >= $datestart && $intbasedate <= $dateend && $filesuffix == $suffix) {
				//Pongo el archivo en la lista
				$files[] = $file;
			}	
		} else {
			//Si no tiene sufijo comparo el rango de fechas y no chequeo el sufijo
			if($intbasedate >= $datestart && $intbasedate <= $dateend) {
				$files[] = $file;
			}
		}
	
	}
	
	return $files;
}

function triptico_datavars() {
	global $post;
	$datestart = get_post_meta($post->ID, '_tri_start_perfo', true);
	$dateobj = new DateTime("@$datestart");

	$perfduration = get_post_meta($post->ID, '_tri_length_perfo', true) ? get_post_meta($post->ID, '_tri_length_perfo', true) : 5;
	date_add($dateobj, date_interval_create_from_date_string( $perfduration . ' minutes'));
	$dateend = date_format($dateobj, 'U');
	//var_dump($datestart, $dateend);
	//$dateend = get_post_meta($post->ID, '_tri_end_perfo', true);
	if(get_post_type( $post->ID ) == 'performance') {
		wp_register_script( 'tripticodata', '', [], '', true);
		wp_enqueue_script( 'tripticodata' );
		wp_add_inline_script('tripticodata', 'const TRIPTICO = ' . json_encode( searchFilesInRange( $datestart, $dateend, $post->ID)) . '; const TRIPTICO_URLS = ' .json_encode( triptico_dataurls()) . '; const TRIPTICO_SENSORS = ' . json_encode( get_post_meta($post->ID, '_tri_sensores', true)) . '; const TRIPTICO_DEBUGFILES = ' . json_encode( triptico_debugfiles()) . ';');
	}
}

add_action('wp_enqueue_scripts', 'triptico_datavars');