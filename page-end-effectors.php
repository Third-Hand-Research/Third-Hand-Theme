<?php
/**
 * Template Name: Page End Effectors
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );

wp_enqueue_script( 'threejs', get_stylesheet_directory_uri() . '/src/js/vendor/three.js/build/three.min.js');
wp_enqueue_script( 'urdf-loader', get_stylesheet_directory_uri() . '/src/js/vendor/urdf-loader/src/URDFLoader.js');
wp_enqueue_script( 'robotplayer', get_stylesheet_directory_uri() . '/src/js/robot-player.js');
?>

<script type=text/javascript>
window.onload=function() {
STLViewerEnable("stlviewer");
}
</script>

<div class="wrapper" id="page-wrapper">

	<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">

		<div class="row">

			<!-- Do the left sidebar check -->
			<?php get_template_part( 'global-templates/left-sidebar-check' ); ?>

			<main class="site-main" id="main">

				<?php
				while ( have_posts() ) {
					the_post();
					get_template_part( 'loop-templates/content-effectors', 'page' );
				}
				?>

				<?php
					$args = array(
					    'post_type' => 'end-effectors',
					    'posts_per_page' => 20
					);
					$the_query = new WP_Query( $args ); ?>
					<div class="container">
						<div class="row">

					<?php if ( $the_query->have_posts() ) : ?>
					    <?php while ( $the_query->have_posts() ) : $the_query->the_post();
								?>
								<div class="col-12 col-md-4">
									<a href="<?php the_permalink(); ?>">
									<?php $stl = get_field( "stl" );
									echo '<div class="stlviewer" data-src='.$stl.'></div>';
			?>
					        <h4><?php the_title(); ?></h4>
								</a>
								</div>
					    <?php endwhile; ?>

					    <?php wp_reset_postdata(); ?>

					<?php endif; ?>
				</div>
				</div>
			</main><!-- #main -->

			<!-- Do the right sidebar check -->
			<?php get_template_part( 'global-templates/right-sidebar-check' ); ?>

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #page-wrapper -->

<?php
get_footer();
