{include file="includes/template.head.tpl"}
<h1>{$content.h1}</h1>
<div class="back">
    <a href="{$controller}/" class="button {if not isset($content.actions.listing)}disabled{/if}">Retour à la liste</a>
</div>
<div class="details form">
    {form_instance->display}
</div>
{include file="includes/template.footer.tpl"}