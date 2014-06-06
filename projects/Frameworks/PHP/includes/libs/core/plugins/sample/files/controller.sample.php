<?php
/**
 * @author Chuck Norris
 **/
class sample extends BackController
{
	public function __construct()
	{
		parent::__construct();
		$this->addColumnToList("vc_sample", "VarChar");
		$this->formName = 'sample';
		$this->model = new ModelSample();
		
	}
}