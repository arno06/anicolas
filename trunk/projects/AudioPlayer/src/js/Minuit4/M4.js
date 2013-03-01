var M4 =
{
	browser:(function()
	{
		var ua = navigator.userAgent;
		return {
			IE:ua.indexOf("MSIE")>-1,
			FF:ua.indexOf("Firefox")>-1,
			CHROME:ua.indexOf("Chrome")>-1,
			SAFARI:ua.indexOf("AppleWebKit")>-1&&ua.indexOf("Chrome")===-1
		};
	})(),
	need:function()
	{
		return new JSLoader(arguments);
	},
	proxy:function(pInstance, pMethod){return function(){pMethod.apply(pInstance, arguments)};},
	decorate:function(e){
		e.css = (function(){return document&&document.defaultView&&document.defaultView.getComputedStyle?document.defaultView.getComputedStyle(e, null):e.currentStyle;})();
	},
	include:function(pFile)
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
	},
	createElement:function (pNode, pProperties)
	{
		var e = document.createElement(pNode);
		for(var i in pProperties)
		{
			switch(i)
			{
				case "text":
					e.appendChild(document.createTextNode(pProperties[i]));
				break;
				default:
					e.setAttribute(i, pProperties[i]);
				break;
			}
		}
		M4.decorate(e);
		return e;
	},
	geom:(function()
	{
		return {
			RADIAN_TO_DEGREE:180/Math.PI,
			DEGREE_TO_RADIAN:Math.PI/180
		};
	}())
};

function Class(){}
Class.prototype = {
	toString : function()
	{
		return this.formatToString();
	},
	formatToString : function()
	{
		var re = /^function ([a-z][a-z0-9_]*)\(/i;
		var t = re.exec(this.constructor.toString());
		var s = "[Object "+t[1];
		for(var i=0, max = arguments.length;i<max;i++)
			s+= " "+arguments[i]+"=\""+this[arguments[i]]+"\"";
		return s+"]";
	}
};
Class.extend = function(pTarget, pClassParent)
{
	for(var i in pClassParent.prototype)
		pTarget.prototype[i] = pClassParent.prototype[i];
};
Class.define = function(pTarget, pExtends, pPrototype)
{
	if(pExtends.length>0)
	{
		for(var i = 0, max=pExtends.length; i<max; i++)
			Class.extend(pTarget, pExtends[i]);
	}
	for(var k in pPrototype)
		pTarget.prototype[k] = pPrototype[k];
};


function trace(pV){console.log((typeof(pV)=="object"&&typeof(pV["toString"])=="function")?pV.toString():pV);}


function Event(pType, pBubbles)
{
	this.type = pType;
	this.bubbles = typeof(pBubbles)!="undefined"?pBubbles:false;
	this.eventPhase = Event.AT_TARGET;
}
Class.define(Event, [Class], {
	target:null,
	currentTarget:null,
	eventPhase:null,
	type:null,
	bubbles:false,
	clone:function(){var e = new Event(this.type, this.bubbles);e.target = this.target;return e;},
	toString:function(){return this.formatToString("type", "eventPhase", "target", "currentTarget", "bubbles");}
});

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

Event.ADDED_TO_STAGE = "added_to_stage";
Event.REMOVED_FROM_STAGE = "removed_from_stage";
Event.ENTER_FRAME = "enter_frame";
Event.INIT = "init";
Event.COMPLETE = "complete";


function MouseEvent(pType, pBubbles, pMouseX, pMouseY)
{
	this.type = pType;
	this.localX = pMouseX||0;
	this.localY = pMouseY||0;
	this.bubbles = typeof(pBubbles)=="boolean"?pBubbles:false;
	this.eventPhase = Event.AT_TARGET;
}
Class.define(MouseEvent, [Event], {
	localX:0,
	localY:0
});
MouseEvent.MOUSE_OVER = "mouse_over";
MouseEvent.MOUSE_OUT = "mouse_out";
MouseEvent.MOUSE_DOWN = "mouse_down";
MouseEvent.MOUSE_UP = "mouse_up";
MouseEvent.CLICK = "click";
MouseEvent.LEFT_BUTTON = 0;
MouseEvent.RIGHT_BUTTON = 2;


function EventDispatcher(){this.removeAllEventListener();}
Class.define(EventDispatcher, [Class], {
	__listeners:{},
	__listenersCapture:{},
	addEventListener:function(pType, pHandler, pCapture)
	{
		if(typeof(pCapture)!="boolean")
			pCapture = false;
		if(pCapture)
		{
			if(!this.__listenersCapture[pType])
				this.__listenersCapture[pType] = [];
			this.__listenersCapture[pType].push(pHandler);
		}
		else
		{
			if(!this.__listeners[pType])
				this.__listeners[pType] = [];
			this.__listeners[pType].push(pHandler);
		}
	},
	removeEventListener:function(pType, pHandler, pCapture)
	{
		if(typeof(pCapture)!="boolean")
			pCapture = false;
		var t = (pCapture?this.__listenersCapture:this.__listeners)[pType];
		if(typeof(t)=="undefined"||!t.length)
			return;
		var handlers = [];
		for(var i = 0, max = t.length;i<max;i++)
		{
			if(t[i]===pHandler)
				continue;
			handlers.push(t[i]);
		}
		if(pCapture)
			this.__listenersCapture[pType] = handlers;
		else
			this.__listeners[pType] = handlers;
	},
	removeAllEventListener:function(pType)
	{
		if(typeof(pType)=="undefined")
		{
			this.__listeners = {};
			this.__listenersCapture = {};
			return;
		}
		this.__listeners[pType] = [];
		this.__listenersCapture[pType] = [];
	},
	dispatchEvent:function(pEvent)
	{
		if(!pEvent.target)
			pEvent.target = this;
		pEvent.currentTarget = this;
		var a = [], p = this.parent, i, max, e;
		switch(pEvent.eventPhase)
		{
			case Event.CAPTURING_PHASE:
				if(typeof(this.__listenersCapture[pEvent.type])=="undefined")
					return;
				for(i = 0, max = this.__listenersCapture[pEvent.type].length;i<max;i++)
					this.__listenersCapture[pEvent.type][i](pEvent);
			break;
			case Event.AT_TARGET:
				while(p)
				{
					a.push(p);
					p = p.parent;
				}
				e = pEvent.clone();
				e.eventPhase = Event.CAPTURING_PHASE;
				for(i = a.length-1; i>=0; i--)
					a[i].dispatchEvent(e);
				if(typeof(this.__listeners[pEvent.type])=="object"&&this.__listeners[pEvent.type].length>0)
				{
					for(i = 0, max = this.__listeners[pEvent.type].length;i<max;i++)
					{
						if(this.__listeners[pEvent.type])
							this.__listeners[pEvent.type][i](pEvent);
					}
				}
				if(pEvent.bubbles)
				{
					e = pEvent.clone();
					e.eventPhase = Event.BUBBLING_PHASE;
					for(i = 0, max = a.length;i<max;i++)
						a[i].dispatchEvent(e);
				}
			break;
			case Event.BUBBLING_PHASE:
				if(typeof(this.__listeners[pEvent.type])=="undefined")
					return;
				for(i = 0, max = this.__listeners[pEvent.type].length;i<max;i++)
					this.__listeners[pEvent.type][i](pEvent);
			break;
		}
	}
});


Array.prototype.each = function(pHandler)
{
	if(typeof(pHandler)!="function" || !this.length)
		return;
	for(var i = 0, max = this.length; i<max;i++)
		pHandler(this[i]);
};

function Request(pTarget, pParams)
{
	var xhr_object = false;
    if (window.XMLHttpRequest)
    	xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject)
    {
    	var t = ['Msxml2.XMLHTTP','Microsoft.XMLHTTP'],i = 0;
    	while(!xhr_object&&t[i++])
    		try {xhr_object = new ActiveXObject(t[i]);}catch(e){}
    }
	if(!xhr_object)
		return null;
	var ref = this, v = "", j = 0;
	for(i in pParams)
		v += (j++>0?"&":"")+i+"="+pParams[i];
	xhr_object.open("POST", pTarget, true);
	xhr_object.onreadystatechange=function()
	{
		if(xhr_object.readyState==4)
		{
			switch(xhr_object.status)
			{
				case 304:
				case 200:
					var ct = xhr_object.getResponseHeader("Content-type");
					if(ct.indexOf("json")>-1)
						eval("xhr_object.responseJSON = "+xhr_object.responseText+";");
					if(ref.onCompleteHandler)
						ref.onCompleteHandler(xhr_object);
				break;
				case 403:
				case 404:
				case 500:
					if(ref.onErrorHandler)
						ref.onErrorHandler(xhr_object.responseText);
				break;
			}
		}
	};
	
	xhr_object.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset:ISO-8859-1');
	xhr_object.send(v);
	return this;
}
Class.extend(Request, [Class], {
	onComplete:function(pFunction)
	{
		this.onCompleteHandler = pFunction;
		return this;
	},
	onError:function(pFunction)
	{
		this.onErrorHandler = pFunction;
		return this;
	}
});
Request.load = function (pUrl, pParams){return new Request(pUrl, pParams);};
Request.update = function(pId, pUrl, pParams){return Request.load(pUrl, pParams).onComplete(function(pResponse){document.getElementById(pId).innerHTML = pResponse.responseText;});};


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
		this.addEventListener(Event.START, M4.proxy(this, this.loadNext));
	},
	loadNext:function()
	{
		if(++this.__current==this.__stack.length)
		{
			this.dispatchEvent(new Event(Event.COMPLETE, false));
			return;
		}
		var f = this.__stack[this.__current].file, id = this.__stack[this.__current].id, l, ref = this;
		this.dispatchEvent(new Event(MassLoader.NEXT, false));
		var type = f.split(".");
		type = type[type.length-1];
		var onLoadCallBack = "onload", onErrorCallBack = "onerror";
		switch(type.toLowerCase())
		{
			case "mp3":
			case "ogg":
				l = new Audio();
				l.addEventListener("loadeddata", M4.proxy(this, this.loadNext), false);
				l.autoplay = false;
				l.preload = true;
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
		l.onload = M4.proxy(this, this.loadNext);
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
Class.define(JSLoader, [MassLoader], null);

function Color(){}
Color.HexaToRGB = function(pValue){return (new HexaColor(pValue)).toRGB();};
Color.RGBToHexa = function(pR, pG, pB){return (new RGBColor(pR, pG, pB)).toHexa();};
function HexaColor(pValue)
{
	if(pValue.indexOf("#")>-1)
		pValue = pValue.replace("#", "");
	this.value = parseInt(pValue,16);
}
HexaColor.prototype.toRGB = function(){return new RGBColor((this.value&parseInt("FF0000", 16))>>16, (this.value&parseInt("00FF00", 16))>>8,(this.value&parseInt("0000FF", 16)));};
HexaColor.prototype.toString = function(){return "#"+this.value.toString(16);};
function RGBColor(pR, pG, pB)
{
	this.r = pR||0;
	this.g = pG||0;
	this.b = pB||0;
}
RGBColor.prototype.toHexa = function(){return new HexaColor("#"+((this.r<<16)|(this.g<<8)|(this.b)).toString(16));};
RGBColor.prototype.toString = function(){return "rgb("+this.r+", "+this.g+", "+this.b+")";};