var BO = {};
BO.init = function(e)
{
	$each(".td-liste", "click", BO.tdListeClickHandler, false);
	$each(".target-blank", "click", BO.aBlankClick, false);
	$each(".a-delete", "click", BO.aDeleteClickHandler, false);
};

BO.aDeleteClickHandler = function(e)
{
	if(!confirm("Etes-vous sur de vouloir supprimer cet enregistrement ?"))
		Event.stop(e);
};

BO.aBlankClick = function(e)
{
	window.open(e.target.href, "_blank");
		Event.stop(e);
};

BO.tdListeClickHandler = function(e)
{
	var a = e.target.up("tr").down(".a-edit");
	if(a)
	{
		window.location.href=a.href;
		return;
	}
	a = e.target.down(".a-edit");
	if(a.item(0))
	{
		window.location.href=a.item(0).getAttribute("href");
	}
};

Event.observe(window, "load", BO.init);