<?php
namespace core\tools
{
	use \Exception;

	/**
	 * Class Request - permet de gérer une surcouche nécessaire &agrave; CURL pour se simplifier les traitements
	 *
	 * @author Arnaud NICOLAS <arno06@gmail.com>
	 * @version 1.0
	 * @package core\tools
	 */
	class Request
	{
		/**
		 * @var resource
		 */
		private $curlResource;

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
			$this->curlResource = curl_init();
			$this->setUrl($pUrl);
			$this->setOption(CURLOPT_HEADER, 0);
		}


		/**
		 * Méthode de définition de l'url cible de la requête
		 * @param  string   $pUrl
		 * @return void
		 */
		public function setUrl($pUrl)
		{
			$this->url = $pUrl;
			curl_setopt($this->curlResource, CURLOPT_URL, $pUrl);
		}


		/**
		 * Définit les données à envoyer en POST
		 * @param array $pData
		 * @return void
		 */
		public function setDataPost($pData)
		{
			$this->setOption(CURLOPT_POST, true);
			$this->setOption(CURLOPT_POSTFIELDS, $pData);
		}

		/**
		 * Récupère la CURL Resource définie pour la requête en cours
		 * @return resource
		 */
		public function getResource()
		{
			return $this->curlResource;
		}


		/**
		 * Méthode de définition d'une option liée &agrave; la requête en cours
		 * @param Number $pCode
		 * @param string $pValue
		 * @return void
		 */
		public function setOption($pCode, $pValue)
		{
			curl_setopt($this->curlResource, $pCode, $pValue);
		}

		/**
		 * Méthode d'éxecution de la requête - renvoi le résultat du traitement
		 * @throws Exception
		 * @return string
		 */
		public function execute()
		{
			ob_start();
			$return = curl_exec($this->curlResource);
			$datas = ob_get_contents();
			ob_end_clean();
			$number = curl_getinfo($this->curlResource, CURLINFO_HTTP_CODE);
			curl_close($this->curlResource);
			if(!$return)
				throw new Exception("Impossible d'accéder &agrave; l'url : <b>".$this->url."</b>");
			return $datas;
		}

		/**
		 * Exécute une requête HTTP via CURL
		 * Renvoie le résultat
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


		/**
		 * Exécute un ensemble de requête GET via les méthodes curl_multi_*
		 * @param string[] $pUrlArr
		 * @return array
		 */
		static public function multiLoad($pUrlArr)
		{
			$requests = array();
			foreach($pUrlArr as $url)
			{
				/** @var Request $r */
				$r = new Request($url);
				$r->setOption(CURLOPT_RETURNTRANSFER, 1);
				$requests[] = $r;
			}

			$mh = curl_multi_init();

			foreach($requests as $r)
				curl_multi_add_handle($mh, $r->getResource());

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
				$return[] = curl_multi_getcontent($r->getResource());

			foreach($requests as $r)
				curl_multi_remove_handle($mh, $r->getResource());

			curl_multi_close($mh);

			return $return;
		}
	}
}