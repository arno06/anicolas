<?php
$Filters = array('');
define("FOLDER", "svn");
define("BASE_DIR", "./../");

$domain = $_SERVER["SERVER_NAME"];
$folder = preg_replace('/\/php\/action.php$/', "", $_SERVER["SCRIPT_NAME"]);
$folder = preg_replace('/^\//', "", $folder);
$server_url = "http://".$domain."/";
if(!empty($folder))
	$server_url .= $folder."/";

function roundSize($pSize, $pPrecision = 2)
{
	$units = array("o", "Ko", "Mo", "Go", "To");
	$i = 0;
	while($pSize >= 1024 && $units[$i++])
		$pSize /= 1024;
	return round($pSize, $pPrecision)." ".$units[$i];
}

function listDir($pDirectory)
{
	global $server_url;
	$folder = BASE_DIR.FOLDER.$pDirectory;
	$baseDir = realpath($folder)."\\";
	if(!is_dir($folder))
		return array();
	$f = scandir($baseDir);
	sort($f);
	$dirs = array();
	while($d = array_shift($f))
	{
		if($pDirectory == "/" && $d =="..")
			continue;
		if($d == ".")
			continue;
		$time = filemtime($baseDir.$d);
		$isFile = is_file($baseDir.$d);
		$path = $pDirectory.$d.($isFile?"":"/");
		$size = $isFile?roundSize(filesize($baseDir.$d)):"N/A";
		$dirs[] = array("rel"=>$server_url.FOLDER.$pDirectory.$d,"isFile"=>$isFile,"name"=>$d, "path"=>$path, "mtime"=>$time, "mdate"=>date("D, d m Y H:i:s", $time), "size"=>$size);
	}
	return $dirs;
}
function dirHelpers($pDirs, $pClassName)
{
	$r = '<table class="'.$pClassName.'">
	<tr>
		<th></th>
		<th>Name</th>
		<th>Last modified</th>
		<th>Size</th>
	</tr>';
	foreach($pDirs as &$dir)
	{
		if($dir["name"] == "..")
		{
			$dir["path"] = preg_replace('/(\/[a-z0-9\_\-\.]+\/\.\.\/)$/i', "/", $dir["path"]);
			$r .= '<tr>
		<td class="ico_'.($dir["isFile"]?"file":"folder").'"></td>
		<td colspan="3"><a href="#'.$dir["path"].'" onmousedown="Explorer.up = true;">'.$dir["name"].'</td>
	</tr>';
			continue;
		}
		$r .= '<tr>
		<td class="ico_'.($dir["isFile"]?"file":"folder").'"></td>
	<td><a href="#'.$dir["path"].'"'.($dir["isFile"]?" class='file' rel='".$dir["rel"]."'":"").'>'.$dir["name"].'</td>
	<td>'.$dir["mdate"].'</td>
	<td>'.$dir["size"].'</td>
</tr>';
	}
	$r .= '</table>';
	return $r;
}
$rout = $_POST["rout"];
preg_match_all('/([a-z0-9\_\-]+)/i', $rout, $matches);
$currentRout = "/";
for($i = 0, $max = count($matches[0]); $i<$max;$i++)
{
	$currentRout .= $matches[0][$i]."/";
	if($currentRout != $_POST["rout"])
		$rout = str_replace($matches[0][$i], "<a href='#".$currentRout."' onmousedown='Explorer.up = true;'>".$matches[0][$i]."</a>", $rout);
}

$return = array(
	"path"=>$rout,
	"folders"=>dirHelpers(listDir($_POST["rout"]), $_POST["className"])
);
header("content-type:application/json");
echo json_encode($return);
exit();