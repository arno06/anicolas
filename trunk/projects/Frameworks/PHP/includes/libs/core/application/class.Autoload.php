<?php
/**
 * Class Autoload
 *
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package application
 */
class Autoload extends Singleton
{
    static public $folder = "";

	/**
	 * @type string
	 */
	const FOLDER_LIBS = "/includes/libs/core/";

	/**
	 * @type string
	 */
	const FOLDER_APPLICATION = "/includes/applications/%s/src/";

	/**
	 * @type string
	 */
	const FOLDER_MODEL_LIBS = "/includes/libs/core/models/";

	/**
	 * @type string
	 */
	const FOLDER_MODEL_APPLICATION = "/includes/applications/%s/models/";

	/**
	 * @var array
	 */
	private $packageFolders;

	/**
	 * @var int
	 */
	private $countPackages;

	/**
	 * @var array
	 */
	private $scripts;

    /**
     * @var array
     */
    private $scriptDependencies;

	/**
	 * @var array
	 */
	private $styles;

	/**
	 * @var array
	 */
	private $exeptions = array("PHPMailer"=>"/includes/libs/phpMailer/class.phpmailer.php",
								"Spreadsheet_Excel_Reader"=>"/includes/libs/excel/class.Spreadsheet_Excel_Reader.php");

	
	/**
	 * constructor
	 */
	public function __construct()
	{
		$this->scripts = array();
        $this->scriptDependencies = array();
		$this->styles = array();
		$this->packageFolders = array("",
					"data/",
					"system/",
					"utils/",
					"tools/",
					"tools/form/",
					"tools/debugger/",
					"tools/google/",
					"tools/afs/",
					"tools/omniture/",
                    "tools/advantage/",
					"application/",
					"application/event/",
					"application/authentification/",
					"db/",
					"db/handler/");
		$this->countPackages = count($this->packageFolders);
	}


	/**
	 * @param string $pClassName
	 * @return bool
	 */
	public function load($pClassName)
	{
        Debugger::trace("loading  : ".$pClassName);
        if(array_key_exists($pClassName, $this->exeptions))
        {
	        require_once(self::$folder.$this->exeptions[$pClassName]);
            return true;
        }
		$type = "class";
		if(preg_match("/^(Model|Interface)/", $pClassName, $matches))
			$type = strtolower($matches[1]);
		switch($type)
		{
			case "interface":
			case "class":
				if($this->from(self::FOLDER_LIBS, $type.".".$pClassName))
					return true;
				if($this->from(sprintf(self::FOLDER_APPLICATION, Configuration::$site_application), $type.".".$pClassName))
					return true;
			break;
			case "model":
				$path = self::$folder.sprintf(self::FOLDER_MODEL_APPLICATION, Configuration::$site_application)."model.".$pClassName.".php";
				if(file_exists($path))
				{
					require_once($path);
					return true;
				}
                $path = self::$folder.self::FOLDER_MODEL_LIBS."model.".$pClassName.".php";
				if(file_exists($path))
				{
					require_once($path);
					return true;
				}
			break;
		}

		switch($type)
		{
			case "interface":
				trigger_error("Impossible de charger l'interface <b>".$pClassName."</b>.", E_USER_ERROR);
			break;
			case "model":
				trigger_error("Impossible de charger le model <b>".$pClassName."</b>.", E_USER_ERROR);
			break;
			default:
			case "class":
                trigger_error("Impossible de charger la classe <b>".$pClassName."</b>.", E_USER_ERROR);
			break;
		}

        return false;
	}

	
	/**
	 * @param string $pBaseFolder
	 * @param string $pClass
	 * @return bool
	 */
	private function from($pBaseFolder, $pClass)
	{
		for($i = 0;$i<$this->countPackages;$i++)
		{
			$path = self::$folder.$pBaseFolder.$this->packageFolders[$i].$pClass.".php";
			if(file_exists($path))
			{
				require_once($path);
				return true;
			}
		}
		return false;
	}


	/**
	 * @static
	 * @param string $pScript
	 * @return void
	 */
	static public function addScript($pScript)
	{
        if(preg_match("/\.js$/", $pScript))
        {
            $script = (strpos($pScript, "http") === 0) ? $pScript : Core::$path_to_components . "/" . $pScript;
            if(!in_array($script, self::getInstance()->scripts, true))
                self::getInstance()->scripts[] = $script;
        }
        else
        {
            if(!in_array($pScript, self::getInstance()->scriptDependencies, true))
                self::getInstance()->scriptDependencies[] = $pScript;
        }
	}


	/**
	 * @static
	 * @param string $pStyleSheet
	 * @param bool   $pInThemeFolder
	 * @return void
	 */
	static public function addStyle($pStyleSheet, $pInThemeFolder = true)
	{
		if($pInThemeFolder)
			$pStyleSheet = Core::$path_to_theme."/css/".$pStyleSheet;
		if(!in_array($pStyleSheet, self::getInstance()->styles, true))
			self::getInstance()->styles[] = $pStyleSheet;
	}


	/**
	 * @static
	 * @return array
	 */
	static public function scripts()
	{
        if(!empty(self::getInstance()->scriptDependencies))
            self::getInstance()->scripts[] = "statique/dependencies/?need=".implode(',', self::getInstance()->scriptDependencies);
		return self::getInstance()->scripts;
	}


	/**
	 * @static
	 * @return array
	 */
	static public function styles()
	{
		return self::getInstance()->styles;
	}

	
	/**
	 * @static
	 * @param string $pClass
	 * @return Autoload
	 */
	static public function getInstance($pClass = "")
	{
		return parent::getInstance(__CLASS__);
	}
}