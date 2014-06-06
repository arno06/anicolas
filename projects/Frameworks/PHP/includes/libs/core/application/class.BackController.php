<?php
/**
 * Controller de backoffice de base
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .4
 * @package application
 * @subpackage controller
 */
abstract class BackController extends FrontController implements InterfaceController
{

	/**
	 * @type String
	 */
	const EVENT_SUCCESSFUL_ADD      = "BOEvent_successful_add";

	/**
	 * @type String
	 */
	const EVENT_FAILED_ADD          = "BOEvent_failed_add";

	/**
	 * @type String
	 */
	const EVENT_SUCCESSFUL_MODIFY   = "BOEvent_successful_modify";

	/**
	 * @type String
	 */
	const EVENT_FAILED_MODIFY       = "BOEvent_failed_modify";

	/**
	 * @type String
	 */
	const EVENT_SUCCESSUL_DELETE    = "BOEvent_successful_delete";

	/**
	 * Instance du model que le controller pourra manipuler
	 * @var BaseModel
	 */
	protected $model;

	/**
	 * Nom du formulaire &agrave; récupérer pour l'ajout et la modification
	 * @var String
	 */
	protected $formName;

	/**
	 * Nom de la classe en cours
	 * @var String
	 */
	protected $className;

	/**
	 * Tableau des champs &agrave; afficher dans la liste des enregistrements
	 * @var array
	 */
	protected $listTitle = array();

	/**
	 * Nombre d'entrée &agrave; afficher par page dans la liste des enregistrements
	 * @var int
	 */
	protected $nbItemsByPage = 15;

	/**
	 * Définit si on utilise ou non le syst&egrave;me de pagination dans la liste des enregistrements
	 * @var Boolean
	 */
	protected $usePaginationOnList = true;

	/**
	 * @var BOHasList
	 */
	protected $has;

	/**
	 * @var BOLabelList
	 */
	protected $titles;

	/**
	 * @var BOLabelList
	 */
	protected $h1;

	/**
	 * Constructor
	 * Se doit d'�tre appeler dans la classe fille
	 * Vérifie si l'utilisateur est identifié
	 * Définie le nom du controller (de la classe courante)
	 */
	public function __construct()
	{
		if(!AuthentificationHandler::is(AuthentificationHandler::ADMIN))
			Go::toBack();
		$this->className = get_class($this);
		Autoload::addScript("prototype.js");
		Autoload::addScript("cbi/Backoffice.js");
		$this->h1 = new BOLabelList("h1", ucfirst($this->className));
		$this->titles = new BOLabelList("titles", ucfirst($this->className));
		$this->has = new BOHasList();
	}

	/**
	 * @param null $pSmarty
	 * @param bool $pDisplay
	 * @return string
	 */
	public function renderHTML($pSmarty = null, $pDisplay = true)
	{
		$this->addContent("has", $this->has->toArray());
		return parent::renderHTML($pSmarty, $pDisplay);
	}

	/**
	 * Méthode appelé par défault en cas de non-existance d'action
	 * Renvoie automatiquement vers l'action "lister"
	 * @return void
	 */
	public function index()
	{
		Go::toBack($this->className,"lister");
	}

	/**
	 * Méthode d'ajout d'une nouvel entrée
	 * Définie le formulaire
	 * Vérifie les données du formulaire
	 * Déclenche l'ajout dans le model
	 * @return void
	 */
	public function ajouter()
	{
		if(!$this->has->add)
			Go::to404();
		$this->setTitle($this->titles->add);
		$this->setTemplate("default", "ajouter");
		$form = new Form($this->formName);

		if($form->isValid())
		{
			if($this->model->insert($form->getValues()))
			{
                $id = $this->model->getInsertId();
                $this->addContent("confirmation", Dictionnary::term("backoffice.forms.addDone"));
                if ($id && $this->has->modify)
                    $this->dispatchEvent(new Event(self::EVENT_SUCCESSFUL_ADD, $id));
                else
                    $this->dispatchEvent(new Event(self::EVENT_SUCCESSFUL_ADD));
			}
			else
			{
				$this->addContent("error", Dictionnary::term("backoffice.forms.errorSQL"));
				$this->dispatchEvent(new Event(self::EVENT_FAILED_ADD));
			}
			$id = $this->model->getInsertId();
			$form->setUploadFileName($id);
		}
		else
			$this->addContent("error", $form->getError());
		$this->addForm("ajouter", $form);
		$this->addContent("h1", $this->h1->add);
	}

	/**
	 * Méthode permettant de lister toutes les entrées du model
	 * Gestion automatique du ORDER BY
	 * @param String $pCondition		Condition souhaitée pour la requ�te SQL
	 * @return void
	 */
	public function lister($pCondition = null)
	{
		if(!$this->has->listing)
			Go::to404();
		$this->setTitle($this->titles->listing);
		$this->setTemplate("default", "lister");
		$this->addContent("titles", $this->listTitle);
		$this->addContent("id", $this->model->id);
		if(!$pCondition)
			$pCondition = Query::condition();
        $pConditionCount = clone $pCondition;

		for($i=0,$max = count($this->listTitle); $i< $max; $i++)
		{
			if(isset($_GET["order"])&&in_array($_GET["order"], $this->listTitle[$i]))
			{
				$pCondition->order($_GET["order"],(isset($_GET["by"])?$_GET["by"]:"ASC"));
				$i = $max;
			}
		}
		if($this->usePaginationOnList)
		{
            $nbDatas =  $this->model->count($pConditionCount);
			$currentPage = isset($_GET["page"])?$_GET["page"]:1;
			$pagination = new PaginationHandler($currentPage, $this->nbItemsByPage, $nbDatas);
			$pCondition->limit($pagination->first, $pagination->number);
            $data = $this->model->listAll($pCondition);
			$this->addContent("paginationInfo", $pagination->getPaginationInfo());
		}
		else
			$data =  $this->model->listAll($pCondition);
		$this->addContent("liste", $data);
		$this->addContent("h1", $this->h1->listing);
	}

	/**
	 * Méthode de modification d'une entrée
	 * Récup&egrave;re les données via le model et les injecte dans le formulaire
	 * @return boolean
	 */
	public function modifier()
	{
		if(!$this->has->modify)
			Go::to404();
		$this->setTitle($this->titles->modify);
		if(!Form::isNumeric($_GET["id"]))
			Go::toBack($this->className);

		$form = new Form($this->formName);

		$donnee = $this->model->getTupleById($_GET["id"]);
		if(!$donnee)
			Go::toBack($this->className);
		$form->injectValues($donnee);

		if($form->isValid())
		{
			if($this->model->updateById($_GET["id"],$form->getValues()))
			{
				$this->addContent("confirmation", Dictionnary::term("backoffice.forms.modificationDone"));
				$this->dispatchEvent(new Event(self::EVENT_SUCCESSFUL_MODIFY));
			}
			else
			{
				$this->addContent("error", Dictionnary::term("backoffice.forms.errorSQL"));
				$this->dispatchEvent(new Event(self::EVENT_FAILED_MODIFY));
			}
			$id = $_GET["id"];
			$form->setUploadFileName($id);
		}
		else
			$this->addContent("error", $form->getError());
		$this->setTemplate("default", "modifier");
		$this->addContent("id", $this->model->id);
		$this->addForm("modifier", $form);
		$this->addContent("h1", $this->h1->modify);
	}

	/**
	 * Méthode de suppression d'une entrée
	 * Renvoie systématiquement &agrave; l'action "lister"
	 * @return void
	 */
	public function supprimer()
	{
		if(!$this->has->delete)
			Go::to404();
		if(!Form::isNumeric($_GET["id"]))
			Go::toBack($this->className);
		$this->model->deleteById($_GET["id"]);
		$this->dispatchEvent(new Event(self::EVENT_SUCCESSUL_DELETE));
		Go::toBack($this->className);
	}

	/**
	 * @param string $pField
	 * @param string $pLabel
	 * @param bool $pOrder
	 * @return void
	 */
	protected function addColumnToList($pField, $pLabel, $pOrder = true)
	{
		$this->listTitle[] = array("champ"=>$pField, "label"=>$pLabel, "order"=>$pOrder);
	}
}

/**
 * @package backoffice
 */
class BOLabelList
{
	/**
	 * @var string
	 */
	public $add;

	/**
	 * @var string
	 */
	public $modify;

	/**
	 * @var string
	 */
	public $listing;

	/**
	 * @param string $pId
	 * @param string $pClass
	 */
	public function __construct($pId, $pClass)
	{
		$this->add = sprintf(Dictionnary::term("backoffice.".$pId.".add"), $pClass);
		$this->modify = sprintf(Dictionnary::term("backoffice.".$pId.".modify"), $pClass);
		$this->listing = sprintf(Dictionnary::term("backoffice.".$pId.".listing"), $pClass);
	}
}

/**
 * @package backoffice
 */
class BOHasList
{
	/**
	 * @var bool
	 */
	public $add = true;

	/**
	 * @var bool
	 */
	public $modify = true;

	/**
	 * @var bool
	 */
	public $listing = true;

	/**
	 * @var bool
	 */
	public $delete = true;

	/**
	 * @return array
	 */
	public function toArray()
	{
		return array("add"=>$this->add, "modify"=>$this->modify, "listing"=>$this->listing, "delete"=>$this->delete);
	}
}