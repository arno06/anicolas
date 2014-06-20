<?php
class index extends FrontController implements InterfaceController
{
 	public function __construct()
 	{

 	}
 	
	public function index()
	{
        if(!AuthentificationHandler::is(AuthentificationHandler::ADMIN))
            Go::toBack("index", "connexion");
	}
	
	public function connexion()
	{

        if(AuthentificationHandler::is(AuthentificationHandler::ADMIN))
            Go::toBack();
		$this->setTitle("Espace d'adminitration | Connexion");
		$form = new Form("login");
		if($form->isValid())
		{
			$data = $form->getValues();
            if(AuthentificationHandler::getInstance()->setAdminSession($data["login"], md5($data["mdp"])))
            {
                Go::toBack();
            }
			else
			{
				Logs::write("Tentative de connexion au backoffice <".$data["login"].":".$data["mdp"].">", Logs::WARNING);
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