<?php
/**
 * Template Name: Landingpage Template
 *
 * Template for displaying a page just with the header and footer area and a "naked" content area in between.
 * Good for landingpages and other types of pages where you want to add a lot of custom markup.
 *
 * @package Understrap
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

get_header();
?>
<div id="keyvisual">
  <div class="visual-text">OPEN<br>CALL</div>
</div>
<div class="landingpage-content">

<?php

while ( have_posts() ) :
	the_post();
	get_template_part( 'loop-templates/content', 'empty' );
endwhile;
?>
</div>
<?php

get_footer();
