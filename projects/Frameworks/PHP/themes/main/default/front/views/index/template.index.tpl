{if !$request_async}{include file="includes/template.head.tpl"}{/if}
<h1>{$content.titre}</h1>
{form_instance->display}
{if !$request_async}{include file="includes/template.footer.tpl"}{/if}