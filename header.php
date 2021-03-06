<?php
  require_once(get_template_directory().'/globals.php');
  $name_bloginfo = html_entity_decode(get_bloginfo('name'));
?>
<!DOCTYPE html>
<html <?php language_attributes() ?>>
<head>
<meta charset="utf-8">
<title><?php if(is_home() || is_front_page()){ echo strip_tags($name_bloginfo) . ' - ' . get_bloginfo('description'); } else { wp_title( '' ); } ?></title>
<meta name="Keywords" content="">
<meta name="Description" content="">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
function top_side_menu($menu_list) {
  foreach ($menu_list as $item) {
    $menu_name = get_option('magethemes_zen_menu_'.$item);
    ?>
    <li class="item">
      <a href="#<?= sanitize_title($menu_name) ?>" class="title"><?= $menu_name ?></a>
    </li>
  <?php
  }
};
?>

<div class="main">

  <!-- Header -->
  <div class="header">


    <!-- Menu -->
    <div class="menu">
      <div class="container">
        <h1 class="logo-header" title="<?= $name_bloginfo ?>"><?= $name_bloginfo ?></h1>
        <?php global $menus; ?>
        <ul class="menu-content">
          <?= top_side_menu($menus) ?>
        </ul>
      </div>
    </div>
     <!-- Menu Ends -->

  </div>
  <!-- Header Ends! -->