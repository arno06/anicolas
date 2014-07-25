<?php
class index extends FrontController
{
	public function __construct()
	{

 	}

    public function index()
    {
        $this->addContent("titre", "bouboup");
    }
}