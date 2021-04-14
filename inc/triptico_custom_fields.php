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

	$prefix = '_tri_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'performancedata',
		'title'        => __( 'Datos performance', 'tri' ),
		'object_types' => array( 'performance' ),
		'context'      => 'normal',
		'priority'     => 'default',
	) );

	$cmb->add_field( array(
		'name' => __( 'Inicio performance', 'tri' ),
		'id' => $prefix . 'start_perfo',
		'type' => 'text_datetime_timestamp',
		'attributes'	=> array(
							'data-datepicker' => json_encode( array(
									'dateFormat' => 'dd-mm-yy'
									)
								)
							)
	) );

	$cmb->add_field( array(
		'name' => __( 'Fin performance', 'tri' ),
		'id' => $prefix . 'end_perfo',
		'type' => 'text_datetime_timestamp',
		'attributes'	=> array(
							'data-datepicker' => json_encode( array(
									'dateFormat' => 'dd-mm-yy'
									)
								)
							)
	) );

	$cmb->add_field( array(
		'name' => __( 'Sensores', 'tri' ),
		'id' => $prefix . 'sensores',
		'type' => 'multicheck',
		'options' => array(
			'video' 	=> __( 'Video', 'tri' ),
			'img' 	=> __( 'Imagen', 'tri' ),
			'audio' 	=> __( 'Audio', 'tri' ),
			'acc_i' 	=> __( 'Acelerómetro 1 Izquierda', 'tri' ),
			'acc_d' 	=> __( 'Acelerómetro 1 Derecha', 'tri' ),
			'acc2_i' 	=> __( 'Acelerómetro 2 Izquierda', 'tri' ),
			'acc2_d' 	=> __( 'Acelerómetro 2 Derecha', 'tri' ),
		),
	) );
}
