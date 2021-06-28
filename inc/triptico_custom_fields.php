<?php
/* 
Custom fields
	- Rango de fechas disponibles para usar
	- Tipos de datos disponibles para usar
		- Acelerometro Izquierda
		- Acelerometro Derecha
		- Fotos
		- Video
*/


/* 
Utilities

- Rango de fecha inicio performance (timestamp)
- Rango de fecha fin performance (timestamp)

- Botón para detectar si hay archivos dentro de ese rango

- Muestra lo que hay disponible
	En función de eso te deja activar los sensores que hayan


- Al guardar el rango de fechas y la detección de archivos se guardan campos adicionales que contienen:
	- Los archivos que se van a usar
	- Esas variables luego se exportan al frontend y las usa la interfaz de threejs
*/


add_action( 'cmb2_init', 'triptico_cmb2_add_metabox_perfdata' );
function triptico_cmb2_add_metabox_perfdata() {
	
	$postid = $_GET['post'];
	$prefix = '_tri_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'performancedata',
		'title'        => __( 'Datos performance', 'tri' ),
		'object_types' => array( 'performance' ),
		'context'      => 'normal',
		'priority'     => 'default',
	) );

	$cmb->add_field( array(
		'name' => __( 'Día de la performance', 'tri' ),
		'id' => $prefix . 'start_perfo',
		'type' => 'text_date_timestamp',
		'attributes'	=> array(
							'data-datepicker' => json_encode( array(
									'dateFormat' => 'dd-mm-yy'
									))
							),
		//'after_row'		=> 'tri_date_after_row'
	) );

	if(get_post_meta($postid, '_tri_start_perfo', true)) {
	
		$cmb->add_field( array(
			'name'	=> __('Archivos disponibles acelerometros (izq + der)', 'tri'),
			'id'	=> $prefix . 'picked_sensor_files_left',
			'type'	=> 'multicheck',
			'options' => tri_availableFilesInRange($postid, 'sensors_left')
			)
		);

		$cmb->add_field( array(
			'name'	=> __('Archivos disponibles acelerometros (izq + der)', 'tri'),
			'id'	=> $prefix . 'picked_sensor_files_right',
			'type'	=> 'multicheck',
			'options' => tri_availableFilesInRange($postid, 'sensors_right')
			)
		);

		$cmb->add_field( array(
			'name'	=> __('Archivos disponibles de imágenes', 'tri'),
			'id'	=> $prefix . 'picked_image_files',
			'type'	=> 'multicheck',
			'options' => tri_availableFilesInRange($postid, 'imgs')
			)
		);

		$cmb->add_field( array(
			'name'	=> __('Archivos disponibles de audio', 'tri'),
			'id'	=> $prefix . 'picked_audio_files',
			'type'	=> 'multicheck',
			'options' => tri_availableFilesInRange($postid, 'audio')
			)
		);

	}



	// $cmb->add_field( array(
	// 	'name'	=> __('Duracion performance (en minutos)', 'tri'),
	// 	'id'	=> $prefix . 'length_perfo',
	// 	'type'	=> 'select',
	// 	'options'	=> array(
	// 						2 => 2,
	// 						5 => 5,
	// 						10 => 10,
	// 					)
	// ));

	// $cmb->add_field( array(
	// 	'name' => __( 'Fin performance', 'tri' ),
	// 	'id' => $prefix . 'end_perfo',
	// 	'type' => 'text_datetime_timestamp',
	// 	'attributes'	=> array(
	// 						'data-datepicker' => json_encode( array(
	// 								'dateFormat' => 'dd-mm-yy'
	// 								)
	// 							)
	// 						)
	// ) );

	// $cmb->add_field( array(
	// 	'name' => __( 'Sensores', 'tri' ),
	// 	'id' => $prefix . 'sensores',
	// 	'type' => 'multicheck',
	// 	'options' => array(
	// 		'video' 	=> __( 'Video', 'tri' ),
	// 		'img' 	=> __( 'Imagen', 'tri' ),
	// 		'audio' 	=> __( 'Audio', 'tri' ),
	// 		'acc_i' 	=> __( 'Acelerómetro 1 Izquierda', 'tri' ),
	// 		'acc_d' 	=> __( 'Acelerómetro 1 Derecha', 'tri' ),
	// 		'acc2_i' 	=> __( 'Acelerómetro 2 Izquierda', 'tri' ),
	// 		'acc2_d' 	=> __( 'Acelerómetro 2 Derecha', 'tri' ),
	// 	),
	// ) );
}

function tri_availableFilesInRange($postid, $type) {
	$date_start = get_post_meta($postid, '_tri_start_perfo', true);
	$perfduration = get_post_meta($postid, '_tri_length_perfo', true) ? get_post_meta($postid, '_tri_length_perfo', true) : 5;
	$dateobj = new DateTime("@$date_start");

	date_add($dateobj, date_interval_create_from_date_string( '1 day'));
		
	$date_end = date_format($dateobj, 'U');
	
	if($type == 'sensors_left') {
		$files 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_CSV2FOLDER, '.csv', '_i');	
	} elseif($type == 'sensors_right') {
		$files 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_CSV2FOLDER, '.csv', '_d');	
	} elseif($type == 'imgs') {
		$files 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_IMGFOLDER, '.jpg', '');	
	} elseif($type == 'audio') {
		$files 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_AUDIOFOLDER, '.wav', '');	
	}

	if($files) {
		foreach($files as $file) {
			$epoch = intval(substr($file, 0, 10));
			$date_file = new DateTime("@$epoch");
			$files_options[$type] = $date_file->format('j F Y H:i');
		}

		return $files_options;
	} else {
		return $files_options[0] = 'No se encontraron archivos';
	}


	
}

function tri_date_after_row( $field_args, $field) {
	
		$date_start = get_post_meta($field->object_id, '_tri_start_perfo', true);
		$perfduration = get_post_meta($field->object_id, '_tri_length_perfo', true) ? get_post_meta($field->object_id, '_tri_length_perfo', true) : 5;
		$dateobj = new DateTime("@$date_start");

		date_add($dateobj, date_interval_create_from_date_string( '1 day'));
		
		$date_end = date_format($dateobj, 'U');
		

		$files_left 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_CSV2FOLDER, '.csv', '_i');
		$files_right 	= 	searchFilesInRangeFolder($date_start, $date_end, TRI_CSV2FOLDER, '.csv', '_d');
		$audio 			= 	searchFilesInRangeFolder($date_start, $date_end, TRI_AUDIOFOLDER, '.wav', '');
		$images 		= 	searchFilesInRangeFolder($date_start, $date_end, TRI_IMGFOLDER, '.jpg', '');

		?>

		<p>Para este día hay disponibles:</p>
		<?php //var_dump($dateobj);?>
		<p>Rango de tiempo - <?php echo $field->object_id;?> - <strong><?php echo $date_start;?> - <?php echo $date_end;?></strong></p>
		<ul>
			<li>
				<?php echo count($files_left);?> archivos CSV del sensor izquierdo
				<ul>
					<?php 
						foreach($files_left as $file_left): 
							$epoch = intval(substr($file_left, 0, 10));
							$date_file = new DateTime("@$epoch");
							?>

							<li>
								<?php echo $epoch;?>
								<?php echo $date_file->format('j F Y H:i');?>
							</li>

						<?php endforeach;
					?>
				</ul>
			</li>
			<li>
				<?php echo count($files_right);?> archivos CSV del sensor derecho
			</li>
			<li>
				<?php echo count($audio);?> archivos de audio
			</li>
			<li>
				<?php echo count($images);?> imágenes
			</li>
		</ul>

		<?php

}