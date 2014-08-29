{include file="includes/template.head.tpl"}

<h1>{$content.h1}</h1>
{if $content.has.add}
    <div class="new-entry">
        <a href="{$controller}/ajouter/" class="button-medium">Ajouter une entr&eacute;e</a>
    </div>
{/if}
<table class="table-liste" cellpadding="0" cellspacing="0">
    <tr class="tr-titre">
        {foreach from=$content.titles item=title}
            <td class="td-{$title.champ}-title">
                {$title.label}<br/>
                {if $title.order}<a href="{$controller}/lister/order:{$title.champ}/by:asc/"><img src="{$path_to_theme}/imgs/by-asc.png" alt="by-asc"/></a>
                <a href="{$controller}/lister/order:{$title.champ}/by:desc/"><img src="{$path_to_theme}/imgs/by-desc.png" alt="by-desc"/></a>{/if}
            </td>
        {/foreach}
        {if $content.has.modify}
            <td class="td-edit"></td>
        {/if}
        {if $content.has.delete}
            <td class="td-delete"></td>
        {/if}
    </tr>
    {foreach from=$content.liste item=item}
        <tr class="tr-liste">
            {foreach from=$content.titles item=title}
                {if $title.champ|strpos:"online" === 0}
                    <td class="td-liste center" width="100">{if $item[$title.champ] > 0}Oui{else}Non{/if}</td>
                {else}
                    <td class="td-liste">{$item[$title.champ]}</td>
                {/if}
            {/foreach}
            {if $content.has.modify}
                <td><a href="{rewriteurl action="modifier" controller=$controller id=$item[$content.id]}" class="a-edit"><img src="{$path_to_theme}/imgs/edit.png" alt="Modifier"/></a></td>
            {/if}
            {if $content.has.delete}
                <td><a href="{rewriteurl action="supprimer" controller=$controller id=$item[$content.id]}" class="a-delete"><img src="{$path_to_theme}/imgs/delete.png" alt="Supprimer"/></a></td>
            {/if}
        </tr>
        {foreachelse}
        <tr class="tr-empty">
            <td colspan="{$content.titles|@count}">Aucun enregistrement</td>
            {if $content.has.modify}
                <td></td>
            {/if}
            {if $content.has.delete}
                <td></td>
            {/if}
        </tr>
    {/foreach}
</table>
{if $content.paginationInfo}
    {getPagination info=$content.paginationInfo}
{/if}
{include file="includes/template.footer.tpl"}