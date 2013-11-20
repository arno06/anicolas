<div id="ranking">
{foreach $ranking $item $key}
	<div class="entry {if $key%2==0}even{else}odd{/if}">
		<span class="ranking">{=add(1, $key)}</span>
		<span class="name">{=truncate($item.name, 20)}</span>
		<div class="clear"></div>
		<span class="day">{$item.matches.played} <span>j</span></span>
		<span class="points">{$item.championship_points} <span>pts</span></span>
		<div class="clear"></div>
	</div>
{/foreach}
</div>