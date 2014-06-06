<?php
/**
 * Class Cart Permet de g�rer un panier - cas d'une boutique en ligne
 * 
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .1
 * @package tools
 */
class Cart extends Singleton
{
	/**
	 * Nom de la variable de session g�rant les items du panier
	 * @var String
	 */
	const SESSION_VAR_NAME = "cbi_panier";
	

	/**
	 * Constructor
	 * @param $pInstance
	 */
	public function __construct($pInstance)
	{
		if(!$pInstance instanceOf PrivateClass)
			trigger_error("Il est interdit d'instancier un objet de type <i>Singleton</i> - Merci d'utiliser la m�thode static <i>".__CLASS__."::getInstance()</i>", E_USER_ERROR);
		if(!$_SESSION[self::SESSION_VAR_NAME]||!is_array($_SESSION[self::SESSION_VAR_NAME]))
			$_SESSION[self::SESSION_VAR_NAME] = array();
	}
	
	/**
	 * M�thode d'ajout d'un item au panier
	 * @param int $pId							Identifiant unique
	 * @param $pPrice						Prix unitaire
	 * @param int $pQuantity						Quantit� d'item de ce type
	 * @return void
	 */
	public function add($pId, $pPrice, $pQuantity=1, $pProperty=null)
	{
		if(!$pId || !$pPrice || $pQuantity<=0)
			return;
		if($_SESSION[self::SESSION_VAR_NAME][$pId])
        {
			$_SESSION[self::SESSION_VAR_NAME][$pId]["quantity"] += $pQuantity;
            $_SESSION[self::SESSION_VAR_NAME][$pId]["total"] = $pPrice * $_SESSION[self::SESSION_VAR_NAME][$pId]["quantity"];
        }
		else
			$_SESSION[self::SESSION_VAR_NAME][$pId] = array("quantity"=>$pQuantity, "price"=>$pPrice, "property"=>$pProperty, "total"=>($pPrice*$pQuantity));
	}
	
	/**
	 * M�thode de mise-�-jour de la quantit� souhait�e pour un item donn�e
	 * @param object $pId			Identifiant unique
	 * @param object $pQuantity		Nouvelle quantit� souhait�
	 * @return void
	 */
	public function updateQuantity($pId, $pQuantity)
	{
		if(!$_SESSION[self::SESSION_VAR_NAME][$pId])
			return;
		$_SESSION[self::SESSION_VAR_NAME][$pId]["quantity"] = $pQuantity;
        $_SESSION[self::SESSION_VAR_NAME][$pId]["total"] = $pQuantity * $_SESSION[self::SESSION_VAR_NAME][$pId]['price'];
	}
	
	/**
	 * M�thode de suppression d'un item du panier
	 * @param object $pId					Identifiant unique
	 * @return void
	 */
	public function remove($pId)
	{
		unset($_SESSION[self::SESSION_VAR_NAME][$pId]);
	}
	
	/**
	 * M�thode de r�-initialisation du Panier
	 * @return void
	 */
	public function trash()
	{
		unset($_SESSION[self::SESSION_VAR_NAME]);
		$_SESSION[self::SESSION_VAR_NAME] = array();
	}
	
	/**
	 * M�thode de r�cup�ration des informations du panier
	 * Renvoie un tableau associatif : array("estimation"=>x, "countItems"=>y);
	 * @return Array
	 */
	public function getResume()
	{
		return array("estimation"=>$this->getEstimation(),
					 "countItems"=>$this->getCountItems());
	}
	
	/**
	 * M�thode de r�cup�ration du tableau des items se trouvant dans le panier
	 * @return Array
	 */
	public function getItems()
	{
		return $_SESSION[self::SESSION_VAR_NAME];
	}
	
	/**
	 * M�thode d'estimation de la valeur du panier
	 * @return Number
	 */
	private function getEstimation()
	{
		$estimation = 0;
		$max = count($_SESSION[self::SESSION_VAR_NAME]);
		if(!$max)
			return $estimation;
		foreach($_SESSION[self::SESSION_VAR_NAME] as $id=>$datas)
			$estimation += $datas["quantity"] * $datas["price"];
		return $estimation;
	}
	
	/**
	 * M�thode de r�cup�ration du nombre d'items ajout�s au panier
	 * @return Number
	 */
	private function getCountItems()
	{
		$count = 0;
		$max = count($_SESSION[self::SESSION_VAR_NAME]);
		if(!$max)
			return $count;
		foreach($_SESSION[self::SESSION_VAR_NAME] as $id=>$datas)
			$count += $datas["quantity"];
		return $count;
	}
	
	static public function getQuantityById($pId)
    {
        return $_SESSION[self::SESSION_VAR_NAME][$pId]['quantity'];
    }

	/**
	 * Singleton
	 * @param String $pClassName [optional]
	 * @return Cart
	 */
	static public function getInstance($pClassName = "")
	{
		return parent::getInstance(__CLASS__);
	}
}