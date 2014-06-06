{if $is_error}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
        <base href="{$server_url}"/>
		<title>Une erreur est apparue !</title>
		<script type="text/javascript" src="{$dir_to_js}/prototype.js"></script>
		<script type="text/javascript" src="{$dir_to_js}/cbi/Debugger.js"></script>
		<script type="text/javascript" src="{$dir_to_js}/Minuit4/M4Tween.js"></script>
        <script type="text/javascript">Debugger.error = true;</script>
	</head>
	<body>
{/if}
		<style type="text/css"><!--@import URL("{$dir_to_theme}/css/debugger.css");--></style>
		<div id="debug" {if $open}style="height:350px;"{/if}><div id="debug_global">Temps d'exécution : <span id="debug_time">{$timeToGenerate}</span> sec  -  Mémoire utilisée : <span id="debug_memory">{$memUsage}</span></div>
			<div id="debug_control">
                <a id="debug_fullscreen">Fullscreen</a> - <a id="debug_toggle">{if $open}Minimiser{else}Agrandir{/if}</a> - <a id="debug_close">Fermer</a>
			</div>
			<div class="clean"></div>
			<div id="debug_buttons">
				<div rel="trace">
					<span>&nbsp;</span>Traces&nbsp; <span class="count">({$count.trace})</span>
				</div>
				<div rel="notice">
					<span>&nbsp;</span>Notices <span class="count">({$count.notice})</span>
				</div>
				<div rel="warning">
					<span>&nbsp;</span>Warnings <span class="count">({$count.warning})</span>
				</div>
				<div rel="error">
					<span>&nbsp;</span>Erreurs & Exceptions <span class="count">({$count.error})</span>
				</div>
				<div rel="query">
					<span>&nbsp;</span>Requ&ecirc;tes SQL <span class="count">({$count.query})</span>
				</div>
				<div rel="cookie" class="vars disabled">
					cookie <span class="count">({$count.cookie})</span>
				</div>
				<div rel="session" class="vars disabled">
					session <span class="count">({$count.session})</span>
				</div>
				<div rel="post" class="vars disabled">
					post <span class="count">({$count.post})</span>
				</div>
				<div rel="get" class="vars">
					get <span class="count">({$count.get})</span>
				</div>
			</div>
			<div class="debug_content">
				<div class="debug_console">
					<table class="console" cellpadding="0" cellspacing="0">
						{$console}
					</table>
				</div>
				<div class="debug_vars">
					<pre rel="get">{$vars.get}</pre>
					<pre rel="post" style="display:none;">{$vars.post}</pre>
					<pre rel="session" style="display:none;">{$vars.session}</pre>
					<pre rel="cookie" style="display:none;">{$vars.cookie}</pre>
				</div>
			</div>
		</div>
{if $is_error}
	</body>
</html>
{/if}