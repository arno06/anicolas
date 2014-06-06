<?php
/**
 * Class Configuration
 * Sert de référence pour n'importe quelle propriété nécessaire &agrave; la configuration de l'application
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .6
 * @package application
 */
abstract class Configuration
{
	/**
	 * @var bool
	 */
	static public $site_external_access;

	/**
	 * Définit si le site utilise la navigation asynchrone par défaut
	 * Int&egrave;gre SWFAddress automatiquement
	 * @var bool
	 */
	static public $site_async = false;

	/**
	 * @var string
	 */
	static public $site_encoding = "UTF-8";

	/**
	 * Liste des applications disponibles
	 * @var String
	 */
	static public $site_application = "main";	
	
	/**
	 * Th&egrave;me du site
	 * @var String
	 */
	static public $site_theme = "default";
	
	/**
	 * Définit si le site est en mode développement ou production
	 * @var Boolean
	 */
	static public $site_devmode = false;

	/**
	 * Définit si Query gén&egrave;re automatiquement des requ�tes Explain sur les Select
	 * @var bool
	 */
	static public $site_explainOnSelect = true;
	
	/**
	 * Définit si le site est multilangue
	 * @var Boolean
	 */
	static public $site_multilanguage = false;

	/**
	 * Définit l'email de contact du site
	 * @var string
	 */
	static public $site_emailContact = "";
	
	/**
	 * Définit si l'url doit �tre traduite (controller/action) en fonction des alias du fichier de langue
	 * @var Boolean
	 */
	static public $site_translateURL = false;
	
	/**
	 * Définit la langue par défaut
	 * @var String
	 */
	static public $site_defaultLanguage = "fr";
	
	/**
	 * Définit la langue en cours
	 * @var String
	 */
	static public $site_currentLanguage = "fr";
	
	/**
	 * Nom du controller s'occupant de gérer la page d'erreur 404
	 * @var String
	 */
	static public $site_template404 = "template.404.tpl";
	
	/**
	 * Nom d'acc&egrave;s pour les controllers Backoffice
	 * @var String
	 */
	static public $site_backoffice = "admin";
	
	/**
	 * Nom attribué &agrave; la session de l'application
	 * @var String
	 */	
	static public $site_session = "cbi_site";
	
	/**
	 * Tableau des permissions disponibles sur le site
	 * @var array
	 */
	static public $site_permissions = array();

	/**
	 * Définit si Smarty supprime les retours &agrave; la ligne &agrave; l'écriture des fichiers de cache des templates
	 * @var bool
	 */
	static public $site_inlineHTMLCode = false;
	
	/**
	 * Domaine du serveur (exemple : cbi-multimedia.com)
	 * @var String
	 */
	static public $server_domain;
	
	/**
	 * Dossier de base dans lequel se trouve le framework
	 * @var String
	 */
	static public $server_folder;
	
	/**
	 * URL du serveur (concaténation du domaine et du dossier)
	 * @var String
	 */
	static public $server_url;


    static public $server_dev;

	/**
	 * URL du serveur externe (concaténation du domaine et du dossier)
	 * @var String
	 */
	static public $server_url_external;

	/**
	 * Définit l'adresse du serveur smtp
	 * @var string
	 */
	static public $server_smtp = "smtp-av.nerim.net";


	/**
	 * Stock les informations des SGBD
	 * @var array
	 */
	static public $db = array(
		"default"=>array(
			"host"=>"localhost",
			"user"=>"root",
			"password"=>"",
			"name"=>"cbi-php-framework",
			"handler"=>"MysqlHandler"
		)
	);
	
	
	/**
	 * Nom de la classe chargée de gérer les authentifications sur le site
	 * @var String
	 */
	static public $application_authentificationHandler = "AuthentificationHandler";


	/**
	 * @var string
	 */
	static public $application_rewriteURLHandler;

	/**
	 * Nom du controller de base
	 * @var FrontController
	 */
	static public $application_frontController = "FrontController";

    /**
     * Tableau des packages supplémentaires
     * @var array
     */
    static public $application_autoload = array();

	/**
	 * @var string
	 */
	static public $authentification_tableName = "%s_user";

	/**
	 * @var string
	 */
	static public $authentification_tableId = "id_user";

	/**
	 * @var string
	 */
	static public $authentification_fieldPassword = "mdp_user";

	/**
	 * @var string
	 */
	static public $authentification_fieldLogin = "login_user";

	/**
	 * @var string
	 */
	static public $authentification_fieldPermissions = "permissions_user";

	/**
	 * @var bool
	 */
	static public $authentification_useGroup = false;
}