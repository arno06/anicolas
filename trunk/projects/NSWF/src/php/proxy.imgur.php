<?php
$xml = file_get_contents($_GET["url"]);
$xml = preg_replace('/(\r|\n)/', '', $xml);
$xml = preg_replace('/\>(\s*)\</', '><', $xml);
preg_match('/\<div id="image" class="[a-z\s]*"\>\<div class="[a-z\s]*"\>\<a href="([^"]+)"\>\<img src="([^"]+)" alt="[a-z\s]*" \/\>\<\/a\>\<\/div\>\<\/div\>/i', $xml, $matches);
if(!isset($matches[1]))
	preg_match('/\<link rel\="image_src" href\="([^"]+)"\/\>/', $xml, $matches);
header("Location:".$matches[1]);
exit();