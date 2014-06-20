{include file="includes/template.head.tpl"}
	<div id="bloc-identification">
	<h1>Identification</h1>
	{if $content.error!=""}
	<div class='error'>{$content.error}</div>
	{/if}
	{form_login->display controller="index" action="connexion"}
	</div>
{include file="includes/template.footer.tpl"}