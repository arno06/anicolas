<?php
/**
 * Class Dictionnary - Permet la gestion d'un fichier de langue global &agrave; l'application
 * 
 * @TODO Voir pour une gestion mi-dynamique/mi static des balises "title" et "description" comme les "terms"
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .2
 * @package application
 */
class Dictionnary extends Singleton
{
	/**
	 * Tableau des alias
	 * @var Array
	 */
	private $table_alias;
	
	/**
	 * Tableau des termes
	 * @var Array
	 */
	private $table_terms;
	
	/**
	 * Tableau des infos de SEO (Search Engine Optimisation)
	 * @var Array
	 */
	private $table_seo;
	
	/**
	 * Variable de la langue en cours
	 * @var String
	 */
	static public $langue;

    const UNDEFINED = "Undefined";

	/**
	 * @param  $pInstance
	 */
	public function __construct($pInstance)
	{
		if(!$pInstance instanceOf PrivateClass)
			trigger_error("Il est interdit d'instancier un objet de type <i>Singleton</i> - Merci d'utiliser la méthode static <i>".__CLASS__."::getInstance()</i>", E_USER_ERROR);
	}
	
	/**
	 * Méthode de récupération d'un terme se trouvant dans le fichier de langue
	 * Le param&egrave;tre attendu correspond &agrave; la concaténation des différents identifiants de niveau d'acc&egrave;s
	 * @param object $pId
	 * @return String
	 */
	static public function term($pId)
	{
		$i = self::getInstance();
        $value = Stack::get($pId, $i->table_terms);
        while(preg_match("/\{([a-z\.]+)\}/", $value, $matches))
		{
            $value = preg_replace("/\{[a-z\.]+\}/", self::term($matches[1]), $value);
		}
		if(empty($value))
			$value = self::UNDEFINED;
		return $value;
	}
	
	
	/**
	 * Méthode de récupération de l'ensemble des termes disponibles via le fichier de langue
	 * @return Array
	 */
	static public function terms()
	{
		$i = self::getInstance();
		return $i->table_terms;
	}
	
	
	/**
	 * Méthode de récupération des informations de SEO pour un controller et un action donné
	 * @param String $pController		Nom du controller
	 * @param String $pAction			Nom de l'action
	 * @return Array
	 */
	static public function seoInfos($pController, $pAction)
	{
		$i = self::getInstance();
		if(!isset($i->table_seo[$pController])||!isset($i->table_seo[$pController][$pAction]))
			return null;
		return $i->table_seo[$pController][$pAction];
	}
	
	/**
	 * Méthode de récupération du vrai nom d'un controller ou d'une action &agrave; partir de son alias dans la langue en cours
	 * Renvoi la valeur du controller tel qu'il existe
	 * @param String $pValue		Valeur de l'alias
	 * @return String
	 */
	static public function getAliasFrom($pValue)
	{
		$i = self::getInstance();
		if(isset($i->table_alias[$pValue]))
			return $i->table_alias[$pValue];
		return $pValue;
	}
	
	/**
	 * Méthode de récupération de l'alias dans la langue actuelle pour un controller ou une action
	 * @param String $pValue		Valeur dont on souhaite récupérer l'alias
	 * @return String
	 */
	static public function getAliasFor($pValue)
	{
		$i = self::getInstance();
		if($return = array_search($pValue, $i->table_alias))
			return $return;
		return $pValue;
	}
	
	/**
	 * Méthode de définition de l'objet Dictionnary en fonction des param&egrave;tres
	 * @param String $pLanguage		Langue en cours - fr/en/de
	 * @param Array $pTerms			Tableau des termes accessibles de mani&egrave;re global &agrave; l'application
	 * @param Array $pSeo			Tableau des informations relatives &agrave; la SEO (balise "title" et "description")
	 * @param Array $pAlias			Tableau des alias pour la gestion de la réécriture d'url dynamique
	 * @return void
	 */
	static public function defineLanguage($pLanguage, array $pTerms, array $pSeo, array $pAlias)
	{
		if(empty($pLanguage))
			trigger_error("Impossible de définir le <b>Dictionnary</b>, <b>langue</b> non renseignée.", E_USER_ERROR);
		self::$langue = $pLanguage;
		$i = self::getInstance();
		$i->table_alias = $pAlias;
		$i->table_terms =$pTerms;
		$i->table_seo = $pSeo;
	}
	
	/**
	 * Singleton
	 * @param String $pClassName [optional]
	 * @return Dictionnary
	 */
	static public function getInstance($pClassName = "")
	{
		return parent::getInstance(__CLASS__);
	}
}