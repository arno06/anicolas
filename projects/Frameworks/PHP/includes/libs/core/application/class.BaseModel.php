<?php
/**
 * Class devant servir de model de base pour l'ensemble des models de l'application
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .5
 * @package application
 */
abstract class BaseModel
{
	/**
	 * Nom du champs servant de clé primaire
	 * @var String
	 */
	public $id;
	
	/**
	 * Nom de la table &agrave; cibler
	 * @var String
	 */
	protected $table;

	/**
	 * @var String
	 */
	protected $handler = "default";
	
	/**
	 * @var array
	 */
	private $joins;
	
	/**
	 * Méthode de récupération de tous les champs sur la table du model avec possibilité d'ajouter une condition
	 * Renvoie le resultat de la requ�te
	 * @param QueryCondition $pCondition			Condition SQL (WHERE, ORDER...)
	 * @param string $pChamps
	 * @return Array
	 */
	public function listAll($pCondition=null, $pChamps = "*")
	{
		return $this->all($pCondition, $pChamps);
	}
	
	/**
	 * Méthode d'insertion de données dans la table du model
	 * Renvoie le resultat de la requ�te
	 * @param array $pValues				Tableau associatif des données &agrave; insérer
	 * @return Ressource
	 */
	public function insert(array $pValues)
	{
		return Query::insert($pValues)->into($this->table)->execute($this->handler);
	}


    public function replace(array $pValues)
    	{
    		return Query::replace($pValues)->into($this->table)->execute($this->handler);
    	}
	
	/**
	 * Méthode d'insertion multiple d'entrées pour un m�me model
	 * @param array $pValues				Tableau multi-dimensionnel contenant les données &agrave; insérer
	 * @return Ressource
	 */
	public function insert_multiple(array $pValues)
	{
		return Query::insertMultiple($pValues)->into($this->table)->execute($this->handler);
	}
	
	
	/**
	* Méthode de modification d'une ou plusieurs entrées dans la table du mod&egrave;le en cours
	* @param Array              $pValues			Tableau associatif contenant les données
	* @param QueryCondition     $pCondition			Condition permettant de cibler la modification
    * @param Boolean $escape
	* @return Ressource
	**/
	public function update(array $pValues, $pCondition = null, $escape = true)
	{
		return Query::update($this->table)->values($pValues, $escape)->setCondition($pCondition)->execute($this->handler);
	}
	
	/**
	 * Méthode de récupération d'une tuple particuli&egrave;re de la table en fonction de la valeur de sa clé primaire
	 * Renvoie un tableau associatif des données correspondant au résultat de la requ�te
	 * @param string $pId				Valeur de clé primaire &agrave; cibler
	 * @param string $pFields
	 * @return Array
	 */
	public function getTupleById($pId, $pFields = "*")
	{
		return $this->one(Query::condition()->andWhere($this->id, Query::EQUAL, $pId), $pFields);
	}
	
	/**
	 * Méthode permettant de générer facilement une requ�te d'update &agrave; partir de valeur de clé primaire et d'un tableau associatif des valeurs
	 * @param String $pId		Valeur de clé primaire &agrave; cibler
	 * @param Array $pValues	Tableau associatif des champs et de leurs nouvelles valeurs
	 * @return Ressource
	 */
	public function updateById($pId, array $pValues)
	{
		return $this->update($pValues, Query::condition()->andWhere($this->id, Query::EQUAL, $pId));
	}
	
	
	/**
	 * Méthode de suppression d'une typle en fonction de la valeur de sa clé primaire
	 * @param String $pId				Valeur de clé primaire &agrave; cibler
	 * @return Ressource
	 */
	public function deleteById($pId)
	{
		return $this->delete(Query::condition()->andWhere($this->id, Query::EQUAL, $pId));
	}
	
	/**
	* Méthode permettant la suppression d'une ou plusieurs entrées
	* @param QueryCondition     $pCondition			Condition permettant de cibler l'entrée cible de la suppression
	* @return Ressource
	**/
	public function delete($pCondition)
	{
		return Query::delete()->from($this->table)->setCondition($pCondition)->execute();
	}
	
	/**
	* Méthode récupérant la valeur d'un champs spécifique
	* @param String             $pField				Nom du champ
	* @param QueryCondition     $pCondition			Condition permettant de cibler la selection
	* @return String
	**/
	public function getValue($pField, $pCondition)
	{
		$r = $this->one($pCondition, $pField);
		if(preg_match("/as\s([a-z0-9]+)/", $pField, $matches))
			$pField = $matches[1];
		return $r[$pField];
	}
	
	/**
	 * Méthode de récupération de lé clé primaire venant d'�tre générée par la base de données
	 * @return int
	 */
	public function getInsertId()
	{
		return DBManager::get($this->handler)->getInsertId();
	}
	
	/**
	 * Méthode de récupération d'une valeur précise
	 * @param String $pField		Nom du champ &agrave; récupérer
	 * @param String $pId			Valeur de clé primaire
	 * @return String
	 */
	public function getValueById($pField, $pId)
	{
		return $this->getValue($pField, Query::condition()->andWhere($this->id, Query::EQUAL, $pId));
	}
	
	/**
	 * Méthode permettant de récupérer le nombre max de tuple présent dans une table
	 * @param QueryCondition $pCondition		Condition de la requete
	 * @return int
	 */
	public function count($pCondition)
	{
		return $this->getValue("count(" . $this->table .  "." . $this->id.") as nb", $pCondition);
	}

	/**
	 * Méthode d'ajout de jointure par défaut aux requ�tes de type SELECT
	 * @param String $pTable
	 * @param null $pType
	 * @param null $pOn
	 * @return void
	 */
	protected function addJoinOnSelect($pTable, $pType = null, $pOn = null)
	{
		if(!$pType)
			$pType = Query::JOIN_NATURAL;
		$this->joins[] = array("table"=>$pTable, "type"=>$pType, "on"=>$pOn);
	}

	/**
	 * @param QuerySelect $pQuery
	 * @return QuerySelect
	 */
	protected function prepareJoin(QuerySelect $pQuery)
	{
		if(count($this->joins))
		{
			foreach($this->joins as $j)
				$pQuery->join($j["table"], $j["type"], $j["on"]);
		}
		return $pQuery;
	}

	/**
	 * @param null $pCond
	 * @param string $pFields
	 * @return Array
	 */
	public function one($pCond = null, $pFields = "*")
	{
		if($pCond==null)
			$pCond = Query::condition();
		$res = $this->all($pCond->limit(0, 1), $pFields);
		if(!isset($res[0]))
			return null;
		return $res[0];
	}


	/**
	 * @param null|QueryCondition $pCond
	 * @param string $pFields
	 * @return array|Ressource
	 */
	public function all($pCond = null, $pFields = "*")
	{
		return $this->prepareJoin(Query::select($pFields, $this->table))->setCondition($pCond)->execute($this->handler);
	}
}