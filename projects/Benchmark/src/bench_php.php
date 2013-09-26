<?php
set_time_limit(0);
ini_set("display_errors", E_COMPILE_ERROR);

function boucleFor($pTableau)
{
	$return = "";
	$max = count($pTableau);
	for($j=0;$j<$max-1;$j++)
		$return = $pTableau[$j].$return;
	return $return;
}

function boucleForeach($pTableau)
{
	$return = "";
	foreach($pTableau as &$value)
		$return = $value.$return;
	return $return;
}

function boucleWhile($pTableau)
{
	$return = "";
	$i = 0;
	while(isset($pTableau[$i]))
	{
		$return = $pTableau[$i].$return;
		++$i;
	}
	return $return;
}

function bitMashing($pValue)
{
	if($pValue&1)
		$v = "pair";
	else
		$v = "impair";
	return $v;
}

function estPair($pValue)
{
	if($pValue%2)
		$v = "impair";
	else
		$v = "pair";
	return $v;
}

function ifElse($pValue)
{
	if(!$pValue)
	{
		$pValue = false;
	}
	else
	{
		$pValue = true;
	}
	return $pValue;
}

function operateurTernaire($pValue)
{
	return !$pValue?false:true;
}

function switchValue($pValue)
{
	switch($pValue)
	{
		case 12:
			$pValue = true;
		break;
		default:
			$pValue = false;
		break;
	}
	return $pValue;
}

function strReplace($pValue)
{
	return str_replace("12", "str_replace", $pValue);
}

function pregReplace($pValue)
{
	return preg_replace("/12/", "preg_replace", $pValue);
}

function multiplicationMoitie($pValue)
{
	return $pValue * .5;
}

function divisionMoitie($pValue)
{
	return $pValue / 2;
}

function bitRight($pValue)
{
	return $pValue>>1;
}

function divisionDouble($pValue)
{
	return $pValue / .5;
}

function multiplicationDouble($pValue)
{
	return $pValue * 2;
}

function bitLeft($pValue)
{
	return $pValue << 1;
}

function arrayIsset($pValue)
{
	$tab = array("test"=>"bouboup");
	return isset($tab["test"]);
}

function arrayKeyExists($pValue)
{
	$tab = array("test"=>"bouboup");
	return array_key_exists("test", $tab);
}

function arraySizeOf($pValue)
{
	$tab = array("test"=>"bouboup");
	return sizeof($tab);
}

function arrayCount($pValue)
{
	$tab = array("test"=>"bouboup");
	return count($tab);
}

function arrayInArray($pValue)
{
	$t = array("test", "woot", "niark");
	return in_array("bouboup", $t);
}

function arrayMyInArrayFor($pValue)
{
	$t = array("test", "woot", "niark");
	for($i = 0, $max = count($t); $i<$max; $i++)
	{
		if($t[$i]=="bouboup")
			return true;
	}
	return false;
}

function arrayMyInArrayForeach($pValue)
{
	$t = array("test", "woot", "niark");
	foreach($t as &$v)
	{
		if($v=="bouboup")
			return true;
	}
	return false;
}

function increm1($pValue)
{
	$i = 0;
	$i = $i+1;
	return true;
}

function increm2($pValue)
{
	$i = 0;
	$i++;
	return true;
}

function increm3($pValue)
{
	$i = 0;
	++$i;
	return true;
}

function push1($pValue)
{
	$tab = array();
	for($i = 0;$i<100;$i++)
		$tab[] = $i;
	return true;
}

function push2($pValue)
{
	$tab = array();
	for($i = 0;$i<100;$i++)
		array_push($tab, $i);
	return true;
}

function push3($pValue)
{
	$tab = array();
	for($i = 0;$i<100;$i++)
		$tab[$i] = $i;
	return true;
}

function benchMark($pFonction, $pArg = 12)
{
	global $iterations;
	global $repetitions;
	$k = 0;
	$r = 0;
	for(;$k<$repetitions;++$k)
	{
		$t = microtime();
		$myVar = "";
		$i=0;
		for(;$i<$iterations;++$i)
		{
			$myVar = $pFonction($pArg);
		}
		$t2 = microtime();
		if(($t2-$t)>0)
		{
			$r += $t2-$t;
		}
		else
		{
			$r += $t2-$t +1;
		}
	}
	return $r;
}

class Benchmarker
{
	private $stack;
	private $iteration;
	private $repetitions;

	public function __construct()
	{
		$this->iteration = 5000;
		$this->repetitions = 40;
		$this->reset();
	}

	public function reset()
	{
		$this->stack = array();
	}

	public function section($pName)
	{
		$this->stack[] = array(
			"name"=>$pName,
			"calls"=>array()
		);
	}

	public function add($pName, $pArgs = false)
	{
		$section = &$this->stack[count($this->stack)-1]["calls"];
		$section[] = array(
			"name"=>$pName,
			"args"=>$pArgs
		);
	}

	public function run($pName)
	{
		$function = "";
		$args = null;
		foreach($this->stack as $s)
		{
			$funcs = $s["calls"];
			for($i = 0, $max = count($funcs); $i<$max;$i++)
			{
				if($funcs[$i]["name"]==$pName)
				{
					$function = $pName;
					$args = $funcs[$i]["args"];
				}
			}
		}
		if(empty($function))
			return false;
		$k = 0;
		$r = 0;
		for(;$k<$this->repetitions;++$k)
		{
			$t = microtime();
			$myVar = "";
			$i=0;
			for(;$i<$this->iteration;++$i)
			{
				$myVar = $function($args);
			}
			$t2 = microtime();
			if(($t2-$t)>0)
			{
				$r += $t2-$t;
			}
			else
			{
				$r += $t2-$t +1;
			}
		}
		return $r;
	}

	public function getBrief()
	{
		return $this->stack;
	}
}


if(isset($_POST['action']))
{

	$tableau = array("foo",
					"bar",
					"bouboup",
					"gnieh",
					"ahah",
					"ohoh",
					"fbi",
					"aze",
					"azesq");

	$bench = new Benchmarker();
	$bench->section("Boucles");
	$bench->add("boucleFor", $tableau);
	$bench->add("boucleForeach", $tableau);
	$bench->add("boucleWhile", $tableau);
	$bench->section("Pair");
	$bench->add("bitMashing", 1024);
	$bench->add("estPair", 1024);
	$bench->section("Conditions");
	$bench->add("ifElse", false);
	$bench->add("operateurTernaire", false);
	$bench->add("switchValue", false);
	$bench->section("String");
	$bench->add("strReplace", "12 test");
	$bench->add("pregReplace", "12 test");
	$bench->section("Moitie");
	$bench->add("multiplicationMoitie", 35);
	$bench->add("divisionMoitie", 35);
	$bench->add("bitRight", 35);
	$bench->section("Double");
	$bench->add("divisionDouble", 35);
	$bench->add("multiplicationDouble", 35);
	$bench->add("bitLeft", 35);
	$bench->section("Array key test");
	$bench->add("arrayIsset");
	$bench->add("arrayKeyExists");
	$bench->section("ArrayCount");
	$bench->section("InArray");


	switch($_POST["action"])
	{
		case "retrieveBrief":
			$datas = $bench->getBrief();
			break;
		case "run":
			if(!isset($_POST["name"])||empty($_POST["name"]))
			{
				$datas = array("result"=>"Unknown");
			}
			else
				$datas = array("result"=>$bench->run($_POST["name"]));

			break;
		default:
			$datas = array();
			break;
	}

	$json = json_encode($datas);
	header("Content-Type:json/application;charset=ISO-8859-1");
	echo $json;
	exit();
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
		<link href="../../common/docs/docs.css" rel="stylesheet" type="text/css">
		<link href="assets/css/style.css" rel="stylesheet" type="text/css">
		<style type="text/css">
			#codeColored{position:fixed;top:100px;left:10px;pointer-events:none;}
			.code{padding:10px;margin:10px;background:#EEE;width:680px;pointer-events:none;}
			.M4keyword,.M4function,.M4op, .M4boolean{font-weight:bold;}
			.M4keyword,.M4string{color:#AA00ff;font-style:italic;}
			.M4string, .M4string .M4keyword, .M4string .M4function, .M4string .M4op{color:#2a00ff;font-weight:normal;}
			.M4api{color:#0000FF;}
			.M4op{color:#000000;}
			.M4xml{color:#38a8a8;}
			.M4php, .M4php .M4xml{color:#ff0000;}
		</style>
		<script src="../../Dependencies/src/?need=M4,M4Tween,Request,Template"></script>
		<script>
			var runButton;
			var stack;
			var currentSectionIndex;
			var currentTestIndex;
			var currentBloc;
			function init()
			{
				runButton = document.querySelector("#run");
				runButton.addEventListener("click", startTestHandler, false);
			}

			function startTestHandler()
			{
				document.getElementById("state").setAttribute("class", "running");
				runButton.disabled = "disabled";
				Request.load("bench_php.php", {
					"action":"retrieveBrief"
				}, "post").onComplete(briefHandler)
				.onError(errorHandler);
			}

			function briefHandler(pResponse)
			{
				stack = pResponse.responseJSON;
				currentSectionIndex = currentTestIndex = 0;
				document.getElementById("result").getElementsByTagName("tbody")[0].innerHTML = "";
				next();
			}

			function next()
			{
				var tpl;
				var s = stack[currentSectionIndex];
				if(!s)
				{
					completeHandler();
					return;
				}
				if(!currentTestIndex)
				{
					currentBloc = s.name.replace(/\s+/gi, '_');
					var p = document.querySelector(".tr_pending");
					if(p)
						p.parentNode.removeChild(p);
					tpl = new Template("category_tpl");
					tpl.assign('name', s.name);
					tpl.render("#result tbody");
				}
				var test = s.calls[currentTestIndex];
				Request.load("bench_php.php", {
					"action":"run",
					"name":test.name
				}, "post").onError(errorHandler)
				.onComplete(function(pResponse)
				{
					var p = document.querySelector(".tr_pending");
					if(p)
						p.parentNode.removeChild(p);
					tpl = new Template("item_tpl");
					tpl.assign("label", test.name);
					tpl.assign("correct", true);
					tpl.assign("class_name", currentBloc);
					tpl.assign("result", pResponse.responseJSON.result);
					tpl.render("#result tbody");
					if(s.calls[currentTestIndex+1])
						currentTestIndex++;
					else
					{
						currentTestIndex = 0;
						currentSectionIndex++;
					}

					var el = document.querySelectorAll('.'+currentBloc);

					var min = 9999999999999999;
					for(var i = 0, max = el.length; i<max;i++)
					{
						min = Math.min(min, Number(el[i].querySelectorAll("td")[1].getAttribute("rel")));
					}
					var d;
					for(i = 0;i<max;i++)
					{
						if(Number(el[i].querySelectorAll("td")[1].getAttribute("rel")) == min)
							el[i].querySelectorAll("td")[1].innerHTML = "1";
						else
						{
							d = Math.round(((Number(el[i].querySelectorAll("td")[1].getAttribute("rel")) - min)/min)*100)/100;
							el[i].querySelectorAll("td")[1].innerHTML = "+"+d+"%";
						}
					}

					next();
				});
			}

			function errorHandler(pE)
			{
				console.log("nop");
			}

			function completeHandler()
			{
				var p = document.querySelector(".tr_pending");
				if(p)
					p.parentNode.removeChild(p);
				document.getElementById("state").removeAttribute("class");
				runButton.removeAttribute("disabled");
			}

			window.addEventListener("load", init, false);
		</script>
	</head>
	<body>
		<header>
			<h1>Benchmark Php</h1>
			<menu>
				<li><a href="bench_js.html">Version JS</a></li>
			</menu>
		</header>
		<div id="action">
			<button id="run">Run</button>
			<div id="state"></div>
		</div>
		<div class="content">
			<table id="head">
				<thead>
					<tr>
						<td class="label">What</td>
						<td class="time">Time</td>
						<td class="result">Résultat</td>
						<td class="iteration">Iterations</td>
					</tr>
				</thead>
			</table>
			<table id="result">
				<tbody>
					<tr>
						<td colspan="4" class="empty">No result (yet)</td>
					</tr>
				</tbody>
			</table>
		</div>
		<script type="html/template" id="category_tpl">
			<tr>
				<td colspan="4" class='category'>{$name}</td>
			</tr>
			<tr class="tr_pending">
				<td colspan="4">Pending...</td>
			</tr>
		</script>
		<script type="html/template" id="item_tpl">
			<tr class="{$class_name}">
				<td class="label">'{$label}'</td>
				<td rel="{$result}" class="time">1</td>
				<td class="{if $correct}c{else}i{/if} result">{if $correct}Correct{else}Incorrect{/if}</td>
				<td class="iteration">{$iteration}</td>
			</tr>
			<tr class="tr_pending">
				<td colspan="4">Pending...</td>
			</tr>
		</script>
	</body>
</html>