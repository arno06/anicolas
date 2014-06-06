function M4ToolTips(){}
M4ToolTips.displayed = false;
M4ToolTips.display = function (pText)
{
	if(!$("M4ToolTips"))
		M4ToolTips.create();
	$("M4ToolTips").down().innerHTML = pText;
	$("M4ToolTips").show();
    M4ToolTips.displayed = true;
	Event.observe(document, "mousemove", M4ToolTips.move)
};

M4ToolTips.hide = function ()
{
    if ($("M4ToolTips"))
    {
        Event.stopObserving(document, "mousemove", M4ToolTips.move);
        $("M4ToolTips").hide();
        M4ToolTips.displayed = false;
    }

};

M4ToolTips.toggle = function (e, pText)
{
    e.stop();
    if(!$("M4ToolTips"))
        M4ToolTips.create();
    var b = $("M4ToolTips");
    if (!M4ToolTips.displayed)
    {
        b.down().innerHTML = pText;
        b.show();
        M4ToolTips.move(e);
        M4ToolTips.displayed = true;
    }
    else
    {
        b.hide();
        M4ToolTips.displayed = false;
    }

};

M4ToolTips.move = function (e)
{
    var x = Event.pointerX(e)+5;
    var y = Event.pointerY(e)+5;
    var m = $("M4ToolTips");
    var w = m.getWidth();
    var h = m.getHeight();
    var dim = document.viewport.getDimensions();
    var scroll = document.viewport.getScrollOffsets();
    if (x + w > dim.width + scroll.left)
        x = Event.pointerX(e) - w - 5;
    if (y + h > dim.height + scroll.top)
        y = Event.pointerY(e) - h - 5;


    m.setStyle({"left" : x+"px", "top" : y+"px"});
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