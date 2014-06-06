<?php
class index extends FrontController implements InterfaceController
{
 	public function __construct()
 	{

 	}
 	
	public function index()
	{

	}
	
	public function connexion()
	{

        if(AuthentificationHandler::is(AuthentificationHandler::ADMIN))
            Go::toBack();
		$this->setTitle("Espace d'adminitration | Connexion");
		$form = new Form("login");
		if($form->isValid())
		{
			$datas = $form->getValues();
//            if(VidalIDHandler::getInstance()->login($datas["login"], md5($datas["mdp"]), true) && VidalIDHandler::isLoggedToBack())
            if(VidalIDHandler::getInstance()->login($datas["login"], $datas["mdp"], true) && (VidalIDHandler::isLoggedToBack() || VidalIDHandler::isSubstanceUser() || VidalIDHandler::isPhotoUser()))
            {
                VidalIDHandler::getInstance()->createSession(true);
                Go::toBack();
            }
			else
			{
				Logs::write("Tentative de connexion au backoffice <".$datas["login"].":".$datas["mdp"].">", Logs::WARNING);
				$this->addContent("error", "Le login ou le mot de passe est incorrect");
			}
		}
		else
			$this->addContent("error", $form->getError());
		$this->addForm("login", $form);
	}
	
	public function deconnexion()
	{
        AuthentificationHandler::logout();
		Go::toBack();
	}
}