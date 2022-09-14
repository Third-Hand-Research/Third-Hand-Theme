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

                <?php
                // get repeater field data
                $repeater = get_field('projects');

                // vars
                $order = array();

                // populate order
                foreach( $repeater as $i => $row ) {
                    $order[ $i ] = $row['year'];
                }

                // multisort
                array_multisort( $order, SORT_DESC, $repeater );

                // loop through repeater
                if( $repeater ): ?>
                    
                <div class="projects container mt-3">
                    <div class="row">
                    <?php foreach( $repeater as $i => $row ): 
                            $image = $row['image'];
                            $link = $row['link'];
                        ?>
                        <div class="col-12 col-md-4">
                            <a href="<?php print_r($link); ?>" ><?php echo wp_get_attachment_image( $image, 'large' ); ?></a>
                            <div class="title mt-2 mb-5"><?php echo $row['artist_name']; ?> <br> <?php echo $row['title']; ?> (<?php echo $row['year']; ?>)<br>
                            <span class="badge rounded-pill bg-primary"><?php echo $row['category']; ?></span></div>
                        </div>
                    <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

			</main><!-- #main -->

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #page-wrapper -->

<?php
get_footer();