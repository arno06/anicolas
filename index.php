<?php
define("PROJECT_DIR", "./projects/");
$filters = array(".svn", ".", "..", "common");
$colors = array("#fff");

function truncate($pStr, $pLength, $pEnd = "...")
{
	if(strlen($pStr)<=$pLength)
		return $pStr;
	return substr($pStr, 0, $pLength-strlen($pEnd)).$pEnd;
}

$base_folders = scandir(PROJECT_DIR);
$folders = array();
foreach($base_folders as $f)
{
	if(!is_dir(PROJECT_DIR.$f) || in_array($f, $filters))
		continue;
	$folders[] = array("path"=>$f, "name"=>truncate($f, 10), "description"=>"Lorem Ipsum", "img"=>"", "color"=>$colors[round(rand(0, count($colors)-1))]);
}
?><!DOCTYPE html>
<html>
	<head>
		<title>Hi, I'm Arnaud NICOLAS</title>
		<link rel="shortcut icon" type="image/png" href="favicon.png" />
		<!-- Hi again, since you're here you deserve a little gift : http://imgur.com/LZ8bW -->
		<link href='http://fonts.googleapis.com/css?family=Quicksand:400,700' rel='stylesheet' type='text/css'>
		<script src="projects/Dependencies/src/?need=M4,M4Tween"></script>
		<style>
			*{margin:0;padding:0;font-family: 'Quicksand', sans-serif;cursor:default;}
			html, body{overflow:hidden;background:-moz-radial-gradient( center, circle, #fefefe, #cecece) fixed;background:-webkit-radial-gradient( center, circle, #fefefe, #cecece) fixed;}
			img{border:none;}
			.clear{clear:both;}
			.card{width:500px;height:300px;position:absolute;left:50%;top:50%;margin-top:-150px;margin-left:-250px;}

			.square{box-shadow: 1px 0 2px rgba(0, 0, 0, .2);width:0;height:0;overflow: hidden;}
			.square:hover{}
			.square>div{}

			.square.lab{float:left;margin-left:100px;margin-top:100px;background:#16a085;color:#ffffff;transition:all .5s;cursor:pointer;}
			.square.lab>div{font-weight: bold;font-size:52px;text-align: center;cursor:pointer;}
			.square.lab:hover{color:#16a085;background:#ffffff;}

			.square.lab.max{transition:none;background:#ffffff;width:500px;overflow:hidden;margin:0;/*-webkit-transform:rotate(-90deg);transform:rotate(-90deg);*/}
			.square.lab.max:hover{}
			.square.lab.max ul{list-style: none;width:517px;height:500px;overflow-y: scroll;overflow-x: hidden;position:relative;}
			.square.lab.max ul li{display:block;float:left;width:99px;height:99px;border-right:1px solid #555555;border-bottom:1px solid #555555;}
			.square.lab.max ul li a{display:block;width:99px;height:99px;cursor:pointer;position:relative;text-align: center;color:#000000;}
			.square.lab.max ul li a span:first-child{position:absolute;width:100px;height:100px;display:none;}
			.square.lab.max ul li a span:last-child{margin-left:25px;margin-top:30px;width:99px;height:99px;display:block;position:absolute;transform:rotate(-45deg);-webkit-transform:rotate(-45deg);cursor:pointer;}
			.square.lab.max ul li.stepup{margin-top:-100px;}
			.square.lab.max ul li.double{width:199px;height:199px;}

			.square.whois{background:#2980b9;margin-top:200px;margin-left:200px;float:left;}
			.square.whois>div{text-align: center;width:200px;color:#eeeeee;margin-top:50px;}
			.square.whois>div h1{color:#ffffff;line-height: 35px;}

			.square.portrait{background:#ffffff;margin-left:100px;margin-right:100px;margin-top:100px;}
			.square.portrait>div{margin-top:-10px;}

			.square.more{background:#ecf0f1;float:left;margin-top:-100px;}
			.square.more>div{margin-top:71px;margin-left:25px;position:relative;}
			.square.more>div>p{text-align: justify;width:200px;}
			.square.more>div>p span{font-weight: 800;}
			.square.more>div .actions{width:60px;position: absolute;top:130px;left:67px;box-shadow: 0 0 2px rgba(0, 0, 0, .2);transform: rotate(45deg);-webkit-transform: rotate(45deg);}
			.square.more>div .actions a{transition:all .5s;cursor:pointer;padding-top:4px;padding-left:4px;display:block;width:26px;height:26px;float:left;background: #ff0000;color:#ffffff;font-size:13px;font-weight: 800;text-align: center;text-decoration: none;}
			.square.more>div .actions a span{cursor:pointer;display:block;width:30px;height:30px;transform: rotate(-45deg);-webkit-transform: rotate(-45deg);}
			.square.more>div .actions a.gp{background:#dc4836;}
			.square.more>div .actions a.gp:hover{color:#dc4836;background:#ffffff;}
			.square.more>div .actions a.gc{background:#005bab;}
			.square.more>div .actions a.gc:hover{color:#005bab;background:#ffffff;}
			.square.more>div .actions a.at{background:#ffffff;color:#444444;}
			.square.more>div .actions a.at:hover{background:#444444;color:#ffffff;}
			.square.more>div .actions a.in{background:#0978b5;}
			.square.more>div .actions a.in:hover{background:#ffffff;color:#0978b5;}

		</style>
		<script>

			var an =
			{
				init:function()
				{
					var _ = an.u._;
					var __ = an.u.__;
					var p = an.u.peak;

					M4Tween.to(_(".square.lab"),.3, {width:"67px", height:"67px", 'marginTop':"33px", "marginLeft":"33px", delay:.8});
					M4Tween.to(_(".square.whois"),.3, {width:"200px", "height":"200px", "marginTop":"0px", "marginLeft":"0px", delay:.5})
						.then(_(".square.portrait"),.3, {width:"100px", height:"100px", "marginRight":"0px", "marginTop":"0px"})
						.then(_(".square.more"),.4, {width:"300px", "height":"300px"})
						.onComplete(function()
						{
							__(".square>div").forEach(function(pEl)
							{
								M4Tween.to(pEl,.5, {"rotate":"-45deg"});
							});
							M4Tween.to(_(".card"),.5, {rotate:"45deg"})
								.onComplete(function()
								{
									p(_(".square.lab>div"), {fontSize:"70px", marginTop:"-10px"}, .3, .5);
									p(_(".square.more>div .actions a.gc span"), {"fontSize":"20px", marginTop:"-3px", "marginLeft":"-3px"}, .3, .7);
									p(_(".square.more>div .actions a.gp span"), {"fontSize":"20px", marginTop:"-3px", "marginLeft":"-3px"}, .3, .8);
									p(_(".square.more>div .actions a.in span"), {"fontSize":"20px", marginTop:"-3px", "marginLeft":"-3px"}, .3, .8);
									p(_(".square.more>div .actions a.at span"), {"fontSize":"20px", marginTop:"-3px", "marginLeft":"-3px"}, .3, .9);
								});
						});
					_(".square.lab").addEventListener("click", an.lab.in);
				},
				lab:
				{
					in:function()
					{
						an.u._(".square.lab").removeEventListener("click", an.lab.in);
						an.u._(".square.lab").style.pointerEvents = "none";
						M4Tween.killTweensOf(an.u._(".square.lab.max"));
						M4Tween.to(an.u._(".square.lab.max"),.5, {"height":"500px", marginTop:"0px"});
						M4Tween.killTweensOf(an.u._(".card"));
						M4Tween.to(an.u._(".card"),.5, {"marginTop":"-400px", "marginLeft":"-70px"});
					},
					out:function()
					{
						an.u._(".square.lab").addEventListener("click", an.lab.in);
						an.u._(".square.lab").style.pointerEvents = "all";
					}
				},
				u:
				{
					peak:function(pSel, pStyle, pDuration, pDelay)
					{
						pDelay = (pDelay||0)*1000;
						var style = document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(pSel, null):el.style;

						setTimeout(function()
						{
							var to = {};
							for(var i in pStyle)
							{
								if(!pStyle.hasOwnProperty(i))
									continue;
								to[i] = style[i];
								pSel.style[i] = pStyle[i];
							}
							M4Tween.to(pSel, pDuration, to);
						}, pDelay);
					},
					_:function(p){return document.querySelector(p);},
					__:function(p){return document.querySelectorAll(p);}
				}
			};

			window.addEventListener("load", an.init, false);
		</script>
	</head>
	<body>
		<div class="card">
			<div class="square lab">
				<div class="content">
					+
				</div>
			</div>
			<div class="square portrait">
				<div class="content">
					<img src="./imgs/avatar.png">
				</div>
			</div>
			<div class="square whois">
				<div class="content">
					<span>Hi, I'm</span>
					<h1>Arnaud NICOLAS</h1>
				</div>
			</div>
			<div class="square more">
				<div class="content">
					<p>I'm a <span>web developer</span> and I currently work in Paris as <span>Technical Lead</span>.</p>
					<div class="actions">
						<a href="http://code.google.com/p/anicolas/" class="gc" target="_blank"><span>{P}</span></a>
						<a href="http://fr.linkedin.com/pub/arnaud-nicolas/11/561/62a" class="in" target="_blank"><span>in</span></a>
						<a href="https://plus.google.com/u/0/104589649061129292726/posts" class="gp" target="_blank"><span>G+</span></a>
						<a href="#" class="at"><span>@</span></a>
					</div>
				</div>
			</div>
			<div class="square lab max">
				<ul>
<?php
$i = 0;
$toCorrect = 0;
$toPass = 0;
$toTrigger = false;
foreach($folders as $f)
{
	$class = $f["name"]=="M4Tween"?"double":"";
	$style = "";
	if(++$i==5)
		$i=0;
	if($toPass!=0)
	{
		$toPass--;
		if($toPass==0)
			$i=0;
	}
	if($class == "double")
	{
		$toCorrect = $i-1;
		$toPass = ((5-($i+1))*2)+1;
	}
	if($toPass==0 && $toCorrect!=0)
	{
		$class = "stepup";
		$toCorrect--;
		$style = "margin-left:".(100*$i)."px";
	}
	echo '<li class="'.$class.'" style="'.$style.'"><a href="./projects/'.$f["path"].'/" style="background:'.$f["color"].'"><span><img src="'.$f['img'].'" alt="'.$f['description'].'"></span><span>'.$f['name'].'</span></a></li>';
}?>
				</ul>
				<div class="clear"></div>
			</div>
		</div>
	</body>
</html>
