<?php
$datas = file_get_contents("http://api.reddit.com/r/pics/");
header("Content-Type:application/json;charset=UTF-8");
header("Content-Length: " . strlen($datas));
echo $datas;