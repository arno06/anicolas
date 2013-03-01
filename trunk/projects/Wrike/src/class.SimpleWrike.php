<?php
class SimpleWrike extends SimpleOAuth
{

	const FORMAT_JSON = "json";

	const FORMAT_XML = "xml";

	const URL_API_V2_JSON = "https://www.wrike.com/api/json/v2/";

	const URL_API_V2_XML ="https://www.wrike.com/api/xml/v2/";

	private $format = "json";

	public function __construct($pConsumerKey, $pConsumerSecret, $pAuthorizeCallBack, $pFormat = "json")
	{
		$this->setURL(self::URL_REQUEST_TOKEN, "https://www.wrike.com/rest/auth/request_token");
		$this->setURL(self::URL_AUTHORIZE, "https://www.wrike.com/rest/auth/authorize");
		$this->setURL(self::URL_ACCESS_TOKEN, "https://www.wrike.com/rest/auth/access_token");
		$this->setURL(self::URL_AUTHORIZE_CALLBACK, $pAuthorizeCallBack);

		$this->format = $pFormat;

		parent::__construct($pConsumerKey, $pConsumerSecret);
	}

	public function getProfil()
	{
		$result = $this->perform(SimpleWrikeMethod::PROFIL, array(), SimpleWrike::METHOD_POST);
		return $result->profile;
	}

	public function getFolderTree()
	{
		return $this->perform(SimpleWrikeMethod::FOLDER_TREE, array(), SimpleWrike::METHOD_POST);
	}

	public function getFolderInfos($pId)
	{
		return $this->perform(SimpleWrikeMethod::FOLDER_GET, array("id"=>$pId), SimpleWrike::METHOD_POST);
	}

	public function getTaskFiltered($pParentId)
	{
		return $this->perform(SimpleWrikeMethod::TASK_FILTER, array("parents"=>$pParentId), self::METHOD_POST);
	}

	public function getTaskDetails($pIdTask)
	{
		return $this->perform(SimpleWrikeMethod::TASK_GET, array("id"=>$pIdTask), self::METHOD_POST);
	}

	public function getTimeLog($pIdTask)
	{
		return $this->perform(SimpleWrikeMethod::TIMELOG_GET, array("taskId"=>$pIdTask), self::METHOD_POST);
	}

	private function perform($pMethod, $pParameters, $pHttpMethod)
	{
		$parameters = SimpleOAuthParameters::get($this->consumer_key)
											->token($this->oauth_token);
		foreach($pParameters as $k=>$v)
			$parameters->add($k, $v);

		switch($this->format)
		{
			case self::FORMAT_XML:
				$baseUrl = self::URL_API_V2_XML;
				break;
			default:
			case self::FORMAT_JSON:
				$baseUrl = self::URL_API_V2_JSON;
				break;
		}

		$result = $this->execute($baseUrl.$pMethod, $parameters, $pHttpMethod);
		switch($this->format)
		{
			case self::FORMAT_XML:
				return simplexml_load_string($result);
				break;
			default:
			case self::FORMAT_JSON:
				return json_decode($result);
				break;
		}
	}
}

class SimpleWrikeMethod
{
	const PROFIL = "wrike.profile.get";

	const CONTACT = "wrike.contacts.list";

	const FOLDER_TREE = "wrike.folder.tree";

	const FOLDER_GET = "wrike.folder.get";

	const TASK_FILTER = "wrike.task.filter";

	const TASK_GET = "wrike.task.get";

	const TIMELOG_GET = "wrike.timelog.list";
}