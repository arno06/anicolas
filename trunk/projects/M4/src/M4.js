/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * http://code.google.com/p/anicolas/
 * M4.js
 */
if(!M4)
	var M4 = {};
M4.include = function(pFile)
{
	var s = document.getElementsByTagName("script");
	for(var j = 0, max = s.length;j<max;j++)
	{
		if((s[j].tagName.toLowerCase()=="script"&&s[j].getAttribute("src") === pFile)||
			(s[j].tagName.toLowerCase()=="link"&&s[j].getAttribute("href")=== pFile))
			return;
	}
	var f = pFile.split("/");
	f = f[f.length-1];
	var i = f.indexOf("\.") ;
	if(i==-1)
		return;
	var t = f.substr(i+1);
	var e;
	switch(t)
	{
		case "js":
			e = M4.createElement("script",{"src":pFile, "type":"text/javascript"});
		break;
		case "css":
			e = M4.createElement("link",{"href":pFile, "rel":"stylesheet"});
		break;
		default:
			return;
		break;
	}
	document.getElementsByTagName("head")[0].appendChild(e);
	return e;
};
M4.createElement = function (pNode, pProperties)
{
	var e = document.createElement(pNode);
	for(var i in pProperties)
	{
		switch(i)
		{
			case "parentNode":
				pProperties[i].appendChild(e);
				break;
			case "text":
				e.appendChild(document.createTextNode(pProperties[i]));
				break;
            case "htmlText":
                e.innerHTML = pProperties[i];
                break;
			case "style":
				for(var j in pProperties[i])
					e[i][j] = pProperties[i][j];
				break;
			default:
				e.setAttribute(i, pProperties[i]);
				break;
		}
	}
	return e;
};
M4.geom = (function()
{
	return {
		RADIAN_TO_DEGREE:180/Math.PI,
		DEGREE_TO_RADIAN:Math.PI/180
	};
}());

function MassLoader(){this.removeAllEventListener();}
Class.define(MassLoader, [EventDispatcher], {
	__stack:null,
	__current:null,
	assets:[],
	__init:function()
	{
		this.__stack = [];
		this.__current = -1;
		this.assets = {};
		this.addEventListener(Event.START, this.loadNext.proxy(this));
	},
	loadNext:function()
	{
		if(++this.__current==this.__stack.length)
		{
			this.dispatchEvent(new Event(Event.COMPLETE, false));
			return;
		}
		var f = this.__stack[this.__current].file, id = this.__stack[this.__current].id, l, ref = this;
		if(typeof(f) != "string")
		{
			this.loadNext();
			return;
		}
		this.dispatchEvent(new Event(MassLoader.NEXT, false));
		var type = f.split(".");
		type = type[type.length-1];
		switch(type.toLowerCase())
		{
			case "wav":
			case "mp3":
			case "ogg":
				l = new Audio();
				l.addEventListener("loadeddata", this.loadNext.proxy(this), false);
				l.autoplay = false;
				l.preload = "auto";
				l.src = f;
			break;
			case "png":
			case "jpg":
			case "bmp":
			case "gif":
				l = new Image();
				l.src = f;
			break;
			case "js":
			case "css":
				l = M4.include(f);
				if(!l)
					this.loadNext();
			break;
			default:
				this.loadNext();
			break;
		}
		this.assets[id] = l;
		l.onload = this.loadNext.proxy(this);
		l.onerror = function(){ref.dispatchEvent(new Event(MassLoader.ERROR, false));};
	},
	load:function(pFiles)
	{
		this.__init();
		for(var i in pFiles)
			this.__stack.push({id:i, file:pFiles[i]});
		this.dispatchEvent(new Event(Event.START, false));
	}
});
MassLoader.START = "start";
MassLoader.NEXT = "next";
MassLoader.ERROR = "error";

function JSLoader(pJS)
{
	this.removeAllEventListener();
	var ref = this;
	document.onreadystatechange = function()
	{
		switch(document.readyState)
		{
			case "complete":
				document.onreadystatechange = null;
				ref.load(pJS);
			break;
		}
	};
	document.onreadystatechange();
}
Class.define(JSLoader, [MassLoader], {ready:function(pHandler){this.addEventListener(Event.COMPLETE, pHandler);return this;}});