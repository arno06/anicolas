<?php

function log_($pString)
{
	echo htmlentities($pString);
}

function log_r($pData)
{
	$r = print_r($pData, true);
	echo htmlentities($r);
}

function error($pString)
{
	echo "<h1>Une erreur est apparue : </h1>";
	echo "<h3>".$pString."</h3>";
	exit();
}

function str($pString)
{
	return mb_encode_numericentity((String) utf8_decode($pString), array(0x80, 0xff, 0, 0xff), "ISO-8859-1");
}

function num($pValue)
{
	return (int) utf8_decode($pValue);
}

function re_escape($pRegExp, &$pString)
{
	$pString = preg_replace($pRegExp, "", $pString);
}

function re_extract($pRegExp, $pString)
{
	preg_match($pRegExp, $pString, $matches);
	if(!isset($matches[1]))
		return false;
	return $matches[1];
}

$url = "http://www.ffvbbeach.org/ffvbapp/resu/vbspo_calendrier.php?saison=2013%2F2014&codent=LIIDF&poule=3MC&division=&tour=&calend=COMPLET&x=14&y=7";
$html = file_get_contents($url);

re_escape('/(\r|\n|\t)/', $html);

$body = re_extract('/<body[^>]*>(.+)<\/body>/i', $html);


/**
 * Cleaning script and noscript tags
 */
re_escape('/(<script[^>]*>[^<]*|<[^\/]*<\/script>)/i', $body);
re_escape('/(<\/script>)/i', $body);
//re_escape('/(<noscript[^>]*>.*<\/noscript>)/i', $body);
/**
 * Deleting useless table
 */
$first_table = strpos($body, '</TABLE>');
$content = substr($body, $first_table + 8, strlen($body));

/**
 * More Cleaning
 */
$content = re_extract('/(<table[^>]*>.*<\/table>)/i', $content);

/**
 * Isolation
 */
$last_table = strrpos($content, "<TABLE");
$first_stable = strpos($content, "</TABLE>");

/**
 * First extraction
 */
$table_ranking = substr($content, 0, $first_stable + 8);
$table_agenda = substr($content, $last_table, strlen($content) - strlen($table_ranking));

/**
 * Escaping attributes
 */
$re_attributes = '/(<[a-z0-9]+)([^>]*)>/i';
$table_ranking = preg_replace($re_attributes, '$1>', $table_ranking);
$table_agenda = preg_replace($re_attributes, '$1>', $table_agenda);

/**
 * Escaping form and input tags
 */
$re_tags = '/(<form>|<input>|<\/form>|<\/input>|<p>|<\/p>|<img>|<img\/>)/i';
re_escape($re_tags, $table_ranking);
re_escape($re_tags, $table_agenda);

/**
 * Final XML parsing to SimpleXMLElement
 */
$ranking_p = simplexml_load_string(utf8_encode($table_ranking));
$agenda_p = simplexml_load_string(utf8_encode($table_agenda));
$ranking = array();
for($i = 1, $max = count($ranking_p->tr); $i<$max; $i++)
{
	$team = $ranking_p->tr[$i]->td;
	$ranking[] = array(
		"name"=>str($team[1]),
		"championship_points"=>str($team[2]),
		"matches"=>array(
			"played"=>num($team[3]),
			"won"=>num($team[4]),
			"lost"=>num($team[5]),
			"F"=>num($team[6]),
			"3_0"=>num($team[7]),
			"3_1"=>num($team[8]),
			"3_2"=>num($team[9]),
			"2_3"=>num($team[10]),
			"1_3"=>num($team[11]),
			"0_3"=>num($team[12])
		),
		"sets"=>array(
			"played"=>num($team[13])+num($team[14]),
			"won"=>num($team[13]),
			"lost"=>num($team[14])
		),
		"points"=>array(
			"played"=>num($team[16])+num($team[17]),
			"won"=>num($team[16]),
			"lost"=>num($team[17])
		)
	);
}

$agenda = array();

for($i = 0, $max = count($agenda_p->tr); $i<$max; $i++)
{
	$day = $agenda_p->tr[$i]->td;
	if(count($day)==1)
	{
		$agenda[] = array("label"=>str($day), "matches"=>array());
	}
	else
	{
		$points = explode("-", str($day[9]));
		if(!isset($points[0]))
			$points = array("", "");
		if(!isset($points[1]))
			$points[1] = "";
		$agenda[count($agenda)-1]["matches"][] = array(
			"date"=>str($day[1]),
			"hour"=>str($day[2]),
			"home"=>array(
				"name"=>str($day[3]),
				"set"=>str($day[6]),
				"points"=>$points[0]
			),
			"guest"=>array(
				"name"=>str($day[5]),
				"set"=>str($day[7]),
				"points"=>$points[1]
			)
		);
	}
}

$return = array(
	"ranking"=>$ranking,
	"agenda"=>$agenda
);

$gzip = isset($_GET['gzip'])?$_GET['gzip']:true;

/**
 * Ouput
 */
$return = json_encode($return);
if($gzip)
	$return = gzencode($return);
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
if($gzip)
	header("Content-Encoding: gzip");
header("Content-Length: " . strlen($return));
header("Content-Type:application/json; charset=ISO-8859-15");
echo $return;
exit();