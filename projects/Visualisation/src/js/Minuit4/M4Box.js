/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 *
 * css sample :
#M4BoxHide{background:#000;height:100%;width:100%;}
#M4BoxHide,#M4Box{top:0;left:0;z-index:80;position:fixed;display:none;opacity:0;filter:alpha(opacity=0);}
#M4Box{left:50%;margin-top:40px;background:#ffffff url(../imgs/loader.gif) no-repeat center center;}
#M4Box .M4Close {display:block;position:absolute;top:10px;right:10px;height:0;width:34px;padding-top:34px;overflow:hidden;background: #000;}
 */

Event.observe(window, "load", initM4Box);
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
}


function aClickAjaxBox(e)
{
	var rel = e.target["rel"]?e.target["rel"]:$(e.target).up("a").rel;
	new Ajax.Request(rel, {"onSuccess":displayBoxAjax});
	Event.stop(e);
}

function displayBoxAjax(pResponse)
{
	M4Box.display(pResponse.responseText);
}

function aClickDisplayBox(e)
{
	var rel = e.target.getAttribute("rel")?e.target.getAttribute("rel"):$(e.target).up("a").rel;
	M4Box.display(M4Box.content[rel]);
	Event.stop(e);
}

function M4Box(){}
M4Box.register = function(pElement, pIdContent)
{
	if(M4Box.content[pIdContent])
	{
		pElement.setAttribute("rel", pIdContent);
		Event.observe(pElement, "click", aClickDisplayBox);
		return;
	}
	var t = document.getElementById(pIdContent);
	if(!t)
		return;
	M4Box.content[pIdContent] = t.innerHTML;
	t.parentNode.removeChild(t);
	pElement.setAttribute("rel", pIdContent);
	Event.observe(pElement, "click", aClickDisplayBox);
};
M4Box.content = {};
M4Box.created = false;
M4Box.display = function(pHtml)
{
	if(!M4Box.created)
		M4Box.create();
	var a = document.getElementById("M4BoxHide");
	var b = document.getElementById("M4Box");
	M4Tween.killTweensOf(a);
	M4Tween.killTweensOf(b);
	b.innerHTML = "";
	b.style.width = "auto";
	b.innerHTML = pHtml;
	a.style.display = "block";
	b.style.display = "block";
	b.style.filter = "alpha(opacity=0)";
	M4Tween.to(a, .2, {"opacity":.65});
	M4Tween.to(b, .3, {"opacity":1});
	$("M4Box").style.left = "50%";
	$("M4Box").style.marginLeft = "-"+($("M4Box").getStyle("width").replace(/(px|\%)/,"") * .5)+"px";
	var close = document.createElement("div");
	a = document.createElement("a");
	a.href="#";
	a.appendChild(document.createTextNode("Fermer"));
	close.appendChild(a);
	b.appendChild(close);
	$(close).addClassName("close");
	Event.observe(a, "click", CloseM4BoxHandler);
	$("M4Box").fire("M4Box:loaded");
};

M4Box.hide = function()
{
	var a = document.getElementById("M4BoxHide");
	var b = document.getElementById("M4Box");
	M4Tween.killTweensOf(a);
	M4Tween.killTweensOf(b);
	M4Tween.to(a, .3, {"opacity":0}).onComplete(function(){a.style.display="none";b.style.display="none";});
	M4Tween.to(b, .2, {"opacity":0});
};

M4Box.create = function()
{
	var hide = document.createElement("div");
	hide.setAttribute("id", "M4BoxHide");
	document.body.appendChild(hide);
	var box = document.createElement("div");
	box.setAttribute("id","M4Box");
	document.body.appendChild(box);
	M4Box.created = true;
	Event.observe(hide, "click", CloseM4BoxHandler)
};

function CloseM4BoxHandler(e)
{
	M4Box.hide();
	Event.stop(e);
}