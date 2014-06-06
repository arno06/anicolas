<?php
/**
 * Model de gestion des uploads
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .3
 * @package models
 */
class ModelUpload extends BaseModel
{
	
	public function __construct()
	{
		$this->table = Configuration::$site_application."_upload";
		$this->id = "id_upload";
	}
	
	public function deleteById($pId)
	{
		File::delete($this->getValueById("path_upload", $pId));
		parent::deleteById($pId);
	}
	
	public function insertUpload($pPath)
	{
		$this->delete(Query::condition()->andWhere("path_upload", Query::EQUAL, $pPath));
		return $this->insert(array("path_upload"=>$pPath));
	}
	
	public function updateUpload($pId, $pPath)
	{
		return $this->updateById($pId, array("path_upload"=>$pPath));
	}

    /**
     * @static
     * @param  int      $pId
     * @return String
     */
    static public function getPathById($pId)
    {
	    $i = new ModelUpload();
        return $i->getValueById("path_upload", $pId);
    }
	
	/**
	 * Méthode static de création de la table d'upload
	 * @param String $pApplication [optional] Nom de l'application sur laquelle on souhaite ajouter la table
	 * @return Ressource
	 */
	static public function create($pApplication = "main")
	{
		return Query::create($pApplication."_upload", "MyISAM")
					->addField("id_upload", "int", "11", "", false, true)
					->addField("path_upload", "varchar", "255")
					->execute();
	}
}