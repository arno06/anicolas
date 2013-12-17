<div id="agenda">
{foreach $agenda $day}
	{if $day.matches.length!=0}
		<div class="day">
			<h2>{$day.label} <span>{$day.matches.length} matches</span></h2>
			{foreach $day.matches $match}
				<div class="match {if $match.home.points>=0}{if $match.home.set==3}home_won{else}guest_won{/if}{/if}">
					<div class="home">{$match.home.name}</div>
					{if $match.home.points>=0}
						<div class="home_set">{$match.home.set}</div>
					{/if}
					<div class="vs">VS</div>
					<div class="guest">{$match.guest.name}</div>
					{if $match.home.points>=0}
						<div class="guest_set">{$match.guest.set}</div>
					{else}
						<div class="date">
							<span>{$match.date}</span><br/>
							{$match.hour}
						</div>
					{/if}
				</div>
			{/foreach}
		</div>
	{/if}
{/foreach}
</div>