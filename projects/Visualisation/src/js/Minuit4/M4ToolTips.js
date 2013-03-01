function M4ToolTips(){}
M4ToolTips.display = function (pText)
{
	if(!$("M4ToolTips"))
		M4ToolTips.create();
	$("M4ToolTips").down(".M4ToolTipsTexte").innerHTML = pText;
	$("M4ToolTips").show();
	Event.observe(document, "mousemove", M4ToolTips.move)
};

M4ToolTips.hide = function ()
{
	Event.stopObserving(document, "mousemove", M4ToolTips.move);
	$("M4ToolTips").hide();
};

M4ToolTips.move = function (e)
{
	$("M4ToolTips").setStyle({"left" : Event.pointerX(e)+"px", "top" : Event.pointerY(e)+"px"});
};

M4ToolTips.create = function()
{
	var c = document.createElement("div");
	c.setAttribute("id", "M4ToolTips");
	c.style.position = "absolute";
	var t = document.createElement("div");
	t.setAttribute("class","M4ToolTipsTexte");
	c.appendChild(t);
	$(c).hide();
	c.style.display = "none";
	document.body.appendChild(c);
};