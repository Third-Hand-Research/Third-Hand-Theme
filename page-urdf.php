<?php
/**
 * Template Name: Page URDF
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


			<!--	<div id="menu">
						<ul id="urdf-options">
								<li urdf="http://localhost/wp-content/themes/third-hand/src/urdf/ur10/ur10.urdf" color="#E91E63">UR10</li>
						</ul>

						<div id="controls" class="hidden">
								<div id="toggle-controls"></div>
								<div>Drag and drop URDF files or folders! <br/> (Chrome Only)</div>
								<div id="ignore-joint-limits" class="toggle">Ignore Joint Limits</div>
								<div id="do-animate" class="toggle checked">Animate Joints</div>
								<label>
										Up Axis
										<select id="up-select">
												<option value="+X">+X</option>
												<option value="-X">-X</option>
												<option value="+Y">+Y</option>
												<option value="-Y">-Y</option>
												<option value="+Z">+Z</option>
												<option value="-Z" selected>-Z</option>
										</select>
								</label>
								<ul></ul>
						</div>
				</div> -->
				<urdf-viewer up="-Z" display-shadow tabindex="0"></urdf-viewer>

				<?php
				while ( have_posts() ) {
					the_post();
					get_template_part( 'loop-templates/content-effectors', 'page' );
				}
				?>

			</main><!-- #main -->

		</div><!-- .row -->

	</div><!-- #content -->

</div><!-- #page-wrapper -->

<?php
get_footer();
