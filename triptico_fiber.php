<?php
/**
 * Plugin Name:       Triptico React Fiber
 * Plugin URI:        https://apie.cl
 * Description:       React Fiber implementation to work with wordpress stuff
 * Version:           0.1
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Pablo Selin / A Pie
 * Author URI:        https://apie.cl
 * License:           MIT
 * Text Domain:       tri
 * Domain Path:       /languages
 **/

define('TRI_VERSION', '0.1');

function triptico_scripts() {
	wp_enqueue_script( 'tripticojs', plugin_dir_url( __FILE__ ) . '/build/index.js', TRI_VERSION, true );
}

add_action('wp_enqueue_scripts', 'triptico_scripts');