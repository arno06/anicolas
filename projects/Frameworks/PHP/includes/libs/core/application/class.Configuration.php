<?php
/**
 * Class Configuration
 * Sert de référence pour n'importe quelle propriété nécessaire à la configuration de l'application
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
     * @tbd
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
	 * Thème du site
	 * @var String
	 */
	static public $site_theme = "default";

	/**
	 * Définit si Query génère automatiquement des requêtes Explain sur les Select
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
	 * Définit si l'url doit être traduite (controller/action) en fonction des alias du fichier de langue
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
	 * Nom d'accès pour les controllers Backoffice
	 * @var String
	 */
	static public $site_backoffice = "admin";

	/**
	 * Nom attribué à la session de l'application
	 * @var String
	 */
	static public $site_session = "fw_php";

	/**
	 * Tableau des permissions disponibles sur le site
	 * @var array
	 */
	static public $site_permissions = array();

	/**
	 * Définit si Smarty supprime les retours à la ligne à l'écriture des fichiers de cache des templates
	 * @var bool
	 */
	static public $site_inlineHTMLCode = false;

	/**
	 * Domaine du serveur
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

	/**
	 * Définit l'adresse du serveur smtp
	 * @var string
	 */
	static public $server_smtp = "";

	/**
	 * Stock les informations des SGBD
	 * @var array
	 */
	static public $db = array(
		"default"=>array(
			"host"=>"localhost",
			"user"=>"root",
			"password"=>"",
			"name"=>"php-framework",
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
     * @var BackController
     */
    static public $application_backController = "BackController";

    /**
     * Tableau des packages supplémentaires
     * @var array
     */
    static public $application_autoload = array();

    /**
     * @var bool
     */
    static public $application_debug = false;

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
}