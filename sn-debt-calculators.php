<?php
/*
Plugin Name: SeitzNetwork Debt Calculators
Plugin URI:  http://seitznetwork.com
Description: Add Debt Calculators to your site
Version:     1.0.9
Author:      Cristian Araya
Author URI:  http://seitznetwork.com
Text Domain: sn_debt_calculators
*/
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

class SN_Debt_Calculators {
	// Plugin Version
	const VERSION = '1.0.10';

	// Singleton Instance
	protected static $_instance;

	// Plugin Directory URL
	protected $_dir;

	// Plugin namespace and textdomain
	protected $_namespace;

	// Singleton pattern starter
	public static function getInstance() {
		if(null === self::$_instance)
			self::$_instance = new self();

		return self::$_instance;
	}

	// Sets default Values
	public function __construct() {
		$this->_dir = plugin_dir_url( __FILE__ );
		$this->_addAssets = false;
		$this->_namespace = 'sn_debt_calculators';
	}

	// Wordpress Entry Point
	public function hooks() {
		add_shortcode('sn_debt_calculator', array($this, 'debtCalculator'));
		add_shortcode('sn_debt_calculator_embed', array($this, 'embedCalculator'));

		add_action( 'admin_menu', array($this, 'adminMenu'));
		add_action( 'wp_enqueue_scripts', array($this, 'enqueueScripts'));

		add_action( 'init', array($this, 'createEmbedUrl'));
	}

	// Adds necesary assets (js and css)
	public function enqueueScripts() {
		// Theme Styles
		$this->_enqueueStyle('lib', 'lib.min.css');
		$this->_enqueueStyle('main', 'main.css', array('lib'));

		// Theme Scripts
		$this->_registerScript('sharethis', 'http://w.sharethis.com/button/buttons.js', array(), true);
		$this->_registerScript('lib', 'lib.min.js');
		$this->_registerScript('repay', 'repay.js', array('lib'));
		$this->_registerScript('creditcard', 'creditcard.js', array('lib'));
		$this->_registerScript('consolidation', 'consolidation.js', array('lib'));
		$this->_registerScript('incomeratio', 'incomeratio.js', array('lib'));
		$this->_registerScript('guilt', 'guilt.js', array('lib'));
		$this->_registerScript('embed', 'embed.js', array());
	}

	// Proxy function to wp_enqueue_style, adds namespace info
	protected function _enqueueStyle($name, $src, $deps = array(), $external = false) {
		if(!$external) {
			$name = $this->_namespace . '_css_' . $name;
			$src = $this->_dir . 'css/' . $src;
		}
		foreach($deps as &$dep) {
			$dep = $this->_namespace . '_css_' . $dep;
		}
		wp_enqueue_style( $name, $src, $deps, self::VERSION );
	}

	// Proxy function to wp_register_script, adds namespace info
	protected function _registerScript($name, $src, $deps = array(), $external = false) {
		if(!$external) {
			$name = $this->_namespace . '_js_' . $name;
			$src = $this->_dir . 'js/' . $src;
		}
		foreach($deps as &$dep) {
			$dep = $this->_namespace . '_js_' . $dep;
		}
		wp_register_script( $name, $src, $deps, self::VERSION, true );
	}

	// Proxy function to wp_enqueue_script, adds namespace info
	protected function _enqueueScript($name, $external = false) {
		if(!$external)
			$name = $this->_namespace . '_js_' . $name;
		wp_enqueue_script($name);
	}

	// Shortcode Callback
	public function debtCalculator($atts, $content, $tag) {
		$this->_enqueueScript('sharethis', true);
		$this->_enqueueScript('lib');

		ob_start();
		switch($atts['type']) {
			case 'repay':
				include "templates/repay.php";
				$this->_enqueueScript('repay');
				break;
			case 'creditcard':
				include "templates/creditcard.php";
				$this->_enqueueScript('creditcard');
				break;
			case 'consolidation':
				include "templates/consolidation.php";
				$this->_enqueueScript('consolidation');
				break;
			case 'debt-income-ratio':
				include "templates/incomeratio.php";
				$this->_enqueueScript('incomeratio');
				break;
			case 'guilt':
				include "templates/guilt.php";
				$this->_enqueueScript('guilt');
				break;
		}
		$output = ob_get_contents();

		ob_end_clean();

		return $output;
	}

	public function createEmbedUrl() {
		global $wp_rewrite;
		$plugin_url = plugins_url( 'templates/embed-single.php', __FILE__ );
		$plugin_url = substr( $plugin_url, strlen( home_url() ) + 1 );
		$wp_rewrite->add_external_rule( 'embed/calculators', $plugin_url);
	}

	public function embedCalculator($atts, $content, $tag) {
		ob_start();

		include "templates/embed.php";
		$output = ob_get_clean();

		$this->_enqueueScript('embed');

		return $output;
	}

	// Creates Admin Menu Link
	public function adminMenu() {
		add_submenu_page(
			"options-general.php", 
			"SN Debt Calculators Shortcodes", 
			"SN Debt Calculators", 
			"edit_posts", 
			"sn_debt_calculators", 
			array($this, 'adminPage')
		);
	}

	// Outputs admin settings page
	public function adminPage() {
		include "admin/shortcodes.php";
	}

}

// Returns a singleton instance of the plugin
function sn_debt_calculators_plugin() {
	return SN_Debt_Calculators::getInstance();
}

// Add plugin functionallity to wordpress
add_action( 'plugins_loaded', array( sn_debt_calculators_plugin(), 'hooks' ) );

