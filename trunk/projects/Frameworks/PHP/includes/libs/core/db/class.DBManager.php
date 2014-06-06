<?php
/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package db
 */
class DBManager
{
	/**
	 * @var array
	 */
	static private $handlers = array();

	/**
	 * @static
	 * @param string $pIdentifiant
	 * @return InterfaceDatabaseHandler
	 */
	static public function get($pIdentifiant = "default")
	{
		if(!isset(self::$handlers[$pIdentifiant]))
			trigger_error("L'identifiant \"".$pIdentifiant."\" ne correspond &agrave; aucun gestionnaire stocké.");
		return self::$handlers[$pIdentifiant];
	}

	/**
	 * @static
	 * @param $pIdentifiant
	 * @param $pInfos
	 * @return void
	 */
	static public function set($pIdentifiant, $pInfos)
	{
		if(isset(self::$handlers[$pIdentifiant]))
			trigger_error("L'identifiant \"".$pIdentifiant."\" est déj&agrave; utilisé. Impossible de stocker le gestionnaire créé.");
		$d = array("handler", "host", "user", "password", "name");
		foreach($d as $l)
		{
			if(!isset($pInfos[$l]))
				$pInfos[$l] = "";
		}
		try
		{
			$instance = new $pInfos["handler"]($pInfos["host"], $pInfos["user"], $pInfos["password"], $pInfos["name"]);
		}
		catch(Exception $e)
		{
			trigger_error("Une erreur est apparue lors de l'initialisation du gestionnaire \"".$pIdentifiant."\". Merci de vérifier les informations saisie.");
		}
		self::$handlers[$pIdentifiant] = $instance;
	}

	/**
	 * @static
	 * @return void
	 */
	static public function dispose()
	{
		foreach(self::$handlers as $name=>$instance)
		{
			unset($instance);
			unset(self::$handlers[$name]);
		}
		self::$handlers = null;
	}
}