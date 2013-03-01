function M4ToolTips(){}
M4ToolTips.display = function (pText)
{
	var t = document.getElementById(M4ToolTips.ID);
	if(!t)
		t = M4ToolTips.create();
	document.getElementById(M4ToolTips.ID_TEXT).innerHTML = pText;
	Event.observe(document, "mousemove", M4ToolTips.move);
	t.style.display = "block";
};

M4ToolTips.hide = function ()
{
	Event.stopObserving(document,"mousemove", M4ToolTips.move);
	document.getElementById(M4ToolTips.ID).style.display = "none";
};

M4ToolTips.move = function (e)
{
	var t = $(M4ToolTips.ID);
	t.style.left = e.clientX+"px";
	t.style.top = e.clientY+"px";
	var r = t.getBoundingClientRect();
	var mf = t.getStyle("marginLeft").replace("px", "");
	var mt = t.getStyle("marginTop").replace("px", "");
	if(( t.offsetLeft + t.offsetWidth) > document.viewport.getWidth())
		t.style.left = (document.viewport.getWidth() - t.offsetWidth - mf)+"px";
	if((t.offsetTop + t.offsetHeight)>document.viewport.getHeight())
		t.style.top = (document.viewport.getHeight() - t.offsetHeight - mt)+"px";
	if(r.left<0)
		t.style.left = -(mf)+"px";
	if(r.top<0)
		t.style.top = -(mt)+"px";

};
M4ToolTips.ID = "M4ToolTips";
M4ToolTips.ID_TEXT = "M4ToolTipsText";
M4ToolTips.create = function()
{
	var c = document.createElement("div");
	c.setAttribute("id", M4ToolTips.ID);
	c.style.position = "absolute";
	var t = document.createElement("div");
	t.setAttribute("id",M4ToolTips.ID_TEXT);
	c.appendChild(t);
	c.style.display = "none";
	document.body.appendChild(c);
	return c;
};
M4ToolTips.init = function()
{
	$$("*[data-m4tooltips]").each(function(el)
	{
		var params = M4ToolTips.explodeParameters(el.getAttribute("data-m4tooltips"));
		if(!params.text)
			return;
		switch(params.on)
		{
			case "over":
				Event.observe(el, "mouseover", M4ToolTips.embedDisplayHandler);
				Event.observe(el, "mouseout", M4ToolTips.embedHideHandler);
				break;
			case "click":
				Event.observe(el, "click", M4ToolTips.embedDisplayHandler);
				Event.observe(document, "click", M4ToolTips.embedHideHandler);
				break;
		}
	});
};

M4ToolTips.explodeParameters = function(pParams)
{
	var pBase = {
		"type":"move",
		"on":"over"
	};
	var fs = pParams.split("&");
	for(var i = 0, max = fs.length;i<max;i++)
	{
		var p = fs[i].split("=");
		pBase[p[0]] = p[1];
	}
	return pBase;
};

M4ToolTips.embedDisplayHandler = function(e)
{
	Event.stop(e);
	var params = M4ToolTips.explodeParameters(e.target.getAttribute("data-m4tooltips"));
	M4ToolTips.display(params.text);
};

M4ToolTips.embedHideHandler = function(e)
{
	Event.stop(e);
	M4ToolTips.hide();
};

Event.observe(window, "load", M4ToolTips.init);