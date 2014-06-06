<?php
/**
 * Class Request - permet de gérer une surcouche nécessaire &agrave; CURL pour se simplifier les traitements
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package tools
 * @subpackage net
 */
class Request
{
	/**
	 * @var resource
	 */
	private $curlRessource;

	/**
	 * @var string
	 */
	private $url;

	
	/**
	 * Constructor
	 * @param  string   $pUrl
	 */
	public function __construct($pUrl)
	{
		$this->curlRessource = curl_init();
		$this->setUrl($pUrl);
		$this->setOption(CURLOPT_HEADER, 0);
	}


	/**
	 * Méthode de définition de l'url cible de la requ�te
	 * @param  string   $pUrl
	 * @return void
	 */
	public function setUrl($pUrl)
	{
		$this->url = $pUrl;
		curl_setopt($this->curlRessource, CURLOPT_URL, $pUrl);
	}


	/**
	 * @param  $pData
	 * @return void
	 */
	public function setDataPost($pData)
	{
		$this->setOption(CURLOPT_POST, true);
		$this->setOption(CURLOPT_POSTFIELDS, $pData);
	}

    public function getRessource()
    {
        return $this->curlRessource;
    }


	/**
	 * Méthode de définition d'une option liée &agrave; la requ�te en cours
	 * @param Number $pCode
	 * @param string $pValue
	 * @return void
	 */
	public function setOption($pCode, $pValue)
	{
		curl_setopt($this->curlRessource, $pCode, $pValue);
	}

	/**
	 * Méthode d'éxecution de la requ�te - renvoi le résultat du traitement
	 * @throws Exception
	 * @return string
	 */
	public function execute()
	{
		ob_start();
		$return = curl_exec($this->curlRessource);
		$datas = ob_get_contents();
		ob_end_clean();
		$number = curl_getinfo($this->curlRessource, CURLINFO_HTTP_CODE);
		curl_close($this->curlRessource);
        if($number != 200)
			return false;
		if(!$return)
			throw new Exception("Impossible d'accéder &agrave; l'url : <b>".$this->url."</b>");
		return $datas;
	}

	/**
	 * Méthode d'exécution d'une requ�te http
	 * @throws Exception
	 * @param  string   $pUrl
	 * @return string
	 */
	static public function load($pUrl)
	{
		$r = new Request($pUrl);
		try
		{
			$d = $r->execute();
		}
		catch(Exception $e)
		{
			throw $e;
		}
		return $d;
	}


    static public function multiLoad($pUrlArr)
    {
        $requests = array();
        foreach($pUrlArr as $url)
        {
            $r = new Request($url);
            $r->setOption(CURLOPT_RETURNTRANSFER, 1);
            $requests[] = $r;
        }

        $mh = curl_multi_init();

        foreach($requests as $r)
            curl_multi_add_handle($mh, $r->getRessource());

        $active = null;
        //execute the handles
        do {
            $mrc = curl_multi_exec($mh, $active);
        } while ($mrc == CURLM_CALL_MULTI_PERFORM);

        while ($active && $mrc == CURLM_OK) {
            if (curl_multi_select($mh) != -1) {
                do {
                    $mrc = curl_multi_exec($mh, $active);
                } while ($mrc == CURLM_CALL_MULTI_PERFORM);
            }
        }

        $return = array();
        foreach($requests as $r)
            $return[] = curl_multi_getcontent($r->getRessource());


        foreach($requests as $r)
            curl_multi_remove_handle($mh, $r->getRessource());

        curl_multi_close($mh);

        return $return;
    }
}