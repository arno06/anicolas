/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 *
 * css sample :
#M4BoxHide{background:#000;height:100%;width:100%;}
#M4BoxHide,#M4Box{top:0;left:0;z-index:80;position:fixed;display:none;opacity:0;filter:alpha(opacity=0);}
#M4Box{left:50%;margin-top:40px;background:#ffffff url(../imgs/loader.gif) no-repeat center center;}
#M4Box .M4Close {display:block;position:absolute;top:10px;right:10px;height:0;width:34px;padding-top:34px;overflow:hidden;background: #000;}
 */
Event.observe(document, "dom:loaded", initM4Box);
function initM4Box()
{
	$$("*[rel^=M4Box]").each(function(a)
	{
		if(a.rel == "")
			return;
		var r = a.getAttribute("rel"), t;
		r.sub(/M4Box\[([a-z0-9\_\-]+)\]/,function (match){return t = match[1];});
		if(t&&document.getElementById(t))
		{
			M4Box.register(a, t);
		}
		t = false;
		r.sub(/M4Box\[ajax\:([^\]]+)\]/, function (match){return t=match[1];});
		if(t)
		{
			a.rel = t;
			Event.observe(a, "click", aClickAjaxBox);
		}
	});
    for(var i in M4Box.content)
    {
        var t = document.getElementById(i);
        if (t) t.parentNode.removeChild(t);
    }

    if (M4Box.defaultBox)
        displayBox(M4Box.defaultBox);
}

function aClickAjaxBox(e)
{
    var rel = e.target["rel"]?e.target["rel"]:$(e.target).up("a").rel;
    new Ajax.Request(rel, {"onSuccess":displayBoxAjax, "parameters":{"o_html":1}});
	Event.stop(e);
}

function displayBoxAjax(pResponse)
{
	M4Box.display(pResponse.responseJSON.html);
}

function aClickDisplayBox(e)
{
	var rel = e.target.getAttribute("rel")?e.target.getAttribute("rel"):$(e.target).up("a").rel;
	M4Box.display(M4Box.content[rel]);
	Event.stop(e);
}

function displayBox(c)
{
    if (M4Box.content[c]) M4Box.display(M4Box.content[c]);
}

function M4Box(){}
M4Box.register = function(pElement, pIdContent)
{
    M4Box.extractContent(pIdContent);
	pElement.setAttribute("rel", pIdContent);
	Event.observe(pElement, "click", aClickDisplayBox);
};
M4Box.extractContent = function(pIdContent)
{
	var t;
	if(!M4Box.content[pIdContent]&&(t = document.getElementById(pIdContent)))
	{
		M4Box.content[pIdContent] = t.innerHTML;
//		t.parentNode.removeChild(t);
	}
};
M4Box.content = {};
M4Box.created = false;
M4Box.defaultBox = null;
M4Box.defaultTop = 0;
M4Box.display = function(pHtml)
{
	if(!M4Box.created)
		M4Box.create();

    if (typeof M4ToolTips != "undefined" && M4ToolTips.displayed)
        M4ToolTips.hide();
    
	var a = document.getElementById("M4BoxHide");
	var b = document.getElementById("M4Box");
	b.innerHTML = "";
    b.style.width = "80%";
	b.innerHTML = pHtml;
	a.style.display = "block";
	b.style.display = "block";
	b.style.filter = "alpha(opacity=0)";
    var boxHeight = b.offsetHeight;
    var h = window.innerHeight != undefined ? window.innerHeight : document.documentElement.clientHeight;
    b.style.marginTop = (boxHeight && h/2 > boxHeight) ? (h/2 - boxHeight/2)+"px" : M4Box.defaultTop;

    M4Tween.to(a, .2, {"opacity":.65});
	M4Tween.to(b, .3, {"opacity":1}).onComplete(function(){
        b.style.filter = undefined;
    });
	b.style.left = "50%";
	b.style.marginLeft = "-"+($("M4Box").offsetWidth * .5)+"px";
	var close = document.createElement("div");
	a = document.createElement("a");
	a.href="#";
	a.innerHTML = "&times;";
	close.appendChild(a);
    var c = b.down("div");
    if (c)
        c.appendChild(close);
    else
	    b.appendChild(close);
	$(close).addClassName("close");
	Event.observe(a, "click", CloseM4BoxHandler);
	b.innerHTML.evalScripts();
	Event.fire(document, M4Box.EVENT_LOADED);
};

M4Box.hide = function()
{
	var a = document.getElementById("M4BoxHide");
	var b = document.getElementById("M4Box");
	M4Tween.to(a, .3, {"opacity":0}).onComplete(function(){a.style.display="none";b.style.display="none";});
	M4Tween.to(b, .2, {"opacity":0}).onComplete(function(){Event.fire(document, M4Box.EVENT_CLOSED);});
    Event.fire(document, M4Box.EVENT_CLOSE);
};


M4Box.removeListeners = function(){Event.stopObserving(document, "M4Box:loaded");};

M4Box.create = function()
{
	var hide = document.createElement("div");
	hide.setAttribute("id", "M4BoxHide");
	document.body.appendChild(hide);
	var box = document.createElement("div");
	box.setAttribute("id","M4Box");
	document.body.appendChild(box);
	M4Box.created = true;
    var top = $("M4Box").getStyle("marginTop");
    if (top) M4Box.defaultTop = top;
	Event.observe(hide, "click", CloseM4BoxHandler)  ;
    Event.observe(document, "keydown", keypressHandler);
};

M4Box.EVENT_LOADED = "M4Box:loaded";
M4Box.EVENT_CLOSE = "M4Box:close";
M4Box.EVENT_CLOSED = "M4Box:closed";

function CloseM4BoxHandler(e)
{
	M4Box.hide();
	Event.stop(e);
}

function keypressHandler(e)
{
    var code = e.keyCode;
    if (code == Event.KEY_ESC)
        CloseM4BoxHandler(e);
}