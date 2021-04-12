<?php 

// Register Custom Post Type
function triptico_performance() {

	$labels = array(
		'name'                  => _x( 'Performances', 'Post Type General Name', 'tri' ),
		'singular_name'         => _x( 'Performance', 'Post Type Singular Name', 'tri' ),
		'menu_name'             => __( 'Performances', 'tri' ),
		'name_admin_bar'        => __( 'Performance', 'tri' ),
		'archives'              => __( 'Archivos', 'tri' ),
		'attributes'            => __( 'Atributos de Performances', 'tri' ),
		'parent_item_colon'     => __( 'Parent Item:', 'tri' ),
		'all_items'             => __( 'Todas las Performances', 'tri' ),
		'add_new_item'          => __( 'Añadir nueva Performances', 'tri' ),
		'add_new'               => __( 'Añadir nueva', 'tri' ),
		'new_item'              => __( 'Nueva Performance', 'tri' ),
		'edit_item'             => __( 'Editar Performance', 'tri' ),
		'update_item'           => __( 'Actualizar Performance', 'tri' ),
		'view_item'             => __( 'Ver Performance', 'tri' ),
		'view_items'            => __( 'Ver Performances', 'tri' ),
		'search_items'          => __( 'Buscar Performances', 'tri' ),
		'not_found'             => __( 'No encontrado', 'tri' ),
		'not_found_in_trash'    => __( 'No encontrado en papelera', 'tri' ),
		'featured_image'        => __( 'Imagen destacada', 'tri' ),
		'set_featured_image'    => __( 'Asignar imagen destacada', 'tri' ),
		'remove_featured_image' => __( 'Quitar imagen destacada', 'tri' ),
		'use_featured_image'    => __( 'Usar como imagen destacada', 'tri' ),
		'insert_into_item'      => __( 'Insertar en Performance', 'tri' ),
		'uploaded_to_this_item' => __( 'Subido a esta Performance', 'tri' ),
		'items_list'            => __( 'Lista de Performances', 'tri' ),
		'items_list_navigation' => __( 'Navegación de lista de Performances', 'tri' ),
		'filter_items_list'     => __( 'Filtrar lista de Performances', 'tri' ),
	);
	$args = array(
		'label'                 => __( 'Performance', 'tri' ),
		'description'           => __( 'Performances', 'tri' ),
		'labels'                => $labels,
		'supports'              => array( 'title', 'editor', 'thumbnail', 'custom-fields' ),
		'taxonomies'            => array( 'category', 'post_tag' ),
		'hierarchical'          => false,
		'public'                => true,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'page',
		'show_in_rest'          => true,
	);
	register_post_type( 'performance', $args );

}
add_action( 'init', 'triptico_performance', 0 );