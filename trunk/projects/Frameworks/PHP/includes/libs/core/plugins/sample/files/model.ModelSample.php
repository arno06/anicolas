<?php
/**
 * @author Chuck Norris
 **/
class ModelSample extends BaseModel
{
	public function __construct()
	{
		$this->table = "main_sample";
		$this->id = "id_sample";
	}

	/**
	 * Méthode de création de la table
	 * @return resource
	 **/
	static public function create()
	{
		return Query::execute("CREATE TABLE IF NOT EXISTS `main_sample` (`id_sample` int(11) NOT NULL AUTO_INCREMENT, `vc_sample` varchar(255) NOT NULL, `text_sample` text NOT NULL, `richtext_sample` text NOT NULL, `cb_sample` int(1) NOT NULL, `id_upload_sample` int(11) NOT NULL, PRIMARY KEY (`id_sample`)) ENGINE=InnoDB CHARACTER SET latin1 COLLATE latin1_swedish_ci AUTO_INCREMENT=1;");
	}
}