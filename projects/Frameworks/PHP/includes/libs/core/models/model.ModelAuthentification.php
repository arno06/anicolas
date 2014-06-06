<?php
/**
 * Model de gestion des authentifications
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package models
 */
class ModelAuthentification extends BaseModel
{
	static private $instance;

	public function __construct()
	{
		$this->table = sprintf(Configuration::$authentification_tableName,Configuration::$site_application);
		$this->id = Configuration::$authentification_tableId;
	}

	/**
	 * @return ModelAuthentification
	 */
	static public function getInstance()
	{
		if(!self::$instance)
			self::$instance = new ModelAuthentification();
		return self::$instance;
	}
}