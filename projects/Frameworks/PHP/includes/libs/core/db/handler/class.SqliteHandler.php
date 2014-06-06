<?php
/**
 * Couche d'abstraction &agrave; la base de données (type sqlite)
 * Version spécifique au framework cbi
 *  - Définition des informations relatives &agrave; la base de données en fonction de la class Configuration
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .2
 * @package db
 * @subpackage handler
 */
class SqliteHandler implements InterfaceDatabaseHandler
{
	/**
	 * Instance SQLite3 - natif php5
	 * @var SQLite3
	 */
	protected $sqlite;
	
	/**
	 * Chemin d'acc&egrave;s &agrave; la base de données
	 * @var String
	 */
	protected $host;
	
	/**
	 * Nom d'utilisateur
	 * @var String
	 */
	protected $user;
	
	/**
	 * Mot de passe d'acc&egrave;s &agrave; la base de données
	 * @var String
	 */
	protected $mdp;
	
	/**
	 * Nom de la base de données
	 * @var String
	 */
	protected $bdd;
	
	/**
	 * @var Int
	 */
	public $lastId;
	
	/**
	 * Constructor
	 * Effectue la connexion avec la base
	 * @param PrivateClass $pInstance
	 */
	public function __construct($pInstance)
	{
		if(!$pInstance instanceOf PrivateClass)
			trigger_error("Il est interdit d'instancier un objet de type <i>Singleton</i> - Merci d'utiliser la méthode static <i>".__CLASS__."::getInstance()</i>", E_USER_ERROR);
		$this->host = Configuration::$db_host;
		$this->user = Configuration::$db_user;
		$this->mdp = Configuration::$db_password;
		$this->bdd = Configuration::$db_name;
		$this->connect();
	}
	
	/**
	 * Destructor
	 * Clos la connexion en cours avec la base
	 * @return void
	 */
	public function __destruct()
	{
		$this->close();
	}
	
	/**
	 * Méthode de connexion &agrave; la base
	 * Stop l'exécution de l'application si la base n'est pas accessible
	 * @return void
	 */
	protected function connect()
	{
		if(!$this->sqlite = new SQLite3($this->host, SQLITE3_OPEN_READWRITE, null))
			trigger_error("Connexion au serveur de gestion de base de données impossible", E_USER_ERROR);
	}
	
	/**
	 * Méthode permettant de centraliser les commandes &agrave; effectuer avant l'excécution d'une requ�te
	 * @param String $pQuery				Requ�te &agrave; excécuter
	 * @return Ressource
	 */
	protected function execute($pQuery)
	{
		array_push(self::$queries,$pQuery);
		return $this->sqlite->exec($pQuery);
	}
	
	/**
	 * Méthode de récupération de la clé primaire générée &agrave; la suite d'une insertion
	 * @return Number
	 */
	public function getInsertId()
	{
		return $this->sqlite->lastInsertRowID();
	}
	
	/**
	* Méthode permettant de clore la connexion établie avec la base de donnée
	* @return void
	**/
	protected function close()
	{
		$this->sqlite->close();
	}
	
	/**
	 * Méthode permettant d'effectuer une requ�te renvoyant une ou plusieurs tuples
	 * @param String $pQuery		Requ�te &agrave; effectuer
	 * @return SQLite3Result
	 */
	protected function query($pQuery)
	{
		Debugger::query($pQuery, "db", $this->bdd);
		return $this->sqlite->query($pQuery);
	}
	
	/**
	 * Méthode permettant de récupérer les donnée d'une requ�tes SQL
	 * Renvoie les données renvoyées sous forme d'un tableau associatif
	 * @param String $pQuery				Requ�te SQL brute
	 * @return array
	 */
	public function getResult($pQuery)
	{
		$result = $this->query($pQuery);
		if(!$result)
			trigger_error("Une erreur est apparue lors de la requ�te <b>".$pQuery."</b>", E_USER_ERROR);
		$return = array();
		while($donnee = $result->fetchArray(SQLITE3_ASSOC))
		{
			array_push($return, $donnee);
		}
		return $return;
	}	
	
	/**
	 * Méthode permettant de filtrer une valeur avant son utilisation dans une requ�te &agrave; la base de données
	 * @param String $pValue				Valeur &agrave; filtrer
	 * @return String
	 */
	public function filterIn($pValue)
	{
		return preg_replace("/\'/","''", $pValue);
	}
	
	/**
	 * Méthode permettant de filtrer les données lorsqu'on les récup&egrave;re via une requ�te &agrave; la base de données
	 * @param String $pValue				Valeur &agrave; filtrer
	 * @return String
	 */
	public function filterOut($pValue)
	{
		return $pValue;
	}
	
	/**
	 * Singleton
	 * @param String $pClass [optional]
	 * @return SqliteHandler
	 */
	static public function getInstance($pClass = "")
	{
		return parent::getInstance(__CLASS__);
	}
	
	
	/**
	 * toString()
	 * @return String
	 */
	public function toString()
	{
		return "Object SqliteHandler";
	}

	/**
	 * @return int
	 */
	public function getErrorNumber()
	{
		// TODO: TBD
	}

	/**
	 * @return string
	 */
	public function getError()
	{
		// TODO: TBD
	}
}
