<?php
$r = file_get_contents("http://www.mnasm.com/index/atom/");
header("content-type:application/xml");
echo $r;
exit();