<?php
/**
 * Template Name: Page References
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();

$container = get_theme_mod( 'understrap_container_type' );
?>

<div class="wrapper" id="page-wrapper">
	<div class="<?php echo esc_attr( $container ); ?>" id="content" tabindex="-1">
		<div class="row">

			<!-- Do the left sidebar check -->
			<?php get_template_part( 'global-templates/left-sidebar-check' ); ?>
			<main class="site-main" id="main">

				<?php
				while ( have_posts() ) {
					the_post();
					get_template_part( 'loop-templates/content', 'page' );

				}
				?>
            

            <?php if( have_rows('projects') ): ?>
                <div class="projects container">
                    <div class="row">
                        <?php while( have_rows('projects') ): the_row(); 
                            $image = get_sub_field('image');
                            $link = get_sub_field('link');
                            ?>
                            <div class="col-12 col-md-4">
                                <a href="<?php print_r($link); ?>" ><?php echo wp_get_attachment_image( $image, 'large' ); ?></a>
                                <div class="title mt-2 mb-5"><?php the_sub_field('artist_name'); ?> <br> <?php the_sub_field('title'); ?> (<?php the_sub_field('year'); ?>)<br>
                                <span class="badge rounded-pill bg-primary"><?php the_sub_field('category'); ?></span></div>
                            </div>

                        <?php endwhile; ?>
                    </div>
                </div>
            <?php endif; ?>

			</main><!-- #main -->

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #page-wrapper -->

<?php
get_footer();
