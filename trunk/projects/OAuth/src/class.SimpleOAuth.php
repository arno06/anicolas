<?php
/**
 * Simple OAuth protocol implementation
 * @author Arnaud NICOLAS - arno06@mail.com
 * @dependency cURL
 * @dependency json
 * @specifcations http://oauth.net/core/1.0/
 */
class SimpleOAuth
{
	const METHOD_POST               = "POST";

	const METHOD_GET                = "GET";

	const URL_REQUEST_TOKEN         = "url_request_token";

	const URL_AUTHORIZE             = "url_authorize";

	const URL_ACCESS_TOKEN          = "url_access_token";

	const URL_AUTHORIZE_CALLBACK    = "url_authorize_callback";

	protected $consumer_key         = "";

	protected $consumer_secret      = "";

	protected $session_name         = "SimpleOAuth";

	protected $oauth_token          = "";

	protected $oauth_token_secret   = "";

	private $isAuth = false;

	private $hasAccess = false;

	private $urls = array();

	public $history = array();

	public function __construct($pConsumerKey, $pConsumerSecret)
	{
		$this->consumer_key = $pConsumerKey;
		$this->consumer_secret = $pConsumerSecret;

		if(isset($_SESSION[$this->session_name]))
		{
			$this->oauth_token = $_SESSION[$this->session_name]["ot"];
			$this->oauth_token_secret = $_SESSION[$this->session_name]["ots"];
		}
		else
		{
			$this->requestAuthentification();
		}

		if(!isset($_SESSION[$this->session_name]["access"]))
			$this->requestAccess();

		trace_r($this->history);

	}

	public function requestAuthentification()
	{
		$result = $this->execute($this->getURL(self::URL_REQUEST_TOKEN), SimpleOAuthParameters::get($this->consumer_key));

		$result = explode("&", $result);

		foreach($result as &$r)
		{
			$d = explode("=", $r);
			try
			{
				$this->$d[0] = $d[1];
			}
			catch (Exception $e)
			{
				trace_r($e);
			}
		}
		$_SESSION[$this->session_name]["ot"] = $this->oauth_token;
		$_SESSION[$this->session_name]["ots"] = $this->oauth_token_secret;
		trace("Location:".$this->getURL(self::URL_AUTHORIZE)."?oauth_token=" . $this->oauth_token . "&oauth_callback=" . rawurlencode($this->getURL(self::URL_AUTHORIZE_CALLBACK)));
		header("Location:".$this->getURL(self::URL_AUTHORIZE)."?oauth_token=" . $this->oauth_token . "&oauth_callback=" . rawurlencode($this->getURL(self::URL_AUTHORIZE_CALLBACK)));
		exit();
	}

	public function requestAccess()
	{
		$result = $this->execute($this->getURL(self::URL_ACCESS_TOKEN), SimpleOAuthParameters::get($this->consumer_key)->token($this->oauth_token));

		$result = explode("&", $result);

		foreach($result as &$r)
		{
			$d = explode("=", $r);
			try
			{
				$this->$d[0] = $d[1];
			}
			catch (Exception $e)
			{
				trace_r($e);
			}
		}
		$_SESSION[$this->session_name]["ot"] = $this->oauth_token;
		$_SESSION[$this->session_name]["ots"] = $this->oauth_token_secret;
		$_SESSION[$this->session_name]["access"] = md5($this->oauth_token."_".$this->oauth_token_secret);
	}

	public function isAuthenticated()
	{
		return $this->isAuth;
	}

	public function hasAccess()
	{
		return $this->hasAccess;
	}

	protected function setURL($pName, $pValue)
	{
		$this->urls[$pName] = $pValue;
	}

	public function getURL($pName)
	{
		if(!isset($this->urls[$pName]))
			return null;
		return $this->urls[$pName];
	}

	protected function execute($pUrl, SimpleOAuthParameters $pParams, $pMethod = "GET")
	{
		$query_string = $pParams->toString();
		$key_parts = array(
			rawurlencode($this->consumer_secret),
			$this->oauth_token_secret
		);
		$params = array
		(
			$pMethod,
			rawurlencode($pUrl),
			rawurlencode($query_string)
		);
		$base_string = implode("&", $params);
		$signature = base64_encode(hash_hmac("sha1", $base_string, implode("&", $key_parts), true));

		$pParams->signature($signature);

		$query_string = $pParams->toString();

		$ch = curl_init();
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
		curl_setopt( $ch, CURLOPT_HEADER, false);
		switch($pMethod)
		{
			case self::METHOD_GET:
				curl_setopt($ch, CURLOPT_URL, $pUrl . "?" . $query_string);
				break;
			case self::METHOD_POST:
			default:
				curl_setopt($ch, CURLOPT_URL, $pUrl);
				curl_setopt($ch, CURLOPT_POST, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, $query_string);
				break;
		}
		ob_start();
		curl_exec($ch);
		$datas = ob_get_contents();
		ob_end_clean();
		curl_close($ch);
		$this->history[] = $pUrl . "?" . $query_string;
		return $datas;
	}
}

class SimpleOAuthParameters
{
	/**
	 * @var array
	 */
	private $params;

	public function __construct($pConsumerKey)
	{
		$this->params = array(
			"oauth_consumer_key"=>$pConsumerKey,
			"oauth_nonce"=>md5(microtime() . mt_rand()),
			"oauth_timestamp"=>time()+600,
			"oauth_version"=>"1.0",
			"oauth_signature_method"=>"HMAC-SHA1"
		);
	}

	public function clean()
	{
		$this->params = array();
		return $this;
	}

	public function signature($pValue)
	{
		$this->params["oauth_signature"] = $pValue;
		return $this;
	}

	public function token($pValue)
	{
		$this->params["oauth_token"] = $pValue;
		return $this;
	}

	public function add($pName, $pValue)
	{
		$this->params[$pName] = $pValue;
		return $this;
	}

	public function toArray()
	{
		return $this->params;
	}

	/**
	 * serialize parameters
	 * order by name ASC
	 * @return string
	 */
	public function toString()
	{
		$pieces = array();
		$keys = array_keys($this->params);
		sort($keys);
		foreach($keys as $value)
			$pieces[] = $value. "=" . rawurlencode($this->params[$value]);
		return implode("&", $pieces);
	}

	static public function get($pConsumerKey)
	{
		return new SimpleOAuthParameters($pConsumerKey);
	}
}