<?php
/**
 * The template for displaying all single posts
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
$container = get_theme_mod( 'understrap_container_type' );
?>

<?php
wp_enqueue_script( 'threejs', get_stylesheet_directory_uri() . '/src/js/three.min.js');
wp_enqueue_script( 'threejs-webgl', get_stylesheet_directory_uri() . '/src/js/WebGL.js');
wp_enqueue_script( 'threejs-stl', get_stylesheet_directory_uri() . '/src/js/STLLoader.js');
wp_enqueue_script( 'threejs-orbit', get_stylesheet_directory_uri() . '/src/js/OrbitControls.js');
wp_enqueue_script( 'stlviewer', get_stylesheet_directory_uri() . '/src/js/stlviewer.js');
?>

<script type=text/javascript>
window.onload=function() {
STLViewerEnable("stlviewer");
}
</script>

<div class="wrapper" id="single-wrapper">

	<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">

		<div class="row">

			<!-- Do the left sidebar check -->
			<?php get_template_part( 'global-templates/left-sidebar-check' ); ?>

			<main class="site-main" id="main">

				<?php
				while ( have_posts() ) {
					the_post();
					get_template_part( 'loop-templates/content', 'single' );
															$stl = get_field( "stl" );
										echo '<div class="stlviewer" data-src='.$stl.'></div>';
				}
				?>

			</main><!-- #main -->

			<!-- Do the right sidebar check -->
			<?php get_template_part( 'global-templates/right-sidebar-check' ); ?>

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #single-wrapper -->

<?php
get_footer();
