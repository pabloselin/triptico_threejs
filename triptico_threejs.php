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

define( 'TRI_VERSION', '0.3.6' );

require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_custom_content.php' );
require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_custom_fields.php' );
//require_once( plugin_dir_path( __FILE__ ) . '/inc/triptico_admin.php' );

function triptico_scripts() {
	wp_enqueue_script( 'tripticojs', plugin_dir_url( __FILE__ ) . '/dist/main.js', TRI_VERSION, true );
	//wp_enqueue_style( 'tripticocss', plugin_dir_url( __FILE__ ) . '/tristyle.css', array(), TRI_VERSION, 'screen' );
}

add_action('wp_enqueue_scripts', 'triptico_scripts');

$mainpath = ABSPATH;

$csv_1 = 'tripticoEdge/RPiIMU/';
$csv_2 = 'tripticoEdge/RPiIMU2/';
$imgs = 'tripticoEdge/RPiFotos/';
$imgs_resized = 'tripticoEdge/resizedimgs/';
$audios = 'tripticoEdge/RPiREC/';

define( 'TRI_CSVFOLDER', $mainpath .  $csv_1);
define( 'TRI_CSV2FOLDER', $mainpath . $csv_2);
define( 'TRI_IMGFOLDER', $mainpath . $imgs );
define( 'TRI_THUMBFOLDER', $mainpath . $imgs_resized);
define( 'TRI_AUDIOFOLDER', $mainpath . $audios );

define( 'TRI_CSVURL', get_bloginfo('url') . '/' . $csv_1);
define( 'TRI_CSV2URL', get_bloginfo('url') . '/' . $csv_2);
define( 'TRI_IMGURL', get_bloginfo('url') . '/' . $imgs);
define( 'TRI_THUMBURL', get_bloginfo( 'url') . '/' . $imgs_resized);
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

		if(count($files['img']) > 0) {
			$files['img_resized'] = array();
			foreach($files['img'] as $bigimg) {
				$files['img_resized'][] = triptico_resizeimages($bigimg);
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

function triptico_resizeimagesmultiple($images) {
	$resized = [];
	if($images) {
		foreach($images as $image) {
			$resized[] = triptico_resizeimages($image);
		}
	}

	return $resized;
}

function triptico_resizeimages($image) {
	$basename = basename($image, '.jpg');
	$newname = $basename . '_resized.jpg';
	$imagepath = TRI_IMGFOLDER . $image;
	$resizedexists = TRI_THUMBFOLDER . $newname;
	$resizedurl = TRI_THUMBURL . '/' .$newname . '?exists=false';
	$image = wp_get_image_editor($imagepath);
	$imageurl = $imagepath;
	if(!is_wp_error($image) && !file_exists($resizedexists)) {
		$image->resize(30, 20, true);
		$image->save(TRI_THUMBFOLDER . $newname);
	}

	return $resizedurl;
}

function searchFilesInRangeFolder($datestart, $dateend, $folder, $extension, $suffix = '') {
	//Timecode example: 1616506564936
	$files = array();
	$fileslist = filesList($folder);
	$datestart = intval($datestart . '000');
	$dateend = intval($dateend . '000');
	//var_dump(count($fileslist), $datestart, $dateend);
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
	if(get_post_type( $post->ID ) == 'performance') {

		$datestart = get_post_meta($post->ID, '_tri_start_perfo', true);
		$dateobj = new DateTime("@$datestart");

		$perfduration = get_post_meta($post->ID, '_tri_length_perfo', true) ? get_post_meta($post->ID, '_tri_length_perfo', true) : 5;
		date_add($dateobj, date_interval_create_from_date_string( $perfduration . ' minutes'));
		$dateend = date_format($dateobj, 'U');
		//var_dump($datestart, $dateend);
		//$dateend = get_post_meta($post->ID, '_tri_end_perfo', true);
	
		wp_register_script( 'tripticodata', '', [], '', true);
		wp_enqueue_script( 'tripticodata' );
		wp_add_inline_script('tripticodata', 'const TRIPTICO = ' . json_encode( searchFilesInRange( $datestart, $dateend, $post->ID)) . '; const TRIPTICO_URLS = ' .json_encode( triptico_dataurls()) . '; const TRIPTICO_SENSORS = ' . json_encode( get_post_meta($post->ID, '_tri_sensores', true)) . ';const TRIPTICO_PICKED_AUDIOS = ' . json_encode( get_post_meta($post->ID, '_tri_picked_audio_files', true)) . '; const TRIPTICO_DEBUGFILES = ' . json_encode( triptico_debugfiles()) . '; const TRIPTICO_PICKED_SENSORS_LEFT = ' . json_encode( get_post_meta($post->ID, '_tri_picked_sensor_files_left', true)) . ';const TRIPTICO_PICKED_SENSORS_RIGHT = ' . json_encode( get_post_meta($post->ID, '_tri_picked_sensor_files_right', true)) . '; const TRIPTICO_PICKED_IMAGES = ' . json_encode(get_post_meta($post->ID, '_tri_picked_image_files', true)) . '; const TRIPTICO_PICKED_IMAGES_RESIZED = ' . json_encode(triptico_resizeimagesmultiple(get_post_meta($post->ID, '_tri_picked_image_files', true))) . '; const TRIPTICO_LEFT_COLOR = "' . get_post_meta($post->ID, '_tri_lefthue', true) . '"; const TRIPTICO_RIGHT_COLOR = "' . get_post_meta($post->ID, '_tri_righthue', true) . '";' );
	}
}

function triptico_getperfimgs($postid) {
	// $datestart = get_post_meta($postid, '_tri_start_perfo', true);
	// $dateobj = new DateTime("@$datestart");

	// $perfduration = get_post_meta($postid, '_tri_length_perfo', true) ? get_post_meta($postid, '_tri_length_perfo', true) : 5;
	// 	date_add($dateobj, date_interval_create_from_date_string( $perfduration . ' minutes'));
	// $dateend = date_format($dateobj, 'U');

	$imgs = get_post_meta($postid, '_tri_picked_image_files', true);

	//$imgs = searchFilesInRangeFolder($datestart, $dateend, TRI_IMGFOLDER, '.jpg', '');
	if($imgs) {
		foreach($imgs as $img) {
			$smallimgs[] = triptico_resizeimages($img);
		}
	}

	return $smallimgs;
}

add_action('wp_enqueue_scripts', 'triptico_datavars');