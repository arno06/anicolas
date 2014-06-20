<?php
date_default_timezone_set("Europe/Paris");
define("MEMORY_REAL_USAGE", true);
$timeInit = microtime(true);
$memInit = memory_get_usage(MEMORY_REAL_USAGE);

require_once("includes/libs/core/application/class.Singleton.php");
require_once("includes/libs/core/application/class.Header.php");
require_once("includes/libs/core/application/class.Autoload.php");

spl_autoload_register(array(Autoload::getInstance(), "load"));

require_once("includes/libs/core/tools/debugger/class.Debugger.php");
require_once("includes/libs/core/db/interface.InterfaceDatabaseHandler.php");
require_once("includes/libs/core/db/handler/class.MysqlHandler.php");
require_once("includes/libs/core/data/interface.InterfaceData.php");
require_once("includes/libs/core/system/class.File.php");
require_once("includes/libs/core/data/class.SimpleJSON.php");
require_once("includes/libs/core/application/class.BaseModel.php");
require_once("includes/libs/core/application/class.Configuration.php");
include_once("includes/libs/core/utils/class.Stack.php");
require_once("includes/libs/core/application/class.Dictionary.php");
require_once("includes/libs/core/application/class.Core.php");
require_once("includes/libs/core/application/event/class.EventDispatcher.php");
require_once("includes/libs/core/application/event/class.Event.php");
require_once("includes/libs/core/application/class.FrontController.php");
require_once("includes/libs/core/application/interface.InterfaceController.php");
require_once("includes/libs/core/application/authentification/class.Authentification.php");
require_once("includes/libs/core/application/authentification/class.AuthentificationHandler.php");
require_once("includes/libs/core/application/rewriteurl/interface.InterfaceRewriteURLHandler.php");
require_once("includes/libs/core/application/rewriteurl/class.RewriteURLHandler.php");
require_once("includes/libs/smarty/Smarty.class.php");

Core::setConfiguration();
Core::init();
Core::parseURL();
Core::execute(Core::getController(), Core::getAction(), Core::getTemplate());
Core::endApplication();
