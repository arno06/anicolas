var BO = {};
BO.init = function(e)
{
	document.querySelectorAll(".td-liste").forEach(function(pItem){pItem.addEventListener("click", BO.tdListeClickHandler);});
	document.querySelectorAll(".target-blank").forEach(function(pItem){pItem.addEventListener("click", BO.aBlankClick);});
	document.querySelectorAll(".a-delete").forEach(function(pItem){pItem.addEventListener("click", BO.aDeleteClickHandler);});
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