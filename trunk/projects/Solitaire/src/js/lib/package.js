// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame   ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback){
			window.setTimeout(callback, 1000 / 60);
		};
})();

/**
 * M4Tween - Javascript animation library
 * Copyright (C) 2009 - 2013  NICOLAS Arnaud <arno06@gmail.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
if(!window["M4"]) var M4 ={};
M4.browser = (function()
{
	var ua = navigator.userAgent;
	return {
		IE:ua.indexOf("MSIE")>-1,
		FF:ua.indexOf("Firefox")>-1,
		CHROME:ua.indexOf("Chrome")>-1,
		SAFARI:ua.indexOf("AppleWebKit")>-1&&ua.indexOf("Chrome")===-1
	};
})();

function M4Tween(){this.configure(null, null, 0, null, 0, null);}

M4Tween.prototype =
{
	configure:function (pTarget, pFirstInfos, pDuration, pEase, pDelay, pStyle)
	{
		this.startHandler = null;
		this.updateHandler = null;
		this.completeHandler = null;
		this.startTime = null;
		this.delay = pDelay;
		this.target = pTarget;
		this.context = pStyle?this.target.style:this.target;
		this.useStyle = pStyle;
		this.firstInfos = pFirstInfos;
		this.durationTime = pDuration;
		this.ease = pEase;
	},
	start:function()
	{
		this.waiting = null;
		this.startTime = new Date().getTime();
		var f = this.firstInfos, t = this.target;
		if(this.useStyle)
		{
			if(document&&document.defaultView&&document.defaultView.getComputedStyle)
				t = document.defaultView.getComputedStyle(this.target, null);
			else if (this.target.currentStyle)
				t = this.target.currentStyle;
			else
				t = this.target.style;
		}
		while(f)
		{
			f.extractStartValue(t, this.useStyle);
			f = f.next;
		}
		if(this.startHandler)
		{
			this.startHandler();
		}
	},
	update:function(pDt)
	{
		var timer, t, factor, i;
		timer = (pDt - this.startTime) * .001;
		t = (timer<this.durationTime);
		factor = t? this.ease(timer, 0, 1, this.durationTime ):1;
		i = this.firstInfos;
		while(i)
		{
			this.context[i.property] = i.update(factor);
			i = i.next;
		}
		if(typeof(this.updateHandler)=="function")
			this.updateHandler(this.context);
		if(!t)
			this.kill(true);
	},
	kill:function(pTrigger)
	{
		if(pTrigger !== true)
			this.completeHandler = null;

		if(this==M4Tween.first)
		{
			M4Tween.first = this.next;
			if(M4Tween.first)
				M4Tween.first.prev = null;
		}
		if(this.prev)
			this.prev.next = this.next;
		if(this.next)
			this.next.prev = this.prev;

		M4Tween.GC.push(this);
		if(typeof(this.completeHandler) == "function")
			this.completeHandler(this.target);
	},
	onComplete:function(pHandler){this.completeHandler = pHandler;return this;},
	onStart:function(pHandler){this.startHandler = pHandler;return this;},
	onUpdate:function (pHandler){this.updateHandler = pHandler;return this;},
	then:function(pTarget, pTime, pProperty)
	{
		if(!pProperty.delay)
			pProperty.delay = 0;
		pProperty.delay += this.delay + this.durationTime;
		return M4Tween.to(pTarget, pTime, pProperty);
	}
};
M4Tween.to = function(pTarget, pTime, pProperty)
{
	if(!pTarget)
		return;
	var a, ease = Quad.easeInOut,firstInfos,tmp = {}, property, style, delay = 0, k, key = Object.keys(pProperty);
	style = typeof(pProperty.useStyle)!="undefined"?pProperty.useStyle:M4Tween.useStyle;
	for(var i = 0, max = key.length;i<max;i++)
	{
		property = key[i];
		k = pProperty[property];
		switch(property)
		{
			case "ease":
				ease = k;
				continue;
			break;
			case "delay":
				delay = Number(k);
				continue;
			break;
			case "useStyle":
				continue;
			break;
		}
		if(typeof(M4TweenPlugins[property])=="undefined")
			property = "defaultProp";
		if(typeof(M4TweenPlugins[property])!="object")
			continue;
		a = M4TweenPlugins[property].newInfos(key[i], k, style);
		a.extractStartValue = M4TweenPlugins[property].extractStartValue;
		if(!firstInfos)
			firstInfos = a;
		else
			tmp.next = a;
		tmp = a;
	}

	M4Tween.initPool();
	var instance = M4Tween.current;
	M4Tween.current = instance.nextInPool;
	instance.nextInPool = null;
	instance.configure(pTarget, firstInfos, pTime, ease, delay, style);
	if(delay)
		instance.waiting = (new Date()).getTime()+(delay * 1000);
	else
		instance.start();


	if(M4Tween.first)
	{
		M4Tween.first.prev = instance;
		instance.next = M4Tween.first;
	}
	M4Tween.first = instance;
	if(!M4Tween.running)
		M4Tween.running = window.requestAnimFrame(M4Tween.step);
	return instance;
};

M4Tween.TIME = Math.round(1000/60);
M4Tween.GROWTH_RATE = 2000;
M4Tween.current = null;
M4Tween.first = null;
M4Tween.running = 0;
M4Tween.useStyle = true;
M4Tween.GC = [];

M4Tween.step = function()
{
	while(M4Tween.GC.length)
	{
		t = M4Tween.GC.shift();
		t.next = t.prev = t.firstInfos = t.waiting = null;
		t.nextInPool = M4Tween.current;
		M4Tween.current = t;
	}
	M4Tween.GC = [];
	var i = M4Tween.first;
	if(!i)
	{
		M4Tween.running = 0;
		return;
	}
	var t = new Date().getTime();
	while(i)
	{
		if(i.waiting != null && i.waiting <= t)
			i.start();
		if(i.waiting==null)
			i.update(t);
		i = i.next;
	}
	M4Tween.running = window.requestAnimFrame(M4Tween.step);
};

M4Tween.initPool = function (pNumber)
{
	if(M4Tween.current)
		return;
	if(!pNumber)
		pNumber = M4Tween.GROWTH_RATE;
	var e, i = pNumber;
	while(i--)
	{
		e = new M4Tween();
		e.nextInPool = M4Tween.current;
		M4Tween.current = e;
	}
};

M4Tween.killTweensOf = function (pTarget, pComplete)
{
	var i = M4Tween.first;
	while(i)
	{
		if(i.target == pTarget)
			i.kill(pComplete);
		i = i.next;
	}
};

function M4TweenInfos(pProperty, pFinalValue, pType, pTemplateValue)
{
	this.extractStartValue = null; this.startValue = null; this.distanceValue = null;
	this.property = pProperty;
	this.finalValue = Number(pFinalValue);
	this.type = pType;
	this.templateValue = pTemplateValue;
}
M4TweenInfos.prototype=
{
	update:function(pFactor)
	{
		var v = (this.startValue + ( pFactor * this.distanceValue))+""+this.type;
		return !this.templateValue?v:this.templateValue.replace(/#value#/, v);
	},
	setStartValue:function(pValue)
	{
		this.startValue = Number(pValue);
		this.distanceValue = this.finalValue - this.startValue;
	}
};

function M4TweenColorInfos(pProperty, pFinalValue)
{
	this.extractStartValue = null; this.startValue = null;
	this.property = pProperty;
	this.finalValue = Number(pFinalValue);
	this.r = new M4TweenInfos("r",((this.finalValue&parseInt("FF0000", 16))>>16), null,null);
	this.g = new M4TweenInfos("g",((this.finalValue&parseInt("00FF00", 16))>>8), null,null);
	this.b = new M4TweenInfos("b",(this.finalValue&parseInt("0000FF", 16)), null,null);
}
M4TweenColorInfos.prototype =
{
	update:function (pFactor)
	{
		var r = Math.round(this.r.startValue+ (pFactor * this.r.distanceValue));
		var g = Math.round(this.g.startValue+ (pFactor * this.g.distanceValue));
		var b = Math.round(this.b.startValue+ (pFactor * this.b.distanceValue));
		return "rgb("+r+", "+g+", "+b+")";
	},
	setStartValue:function(pValue)
	{
		this.startValue = Number(pValue);
		this.r.setStartValue((this.startValue&parseInt("FF0000", 16))>>16);
		this.g.setStartValue((this.startValue&parseInt("00FF00", 16))>>8);
		this.b.setStartValue(this.startValue&parseInt("0000FF", 16));
	}
};

if(typeof(M4TweenPlugins)=="undefined")
	function M4TweenPlugins(){}

M4TweenPlugins.color =
{
	extractStartValue:function(pCtx)
	{
		var t;
		if(t = pCtx[this.property].match(/rgb\(([0-9]+),\s*([0-9]+),\s*([0-9]+)\)/i))
			this.setStartValue(t[1]<<16|t[2]<<8|t[3]);
		else if(t = pCtx[this.property].match(/#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i))
			this.setStartValue(parseInt(t[1],16)<<16|parseInt(t[2],16)<<8|parseInt(t[3],16));
	},
	newInfos:function(pProperty, pFinalValue)
	{
		return new M4TweenColorInfos(pProperty, parseInt(pFinalValue.replace("#", ""), 16));
	}
};

M4TweenPlugins.backgroundColor = {};
for(var i in M4TweenPlugins.color)
{
	if(M4TweenPlugins.color.hasOwnProperty(i))
		M4TweenPlugins.backgroundColor[i] = M4TweenPlugins.color[i];
}

M4TweenPlugins.opacity =
{
	extractStartValue:function(pCtx, pStyle)
	{
		var s = pCtx[this.property];
		if(pStyle && M4.browser.IE && (!document["documentMode"] || document["documentMode"] < 9))
		{
			try
			{
				s = s.replace(/alpha\(opacity=/,"");
				s = s.replace(/\)/,"");
				s = s!=""?s:100;
			}
			catch(ex){s = 100;}
		}
		this.setStartValue(s);
	},
	newInfos:function(pProperty, pFinalValue, pStyle)
	{
		var prop = "opacity", template;
		if(pStyle && M4.browser.IE && (!document["documentMode"] || document["documentMode"] < 9))
		{
			pFinalValue *= 100;
			prop = "filter";
			template = "alpha(opacity=#value#)";
		}
		return new M4TweenInfos(prop, pFinalValue, "", template);
	}
};

M4TweenPlugins.defaultProp =
{
	extractStartValue:function(pCtx)
	{
		this.setStartValue(String(pCtx[this.property]).replace(/(px|%)/,""));
	},
	newInfos:function(pProperty, pFinalValue)
	{
		var s = String(pFinalValue), type = "",
		p = s.search(/(px|%)/);
		if(p>-1)
			type = s.substr(p);
		return new M4TweenInfos(pProperty, s.replace(/(px|%)/,""), type, null);
	}
};

M4TweenPlugins.rotate =
{
	extractStartValue:function(pCtx)
	{
		var v = pCtx[this.property], t;
		if(v)
		{
			if(v.indexOf("matrix")>-1)
			{
				t = v.match(/matrix\(([0-9\-\.e]+),\s*([0-9\-\.e]+),\s*([0-9\-\.e]+),\s*([0-9\-\.e]+),\s*([0-9\-\.epx]+),\s*([0-9\-\.epx]+)\)/i);
				var c = Number(t[1]);
				var s = Number(t[2]);
				v = Math.atan2(s, c) * (180/Math.PI);
				if(v<0)
					v = 360 - v;

			}
			else
			{
				v = v.replace(/rotate\(/, "");
				v = v.replace(/deg\)/, "");
				v = v=="none"?0:v;
			}
		}
		else
			v = 0;
		this.setStartValue(v);
	},
	newInfos:function(pProperty, pFinalValue)
	{
		var s = String(pFinalValue), p, tpl = "rotate(#value#)", t = "deg";
		if((p=s.search(/deg/))>-1)
			s = s.replace(/deg/, "");
		if(M4.browser.IE)
			p = "msTransform";
		else if (M4.browser.CHROME||M4.browser.SAFARI)
			p = "WebkitTransform";
		else if (M4.browser.FF)
			p = "MozTransform";
		return new M4TweenInfos(p, s, t, tpl);
	}
};

M4Tween.from = function(pStartValue)
{
	return new M4Tween.Dummy(pStartValue);
};
M4Tween.Dummy = function(pStartValue)
{
	this.target = {value:pStartValue};
};
M4Tween.Dummy.prototype =
{
	to:function(pEndValue)
	{
		this.endValue = pEndValue;
		return this;
	},
	start:function(pDuration, pOptions)
	{
		pDuration = pDuration||1;
		pOptions = pOptions || {};
		pOptions.value = this.endValue;
		pOptions.useStyle = false;
		return M4Tween.to(this.target, pDuration, pOptions);
	}
};

/**Easing Equations by Robert Penner (http://www.robertpenner.com/easing/ - BSD License)**/
function Linear(){}
Linear.easeNone = function(t, b, c, d){return (c*t/d) + b;};
function Back(){}
Back.easeIn = function (t, b, c, d, s){if(!s){s=1.70158;}return c*(t/=d)*t*((s+1)*t - s) + b;};
Back.easeOut = function (t, b, c, d, s){if(!s){s=1.70158;}return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;};
Back.easeInOut = function (t, b, c, d, s){if(!s){s=1.70158;}if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;};
function Bounce(){}
Bounce.easeOut = function(t, b, c, d) {if ((t/=d) < (1/2.75)) {return c*(7.5625*t*t) + b;}else if (t < (2/2.75)) {return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;}else if (t < (2.5/2.75)) {return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;} else {return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;}};
Bounce.easeIn = function(t, b, c, d){return c - Bounce.easeOut(d-t, 0, c, d) + b;};
Bounce.easeInOut = function (t, b, c, d){if (t < d/2) return Bounce.easeIn (t*2, 0, c, d) * .5 + b;else return Bounce.easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;};
function Quad(){}
Quad.easeIn = function (t, b, c, d) {return c*(t/=d)*t + b;};
Quad.easeOut = function (t, b, c, d){return -c *(t/=d)*(t-2) + b;};
Quad.easeInOut = function (t, b, c, d){if ((t/=d/2) < 1) return c/2*t*t + b;return -c/2 * ((--t)*(t-2) - 1) + b;};
function Circ(){}
Circ.easeIn = function (t, b, c, d){return ((-c * (Math.sqrt(1 - (t/=d)*t) - 1)) + b);};
Circ.easeOut = function (t, b, c, d) {return ((c * Math.sqrt(1 - (t=t/d-1)*t)) + b);};
Circ.easeInOut = function (t, b, c, d){if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;};
function Elastic(){}
Elastic.easeOut = function (t, b, c, d, a, p) {var s;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; s = p/4; }else s = p/(Math.PI*2) * Math.asin (c/a);return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(Math.PI*2)/p ) + c + b);};
Elastic.easeInOut = function (t, b, c, d, a, p){var s;if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5); if (!a || a < Math.abs(c)) { a=c; s = p/4; }else s = p/(Math.PI*2) * Math.asin (c/a); if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(Math.PI*2)/p )) + b; return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(Math.PI*2)/p )*.5 + c + b;};
Elastic.easeIn = function (t, b, c, d, a, p){var s;if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;if (!a || a < Math.abs(c)) { a=c; s = p/4; }else s = p/(Math.PI*2) * Math.asin (c/a);return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(Math.PI*2)/p )) + b;};
/**
 * Utilities
 */
NodeList.prototype.forEach = Array.prototype.forEach;

String.prototype.html_entity_decode = function()
{
	var d = M4.createElement("div", {htmlText:this.toString()});
	return d.firstChild.nodeValue;
};

Function.prototype.proxy = function(pInstance)
{
	var ref = this;
	return function(){ref.apply(pInstance, arguments);};
};

Object.prototype.clone = function()
{
	var obj = {};
	for(var i in this)
	{
		if(!this.hasOwnProperty(i))
			continue;
		obj[i] = this[i];
	}
	return obj;
};


/**
 * Base Class
 * Overriding - toString - whatever
 */
function Class(){}

Class.prototype = {
	super:function(pMethodName)
	{
		pMethodName = pMethodName||"constructor";
		if(!this.__SUPER__||!this.__SUPER__[pMethodName])
			throw new Error("Method '"+pMethodName+"' undefined");
		var args = [];
		for(var i = 1, max = arguments.length;i<max;i++)
			args.push(arguments[i]);
		var func;
		if(this[pMethodName]&&this[pMethodName]==this.__SUPER__[pMethodName])
			func = this.__SUPER__.__SUPER__[pMethodName].proxy(this);
		else
			func = this.__SUPER__[pMethodName].proxy(this);
		return func.apply(this, args);
	},
	toString : function()
	{
		return this.formatToString();
	},
	formatToString : function()
	{
		var t = /^function ([a-z][a-z0-9_]*)\(/i.exec(this.constructor.toString());
		var s = "[Object "+t[1];
		for(var i=0, max = arguments.length;i<max;i++)
			s+= " "+arguments[i]+"=\""+this[arguments[i]]+"\"";
		return s+"]";
	}
};

Class.extend = function(pTarget, pClassParent)
{
	for(var i in pClassParent.prototype)
	{
		pTarget.prototype[i] = pClassParent.prototype[i];
	}
	pTarget.prototype.__SUPER__ = pClassParent.prototype;
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
function Event(pType, pBubbles)
{
	this.type = pType;
	this.bubbles = pBubbles||false;
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


function MouseEvent(pType, pBubbles, pMouseX, pMouseY, pButton)
{
	this.type = pType;
	this.localX = pMouseX||0;
	this.localY = pMouseY||0;
	this.button = pButton||0;
	this.super("constructor", pType, pBubbles);
}
Class.define(MouseEvent, [Event], {
	localX:0,
	localY:0,
	button:0
});
MouseEvent.MOUSE_OVER = "mouse_over";
MouseEvent.MOUSE_OUT = "mouse_out";
MouseEvent.MOUSE_DOWN = "mouse_down";
MouseEvent.MOUSE_UP = "mouse_up";
MouseEvent.CLICK = "click";
MouseEvent.LEFT_BUTTON = 0;
MouseEvent.RIGHT_BUTTON = 2;
function EventDispatcher()
{
	this.removeAllEventListener();
}

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
		pType = pType||false;
		if(pType===false)
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
						if(this.__listeners[pEvent.type]&&this.__listeners[pEvent.type][i])
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
function Request(pTarget, pParams, pMethod)
{
	this.removeAllEventListener();
	pMethod = (pMethod||"get").toUpperCase();
	this.xhr_object = null;
    if (window.XMLHttpRequest)
	    this.xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject)
    {
    	var t = ['Msxml2.XMLHTTP','Microsoft.XMLHTTP'],i = 0;
    	while(!this.xhr_object&&t[i++])
    		try {this.xhr_object = new ActiveXObject(t[i]);}catch(e){}
    }
	if(!this.xhr_object)
		return;
	var ref = this, v = "", j = 0;
	for(i in pParams)
		v += (j++>0?"&":"")+i+"="+pParams[i];
	this.xhr_object.open(pMethod, pTarget, true);
	this.xhr_object.onprogress = this.dispatchEvent.proxy(this);
	this.xhr_object.onreadystatechange=function()
	{
		if(ref.xhr_object.readyState==4)
		{
			switch(ref.xhr_object.status)
			{
				case 304:
				case 200:
					var ct = ref.xhr_object.getResponseHeader("Content-type");
					if(ct.indexOf("json")>-1)
						eval("ref.xhr_object.responseJSON = "+ref.xhr_object.responseText+";");
					ref.dispatchEvent(new RequestEvent(Event.COMPLETE, ref.xhr_object.responseText, ref.xhr_object.responseJSON));
				break;
				case 403:
				case 404:
				case 500:
					ref.dispatchEvent(new RequestEvent(RequestEvent.ERROR));
				break;
			}
		}
	};

	this.xhr_object.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset:'+Request.CHARSET);
	try
	{
		this.xhr_object.send(v);
	}
	catch(e)
	{
		console.log(e);
	}
}
Class.define(Request, [EventDispatcher],
{
	onComplete:function(pFunction)
	{
		this.addEventListener(Event.COMPLETE, pFunction, false);
		return this;
	},
	onProgress:function(pFunction)
	{
		this.addEventListener(RequestEvent.PROGRESS, pFunction, false);
		return this;
	},
	onError:function(pFunction)
	{
		this.addEventListener(RequestEvent.ERROR, pFunction, false);
		return this;
	},
	cancel:function()
	{
		this.dispatchEvent(new Event(RequestEvent.CANCEL));
		this.xhr_object.abort();
	}
});
Request.CHARSET = "UTF-8";
Request.load = function (pUrl, pParams, pMethod){return new Request(pUrl, pParams, pMethod);};
Request.update = function(pId, pUrl, pParams){return Request.load(pUrl, pParams).onComplete(function(pResponse){document.getElementById(pId).innerHTML = pResponse.responseText;});};

function RequestEvent(pType, pResponseText, pResponseJSON, pBubble)
{
	this.super("constructor", pType, pBubble);
	this.responseText = pResponseText||"";
	this.responseJSON = pResponseJSON||{};
}

Class.define(RequestEvent, [Event], {});
RequestEvent.ERROR = "error";
RequestEvent.CANCEL = "cancel";
RequestEvent.PROGRESS = "progress";
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
