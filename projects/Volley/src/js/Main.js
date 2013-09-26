var fa =
{
	loader:null,
	data:null,
	container:null,
	clickEvent:"click",
	referrer:"http://www.arnaud-nicolas.fr/projects/Volley/src/",
	init:function()
	{
		var apps;
		if(apps = window.navigator.mozApps)
		{
			var manifest = fa.referrer+"manifest.webapp";
			var request = apps.checkInstalled(manifest);
			request.onsuccess = function()
			{
				if(request.result)
					return;

				var inst = apps.install(manifest);
				inst.onsuccess = function ()
				{
					alert("L'installation s'est effectuée avec succès !");
				};
				inst.onerror = function (){};
			};
			request.onerror = function()
			{
				alert("je suis pas content là");
			};
		}
		fa.clickEvent = "click";//("ontouchend" in document)?"touchend":"mouseup";
		fa.$ = {};
		fa.$.loader = document.querySelector("#loader");
		fa.$.loaderBar = document.querySelector("#loader>div");
		fa.$.container = document.querySelector("#container");
		fa.$.container.style.height = document.body.offsetHeight - 40+"px";
		document.querySelector("#box").addEventListener(fa.clickEvent, fa.hideBoxHandler, false);
		document.querySelectorAll("menu div").forEach(function(element){element.addEventListener(fa.clickEvent, fa.clickButtonHandler, false);});
		fa.loadData();
	},
	clickButtonHandler:function(e)
	{
		document.querySelectorAll("menu div").forEach(function(element){element.removeAttribute("class");});
		e.currentTarget.setAttribute("class", "current");
		switch(e.currentTarget.dataset.name)
		{
			case "championship":
				fa.displayRanking();
				break;
			case "calendar":
				fa.displayCalendar();
				break;
			case "stats":
				fa.displayStats();
				break;
			default:
				console.log(e.currentTarget.dataset.name);
				break;
		}
	},
	displayRanking:function()
	{
		fa.$.container.innerHTML = "";
		fa.$.container.appendChild(fa.$.ranking);
	},
	displayCalendar:function()
	{
		fa.$.container.innerHTML = "";
		fa.$.container.appendChild(fa.$.agenda);
	},
	displayStats:function()
	{
		fa.$.container.innerHTML = "";

		if(fa.$.stats)
		{
			fa.$.container.appendChild(fa.$.stats);
			return;
		}

		fa.$.stats = M4.createElement("div", {parentNode:fa.$.container});

		var max = fa.data.agenda.length;
		var width = fa.$.container.offsetWidth-20;
		var distance = Math.round(width / max);
		var teams = [
			{name:"CSM Eaubonne",color:"rgba(255, 214, 0, 1)",totalPointWon:0,totalPointLost:0, pointsWon:[], pointsLost:[], setsWon:[], setsLost:[], matchesWon:[], matchesLost:[]},
			{name:"VBC Ermont",color:"rgba(170, 170, 170, 1)",totalPointWon:0,totalPointLost:0, pointsWon:[], pointsLost:[], setsWon:[], setsLost:[], matchesWon:[], matchesLost:[]},
			{name:"ACS Cormeilles 2",color:"rgba(224, 144, 0, 1)",totalPointWon:0,totalPointLost:0, pointsWon:[], pointsLost:[], setsWon:[], setsLost:[], matchesWon:[], matchesLost:[]}
		];

		var legend = M4.createElement("div", {"class":"legend", parentNode: fa.$.stats, style:{width:width+"px"}});
		max = teams.length;
		for(var i = 0;i<max;i++)
		{
			team = teams[i];
			var ct = M4.createElement("div", {"class":"element", parentNode:legend, style:{"height":"20px"}});
			M4.createElement("div", {parentNode:ct, style:{"display":"inline-block", "backgroundColor":team.color, width:"10px", "height":"10px"}});
			M4.createElement("div", {parentNode:ct, text:team.name, style:{color:"#666666","display":"inline-block", "marginLeft":"5px"}});
		}

		var day_data, opponent, team;
		max = fa.data.agenda.length;
		for(i = 0; i<max;i++)
		{
			var day = fa.data.agenda[i];
			if(!day.matches.length)
				continue;

			for(var k = 0, maxk = teams.length;k<maxk;k++)
			{
				day_data = null;
				for(var j = 0, maxj = day.matches.length;j<maxj;j++)
				{
					var m = day.matches[j];
					if(teams[k].name == m.home.name)
					{
						opponent = m.guest;
						day_data = m.home;
						j = maxj;
					}
					if(teams[k].name == m.guest.name)
					{
						opponent = m.home;
						day_data = m.guest;
						j = maxj;
					}
				}
				if(!day_data)
					continue;
				var p = Number(day_data.points)||0;
				teams[k].pointsWon.push(p);
				p = Number(opponent.points)||0;
				teams[k].pointsLost.push(p);
				p = Number(day_data.set)||0;
				teams[k].setsWon.push(p);

				teams[k].matchesWon.push(p==3?1:0);
				teams[k].matchesLost.push(p==3?0:1);

				p = Number(opponent.set)||0;
				teams[k].setsLost.push(p);
			}
		}

		fa.generateGraph(teams, "pointsWon", width, 200, distance, "Journées", "Points gagnés");
		fa.generateGraph(teams, "pointsLost", width, 200, distance, "Journées", "Points perdus");
		fa.generateGraph(teams, "setsWon", width, 200, distance, "Journées", "Sets gagnés");
		fa.generateGraph(teams, "setsLost", width, 200, distance, "Journées", "Sets perdus");
		fa.generateGraph(teams, "matchesWon", width, 200, distance, "Journées", "Matches gagnés");
		fa.generateGraph(teams, "matchesLost", width, 200, distance, "Journées", "Matches perdus");
	},
	generateGraph:function(pDatas, pProp, pWidth, pHeight, pDistance, pXLabel, pYLabel)
	{
		var s = new Stage(pWidth, pHeight, fa.$.stats);
		s.domElement.style.cssText = "display:block;margin:10px auto;";
		s.beginFill("rgba(0, 0, 0, 0)");
		s.setLineStyle(2, "rgb(0, 0, 0)");
		s.moveTo(1, 1);
		s.lineTo(1, pHeight-1);
		s.lineTo(pWidth-1, pHeight-1);
		s.setFont("Arial", "11px", "rgb(0, 0, 0)");
		s.drawText(pYLabel, 4, 1);
		s.setLineStyle(.5, "rgba(0, 0, 0, .2)");
		s.moveTo(pWidth>>1, 0);
		s.lineTo(pWidth>>1, pHeight-1);
		var w = s.measureText(pXLabel);
		s.drawText(pXLabel, pWidth - (w + 10), 181);

		var maxY = 0;

		pDatas.forEach(function(element)
		{
			var value = 0;
			element[pProp].forEach(function(pV)
			{
				value += pV;
			});
			maxY = Math.max(maxY, value);
		});
		pDatas.forEach(function(team)
		{
			var currentValue = 0;
			var j = 0;
			s.beginFill("rgba(0, 0, 0, 0)");
			s.setLineStyle(1, team.color);
			s.moveTo(0, 200);
			team[pProp].forEach(function(pV)
			{
				currentValue += pV;
				var x =10 + ((j++) * pDistance);
				var y = 200 - ((180/maxY) * currentValue);
				s.lineTo(x,  y);
			});

			currentValue = 0;
			j = 0;
			team[pProp].forEach(function(pV)
			{
				currentValue += pV;
				var x =10 + ((j++) * pDistance);
				var y = 200 - ((180/maxY) * currentValue);
				s.beginFill(team.color);
				s.drawRect(x-2, y-2, 4, 4);
				s.endFill();
			});
		});

		s.pause();
	},
	hideBoxHandler:function()
	{
		fadeOut(document.querySelector("#box"),.5);
	},
	loadData:function()
	{
		fadeIn(fa.$.loader, .4);

//		Request.load("assets/ffvb95_12-13.json").onProgress(fa.dataProgressHandler).onComplete(fa.dataLoaded);
		Request.load("php/proxy.ffvb.php").onProgress(fa.dataProgressHandler).onComplete(fa.dataLoaded);
	},
	dataProgressHandler:function(e)
	{
		var value = Math.round(e.loaded / e.total);
		M4Tween.killTweensOf(fa.$.loaderBar.querySelector("div"));
		M4Tween.to(fa.$.loaderBar.querySelector("div"),.5, {width:value+"%"})
	},
	dataLoaded:function(e)
	{
		fa.data = e.responseJSON;
		fa.parseAgenda();
		fa.parseRanking();
		fa.displayCalendar();
		M4Tween.killTweensOf(fa.$.loaderBar.querySelector("div"));
		M4Tween.to(fa.$.loaderBar.querySelector("div"),.5, {width:"100%"})
			.onComplete(function()
			{
				M4Tween.to(fa.$.loaderBar,.4, {marginTop:"10px", "opacity":"0"})
					.onComplete(function()
					{
		                fadeOut(fa.$.loader, 1);
					});
			});

	},
	parseRanking:function()
	{
		var ranking = M4.createElement("div", {"id":"ranking"});
		var entry, item, fair;
		for(var i = 0, max = fa.data.ranking.length; i<max;i++)
		{
			item = fa.data.ranking[i];
			fair = i%2 ? " odd":"";
			entry = M4.createElement("div", {"class":"entry"+fair, "id":"entry_"+i, "parentNode":ranking});
			M4.createElement("div", {"class":"rank", "text":(i+1)+".", "parentNode":entry});
			M4.createElement("div", {"class":"name", "htmlText":item.name, "parentNode":entry});
			M4.createElement("div", {"class":"clear", "parentNode":entry});
			M4.createElement("div", {"class":"day", "htmlText":item.matches.played+" <span class='units'>j</span>", "parentNode":entry});
			M4.createElement("div", {"class":"champ_points", "htmlText":item.championship_points+" <span class='units'>Pts</span>", "parentNode":entry});
			M4.createElement("div", {"class":"clear", "parentNode":entry});
			var extra = M4.createElement("div", {"class":"extra", "parentNode":entry});

			var totalSet = {won:0, lost:0};
			var totalPoints = {won:0, lost:0};
			for(var k = 0, maxk = fa.data.agenda.length; k<maxk;k++)
			{
				var day = fa.data.agenda[k];
				if(!day.matches.length)
					continue;
				for(var j = 0, maxj = day.matches.length; j<maxj;j++)
				{
					var match = day.matches[j];
					var played = match.home.points&&match.home.points>=0;
					if((match.home.name != item.name && match.guest.name != item.name)||!played)
						continue;
					var isHome = match.home.name == item.name;
					var opponent = isHome ? match.guest.name : match.home.name;
					var current = isHome? match.home:match.guest;
					var score = isHome? match.home.set+" - "+match.guest.set : match.guest.set+" - "+match.home.set;

					totalSet.won += (Number(isHome?match.home.set:match.guest.set)||0);
					totalSet.lost += (Number(isHome?match.guest.set:match.home.set)||0);

					totalPoints.won += Number(isHome?match.home.points:match.guest.points)||0;
					totalPoints.lost += Number(isHome?match.guest.points:match.home.points)||0;

					var className = current.set==3?"won":"lost";
					var state = className == "won" ? "Gagné":"Perdu";
					var html = "<span class='"+className+"'>"+state+"</span> <span class='score'>("+score+")</span> contre <span class='opponent'>"+opponent+"</span>";
					M4.createElement('div', {"class":"match", "htmlText":html, "parentNode":extra});
				}

			}
			var sets = M4.createElement("div", {class:"sets", parentNode:extra});
			M4.createElement("h3", {"text":"Sets", "parentNode":sets});
			M4.createElement("div", {"class":"won", "text":totalSet.won, parentNode:sets, style:{width:Math.round((totalSet.won/(totalSet.won+totalSet.lost))*100)+"%"}});
			M4.createElement("div", {"class":"lost", "text":totalSet.lost, parentNode:sets, style:{width:Math.round((totalSet.lost/(totalSet.won+totalSet.lost))*100)+"%"}});

			var points = M4.createElement("div", {class:"points", parentNode:extra});
			M4.createElement("h3", {"text":"Points", "parentNode":points});
			M4.createElement("div", {"class":"won", "text":totalPoints.won, parentNode:points, style:{width:Math.round((totalPoints.won/(totalPoints.won+totalPoints.lost))*100)+"%"}});
			M4.createElement("div", {"class":"lost", "text":totalPoints.lost, parentNode:points, style:{width:Math.round((totalPoints.lost/(totalPoints.won+totalPoints.lost))*100)+"%"}});

			entry.addEventListener(fa.clickEvent, fa.rankingEntryClickedHandler, false);
		}
		fa.$.ranking = ranking;
	},
	rankingEntryClickedHandler:function(e)
	{
		fadeIn(document.querySelector("#box"),.4);
		var t = e.currentTarget.querySelector("div.extra").innerHTML;
		document.querySelector("#box>div").innerHTML = "<div class='name'>"+e.currentTarget.querySelector("div.name").innerHTML+"</div>"+"<div class='matches'>"+t+"</div>";
	},
	parseAgenda:function()
	{
		var agenda = M4.createElement("div", {"id":"agenda"});
		M4.createElement("a", {"href":"php/icalendar.php", "htmlText":"T&eacute;l&eacute;charger le calendrier", "parentNode":agenda, "class":"button"});
		var entry, day, fair, match, container;
		for(var i = 0, max = fa.data.agenda.length; i<max;i++)
		{
			day = fa.data.agenda[i];
			if(!day.matches.length)
				continue;
			fair = i%2==0 ? " fair":"";
			entry = M4.createElement("div", {"class":"entry"+fair, "id":"entry_"+i, "parentNode":agenda});
			M4.createElement("h2", {"htmlText":day.label+" <span>("+day.matches.length+" matches)</span>", "parentNode":entry});

			for(var j = 0, maxj = day.matches.length; j<maxj;j++)
			{
				match = day.matches[j];
				var played = match.home.points&&match.home.points>=0;
				var className = match.home.set==3?" home_won":" guest_won";
				if(!played)
					className = "";
				container = M4.createElement("div", {"class":"match"+className, "parentNode":entry});
				M4.createElement("div", {"class":"home", "htmlText":match.home.name, "parentNode":container});
				if(played)
					M4.createElement("div", {"class":"home_set", "htmlText":match.home.set, "parentNode":container});
				M4.createElement("div", {"class":"vs", "htmlText":"VS", "parentNode":container});
				M4.createElement("div", {"class":"guest", "htmlText":match.guest.name, "parentNode":container});
				if(played)
					M4.createElement("div", {"class":"guest_set", "htmlText":match.guest.set, "parentNode":container});
				else
				{
					var t = match.date?"<span>"+match.date+"</span><br>"+match.hour:"<small>&nbsp;</small><span>&Agrave; reporter</span>";
					M4.createElement("div", {"class":"date", "htmlText":t, "parentNode":container});
				}
			}
		}
		fa.$.agenda = agenda;
	}
};


function fadeIn(pElement, pTime, pComplete){M4Tween.killTweensOf(pElement, false);pElement.style.display = "block";M4Tween.to(pElement, pTime, {opacity:1}).onComplete(pComplete);}
function fadeOut(pElement, pTime, pComplete){var c = function(){if(pComplete){pComplete();}pElement.style.display="none";};if(pElement.style.opacity==0){c();return;}M4Tween.to(pElement, pTime, {opacity:0}).onComplete(c);}
window.addEventListener("load", fa.init, false);