<?php
class Google_ContactsService
{

	const SCOPE = "https://www.google.com/m8/feeds";

	/**
	 * @var Google_Client
	 */
	private $client;

	public function __construct($pClient)
	{
		$this->client = $pClient;

		$this->client->setScopes(self::SCOPE);
	}

	public function all()
	{
		$result = $this->execute('default/full?max-results=999');

		$contacts = array();

		foreach($result["feed"]["entry"] as $entry)
		{
			if(!isset($entry['gd$email']))
				$entry['gd$email'] = array();
			if(!isset($entry['gd$phoneNumber'])||empty($entry['gd$phoneNumber']))
				continue;

			$phones = array();
			$emails = array();

			foreach($entry['gd$phoneNumber'] as $phone)
			{
				$phone['$t'] = preg_replace('/\+33/', "0", $phone['$t']);
				$phone['$t'] = preg_replace('/\-/', '', $phone['$t']);
				$phones[] = $phone['$t'];
			}

			foreach($entry['gd$email'] as $email)
			{
				$emails[] = $email['address'];
			}

			$contacts[] = array(
				"fullName"=>utf8_decode($entry['title']['$t']),
				"phones"=>$phones,
				"emails"=>$emails
			);
		}

		return $contacts;
	}

	private function execute($pUrl)
	{
		$oauth = Google_Client::$auth;
		$request = new Google_HttpRequest("https://www.google.com/m8/feeds/contacts/".$pUrl."&alt=json");
		$oauth->sign($request);
		$io = Google_Client::$io;

		$result_json = $io->makeRequest($request)->getResponseBody();
		$result = json_decode($result_json, true);
		return $result;
	}
}