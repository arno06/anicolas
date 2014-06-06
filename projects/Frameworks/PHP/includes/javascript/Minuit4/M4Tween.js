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


Object.keys = Object.keys || (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !{toString:null}.propertyIsEnumerable("toString"),
        DontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
        ],
        DontEnumsLength = DontEnums.length;

    return function (o) {
        if (typeof o != "object" && typeof o != "function" || o === null)
            throw new TypeError("Object.keys called on a non-object");

        var result = [];
        for (var name in o) {
            if (hasOwnProperty.call(o, name))
                result.push(name);
        }

        if (hasDontEnumBug) {
            for (var i = 0; i < DontEnumsLength; i++) {
                if (hasOwnProperty.call(o, DontEnums[i]))
                    result.push(DontEnums[i]);
            }
        }

        return result;
    };
})();

/**
 * M4Tween - Javascript animation library
 * Copyright (C) 2009 - 2012  NICOLAS Arnaud <arno06@gmail.com> - http://www.minuit4.fr/
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

function M4Tween(){this.next = null; this.prev = null; this.nextInPool = null;}

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
		if(typeof(this.startHandler)=="function")
			this.startHandler();
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
			if(this.next)
				this.next.prev = null;
			M4Tween.first = this.next;
		}
		if(this.prev)
			this.prev.next = this.next;
		if(this.next)
			this.next.prev = this.prev;
		this.next = this.prev = this.firstInfos = this.waiting = null;
		this.nextInPool = M4Tween.current;
		M4Tween.current = this;
		M4Tween.available++;
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
	M4Tween.available--;
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
M4Tween.available = 0;
M4Tween.current = null;
M4Tween.first = null;
M4Tween.running = 0;
M4Tween.useStyle = true;

M4Tween.step = function()
{
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
	if(M4Tween.available>0)
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
	M4Tween.available = pNumber;
};

M4Tween.killTweensOf = function (pTarget, pComplete)
{
	var i = M4Tween.first, n;
	while(i)
	{
		n = i.next;
		if(i.target == pTarget)
			i.kill(pComplete);
		i = n;
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