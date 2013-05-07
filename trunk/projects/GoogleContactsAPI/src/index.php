<?php
session_start();

require_once("../lib/google/Google_Client.php");
require_once("../lib/anicolas/google/class.Google_ContactsService.php");

define("CLIENT_ID", "234428817383.apps.googleusercontent.com");
define("EMAIL_ADDRESS", "234428817383@developer.gserviceaccount.com");
define("CLIENT_SECRET", "Z1p43F9wU-xIvlmmXoFC7HtM");
define("API_KEY", "AIzaSyDJcwMEmuMAOCtBqF157Ui0RYPK2zLRAug");

$url = "http://localhost/perso/anicolas/projects/GoogleContactsAPI/src/index.php";

$client = new Google_Client();
$client->setClientId(CLIENT_ID);
$client->setClientSecret(CLIENT_SECRET);
$client->setRedirectUri($url);
$client->setDeveloperKey(API_KEY);

$c = new Google_ContactsService($client);

if(isset($_GET["code"]))
{
	$client->authenticate($_GET["code"]);
	$_SESSION["token"] = $client->getAccessToken();
	header("Location:".$url);
	exit();
}

if(isset($_SESSION["token"]))
{
	$client->setAccessToken($_SESSION["token"]);
}
else
{
	header("Location:".$client->createAuthUrl());
	exit();
}

$allContacts = $c->all();

echo "Il y a ".count($allContacts)." contacts à importer.";