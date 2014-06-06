<?php /* Smarty version 2.6.18, created on 2014-05-23 17:34:11
         compiled from includes/template.head.tpl */ ?>
<!DOCTYPE html>
<html lang="<?php echo $this->_tpl_vars['configuration']['site_currentLanguage']; ?>
">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=<?php echo $this->_tpl_vars['configuration']['site_encoding']; ?>
" >
        <base href="<?php echo $this->_tpl_vars['configuration']['server_url']; ?>
"/>
		<title><?php echo $this->_tpl_vars['head']['title']; ?>
</title>
        <?php if (isset ( $this->_tpl_vars['content']['canonical'] ) && ! empty ( $this->_tpl_vars['content']['canonical'] )): ?>
            <link rel="canonical" href="<?php echo $this->_tpl_vars['content']['canonical']; ?>
">
        <?php endif; ?>
		<meta name="description" content="<?php echo $this->_tpl_vars['head']['description']; ?>
"/>
		<link type="text/css" rel="stylesheet" href="<?php echo $this->_tpl_vars['path_to_theme']; ?>
/css/style.css">
<?php $_from = $this->_tpl_vars['styles']; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array'); }if (count($_from)):
    foreach ($_from as $this->_tpl_vars['style']):
?>
		<link type="text/css" rel="stylesheet" href="<?php echo $this->_tpl_vars['style']; ?>
">
<?php endforeach; endif; unset($_from); ?>
<?php $_from = ($this->_tpl_vars['scripts']); if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array'); }if (count($_from)):
    foreach ($_from as $this->_tpl_vars['script']):
?>
        <script type="text/javascript" src="<?php echo $this->_tpl_vars['script']; ?>
"></script>
<?php endforeach; endif; unset($_from); ?>
	</head>
	<body>