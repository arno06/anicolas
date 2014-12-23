{include file="includes/template.head.tpl"}
<div class="intro">

    <h1>{$details.name}</h1>
    <div class="about">
        {if !empty($details.details.date)}<div class="date">Date : {$details.details.date}</div>{/if}
        {if !empty($details.details.version)}<div class="version">Version : {$details.details.version}</div>{/if}
    </div>
    <div class="description">
        {'<br/>'|implode:$details.details.description}
    </div>
    {foreach from=$details.methods item="method"}
        <div class="method" id="method_{$method.name}">
            <h2>{$method.name}</h2>
            <div class="description">{"<br/>"|implode:$method.details.description}</div>
            <div class="call">
                <h3>Appel</h3>
                <pre class="php">$instance->{$method.name}(...)</pre>
                <div class="parameters">
                    <table>
                        {foreach from=$method.details.parameters item="param"}
                            <tr>
                                <td class="varname"><span>${$param.name}</span></td>
                                <td class="vartype"><span>{$param.type}</span></td>
                                <td class="vardesc">{$param.desc}</td>
                            </tr>
                        {/foreach}
                    </table>
                </div>
            </div>
            <div class="return">
                <h3>Réponse</h3>
                <div class="vartype"><span>{if isset($method.details.return.type)}{$method.details.return.type}{else}void{/if}</span></div>
            </div>
        </div>
    {/foreach}
</div>
{include file="includes/template.footer.tpl"}