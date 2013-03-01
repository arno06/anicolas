<?php
session_start();
if(isset($_GET["unset"])&&$_GET["unset"]==1)
{
	session_destroy();
	$_SESSION = array();
	exit();
}
$output = "";

function trace($pValue)
{
	global $output;

	$output .= "<tr><td>".date("i:s", microtime(true))."</td><td>".$pValue."</td></tr>";
}

function trace_r($pMisc)
{
	trace("<pre>".print_r($pMisc, true)."</pre>");
}

include("class/class.SimpleOAuth.php");
include("class.SimpleWrike.php");

$sw = new SimpleWrike("2d9c907f0fdd9a0f72c0fef0c70385b1", "a81892dfe2e5ced1", "http://localhost/recherches/benchmark/Wrike/");
$profil = $sw->getProfil();
//$folderTree = $sw->getFolderTree();
//$folderInfo = $sw->getFolderInfos(10559398);
//$forfaitTask = $sw->getTaskFiltered(10559398);
//$analogWay = $sw->getTaskDetails(10559421);
$timeLog = $sw->getTimeLog(10559421);
//trace_r($profil);
//trace_r($folderTree);
//trace_r($folderInfo);
//trace_r($forfaitTask);
//trace_r($analogWay);
trace_r($timeLog);

trace_r($sw->history);
header("Content-type:text/html;charset=UTF-8");
?>
<html>
<head>
	<title>Wrike API Int&eacute;gration</title>
	<style type="text/css">
		*{padding:0;margin:0;font-family: Arial, sans-serif;}

		#debug{width:100%;height:300px;overflow: auto;background:#e0e0e0;}
	</style>
</head>
<body>
<?php
echo "<div id='debug'><table>".$output."</table></div>";
?>
<h1>Wrike API Int&eacute;gration</h1>
<div id="user">
	<span class="lastname"><?php echo $profil->lastName; ?></span>
	<span class="firstname"><?php echo $profil->firstName; ?></span>
</div>
</body>
</html>