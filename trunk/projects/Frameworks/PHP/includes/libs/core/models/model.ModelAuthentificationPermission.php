<?php
class ModelAuthentificationPermission extends BaseModel
{
	public function __construct()
	{
		$this->table = "main_user_permission";
		$this->id = "id_permission";
	}

	public function getPermissionsByIdGroup($pIdGroup)
	{
		return Query::select("*", ModelAuthentificationGroup::GROUP_PERMISSIONS)
					->join($this->table)
					->andWhere("id_group", Query::EQUAL, $pIdGroup)
					->execute();
	}

	public function deleteGroupsByPermission($pId)
	{
		return Query::delete()->from(ModelAuthentificationGroup::GROUP_PERMISSIONS)->where("id_permission", Query::EQUAL, $pId)->execute();
	}

	public function deleteById($pId)
	{
		$this->deleteGroupsByPermission($pId);
		return parent::deleteById($pId);
	}


}