/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * http://code.google.com/p/anicolas/
 * ScrollAnimator.js
 */
var ScrollAnimator =
{
	elements:[],
	callBacks:{},
	add:function(pSelector)
	{
		var el = new SEl(pSelector);
		ScrollAnimator.elements.push(el);
		return el;
	},
	observe:function(pValue, pCallBack)
	{
		var prop = "value_"+pValue;
		if(!ScrollAnimator.callBacks[prop])
			ScrollAnimator.callBacks[prop] = {value:pValue, handlers:[], triggered:false};
		ScrollAnimator.callBacks[prop].handlers.push(pCallBack);
	},
	register:function()
	{
		window.addEventListener("scroll", ScrollAnimator._animateHandler, false);
		ScrollAnimator._animateHandler();
	},
	follow:function(pSelector)
	{
		var element = document.querySelector(pSelector);
		M4.createElement("div", {parentNode:element,text:"Inpector", class:"insp", style:{position:"absolute", "marginTop":0, "marginLeft":0, "zIndex":999}});
	},
	_animateHandler:function()
	{
		var c, info, el, prop, diff;
		for(var i = 0, max = ScrollAnimator.elements.length;i<max;i++)
		{
			info = ScrollAnimator.elements[i];
			info.from = info.from||0;
			c = Math.max(0, Math.min(1, (window.scrollY-info.from)/(info.to-info.from)));
			if(info.to == 0)
				c = 1;
			el = document.querySelector(info.selector);
			if(!el)
				continue;
			for(var k = 0, maxk = info.props.length;k<maxk;k++)
			{
				prop = info.props[k];
				diff = prop.to - prop.from;
				el.style[prop.name] = (prop.from + (diff * c))+prop.unit;
			}
		}

		for(i in ScrollAnimator.callBacks)
		{
			info = ScrollAnimator.callBacks[i];
			if(info.value > window.scrollY)
			{
				info.triggered = false;
				continue;
			}
			if(info.triggered)
				continue;
			info.triggered = true;
			for(k = 0, max = info.handlers.length; k<max; k++)
				info.handlers[k]();
		}

		var inspector = document.querySelectorAll(".insp");
		inspector.forEach(function(element)
		{
			var p = element.parentNode;
			element.innerHTML = Scroll.offsetTop(p)+"px";
		});
	}
};
function SEl(pSelector)
{
	this.selector = pSelector;
	this.from = 0;
	this.to = 0;
	this.props = [];
}
SEl.prototype =
{
	animateFrom:function(pValue){this.from = pValue;return this;},
	animateTo:function(pValue){this.to = pValue;return this;},
	addProp:function(pName, pUnit, pFrom, pTo){this.props.push(new SProp(pName, pUnit, pFrom, pTo));return this;}
};
function SProp(pName, pUnit, pFrom, pTo)
{
	this.name = pName;
	this.unit = pUnit||"";
	this.from = pFrom||0;
	this.to = pTo||0;
}