<?php
define("NEED_SEPARATOR", ",");
define("MANIFEST", "manifest.json");

$headers = array(
	"Content-Type"=>"application/javascript"
);

$output = "";

/**
 * Check get vars
 */
$need = check("need")?explode(NEED_SEPARATOR, $_GET["need"]):array();

if(empty($need))
	output(csl("No lib to load", "warn"));

/**
 * Load manifest
 */
if(!file_exists(MANIFEST))
	output(csl("Manifest file '".MANIFEST."' not found", "error"));

$manifest = json_decode(file_get_contents(MANIFEST), true);

$config = isset($manifest["config"])?$manifest["config"]:array();
unset($manifest["config"]);

$needs = array();

foreach($need as $lib)
{
	if(isset($manifest[$lib]))
	{
		array_unshift($needs, $lib);
		if(!isset($manifest[$lib]["need"])||!is_array($manifest[$lib]["need"])||empty($manifest[$lib]["need"]))
			continue;
		$dep = array_reverse($manifest[$lib]["need"]);
		foreach($dep as $req)
			array_unshift($needs, $req);

	}
	else
		$output .= csl($lib." is not available", "warn");
}

$needs = array_unique($needs);
/**
 * Check Cache File (not sure this should be done now)
 */
/**
 * Get lib contents
 */

foreach($needs as $lib)
{
	if(isset($manifest[$lib]))
	{
		// TBD : improve versions handling (?need=M4Tween@rc,M4@beta...)
		if(!isset($manifest[$lib]["versions"])||!isset($manifest[$lib]["versions"]["rc"]))
		{
			echo csl($lib." is not available", "warn");
			continue;
		}
		$file = $manifest[$lib]["versions"]["rc"];
		$absolute_link = preg_match('/^http\:\/\//', $file, $matches);
		if(!$absolute_link)
			$file = $config["relative"].$file;

		$output .= file_get_contents($file)."\r\n";
	}
	else
		$output .= csl($lib." is not available");
}

/**
 * Minified / Uglyflied / gzip
 */

$accept_gzip = preg_match('/gzip/', $_SERVER['HTTP_ACCEPT_ENCODING'], $matches);
if($accept_gzip)
{
	$headers["Content-Encoding"] = "gzip";
	$output = gzencode($output);
}

/**
 * Generate Cache File
 */
/**
 * Define Header
 * Write body
 * End Request
 */
output($output);

/**
 * Functions
 */
function check($pName)
{
	return isset($_GET[$pName])&&!empty($_GET[$pName]);
}

function output($pContent)
{
	global $headers;

	$headers["Content-Length"] = strlen($pContent);

	foreach($headers as $n=>$v)
		header($n.": ".$v);

	echo $pContent;
	exit();
}

function csl($pText, $pType='log')
{
	return "console.".$pType."('Dependencies : ".addslashes($pText)."');\r\n";
}