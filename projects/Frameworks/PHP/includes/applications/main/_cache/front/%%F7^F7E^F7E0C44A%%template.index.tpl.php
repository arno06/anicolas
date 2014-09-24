<?php /* Smarty version 2.6.18, created on 2014-09-19 10:59:14
         compiled from index/template.index.tpl */ ?>
<?php if (! $this->_tpl_vars['request_async']): ?><?php $_smarty_tpl_vars = $this->_tpl_vars;
$this->_smarty_include(array('smarty_include_tpl_file' => "includes/template.head.tpl", 'smarty_include_vars' => array()));
$this->_tpl_vars = $_smarty_tpl_vars;
unset($_smarty_tpl_vars);
 ?><?php endif; ?>
<h1><?php echo $this->_tpl_vars['content']['titre']; ?>
</h1>
<?php echo $this->_reg_objects['form_instance'][0]->display(array(), $this);?>

<?php if (! $this->_tpl_vars['request_async']): ?><?php $_smarty_tpl_vars = $this->_tpl_vars;
$this->_smarty_include(array('smarty_include_tpl_file' => "includes/template.footer.tpl", 'smarty_include_vars' => array()));
$this->_tpl_vars = $_smarty_tpl_vars;
unset($_smarty_tpl_vars);
 ?><?php endif; ?>