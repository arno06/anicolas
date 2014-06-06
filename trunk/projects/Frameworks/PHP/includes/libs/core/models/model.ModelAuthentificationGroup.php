<?php
class ModelAuthentificationGroup extends BaseModel
{
	const GROUP_PERMISSIONS = "main_user_group_permission";

	public function __construct()
	{
		$this->table = "main_user_group";
		$this->id = "id_group";
	}

	public function getUserGroup($pIdGroup)
	{
		$group = $this->one(Query::condition()->andWhere("id_group", Query::EQUAL, $pIdGroup));
		if(empty($group))
			return null;
		$p = new ModelAuthentificationPermission();
		$group["permissions"] = $p->getPermissionsByIdGroup($pIdGroup);
		return $group;
	}

	public function all($pCond = null, $pFields = "*")
	{
		$r = parent::all($pCond, $pFields);
		foreach($r as &$t)
		{
			if(!isset($t["id_group"]))
				continue;
			$permissions = Query::select("id_permission", self::GROUP_PERMISSIONS)->andWhere("id_group", Query::EQUAL, $t["id_group"])->execute();
			$t["id_permission"] = array();
			foreach($permissions as $p)
				$t["id_permission"][] = $p["id_permission"];
		}
		return $r;
	}


	public function insert(array $pValues)
	{
		if(isset($pValues["id_permission"]))
		{
			$id_permissions = $pValues["id_permission"];
			unset($pValues["id_permission"]);
		}
		$in = parent::insert($pValues);
		if(!$in)
			return false;
		if(isset($id_permissions))
		{
			$group_permissions = array();
			$id_group = $this->getInsertId();
			foreach($id_permissions as $id)
				$group_permissions[] = array("id_group"=>$id_group, "id_permission"=>$id);
			Query::insertMultiple($group_permissions)->into(self::GROUP_PERMISSIONS)->execute();
		}
		return true;
	}

	public function updateById($pId, array $pValues)
	{
		if(isset($pValues["id_permission"]))
		{
			$id_permissions = $pValues["id_permission"];
			unset($pValues["id_permission"]);
		}
		if(!parent::updateById($pId, $pValues))
			return false;
		if(isset($id_permissions))
		{
			$group_permissions = array();
			foreach($id_permissions as $id)
				$group_permissions[] = array("id_group"=>$pId, "id_permission"=>$id);
			$this->deletePermissionsByGroup($pId);
			Query::insertMultiple($group_permissions)->into(self::GROUP_PERMISSIONS)->execute();
		}
		return true;
	}

	public function deletePermissionsByGroup($pIdGroup)
	{
		Query::delete()->from(self::GROUP_PERMISSIONS)->where("id_group", Query::EQUAL, $pIdGroup)->execute();
	}

	public function deleteById($pId)
	{
		$this->deletePermissionsByGroup($pId);
		return parent::deleteById($pId);
	}
}