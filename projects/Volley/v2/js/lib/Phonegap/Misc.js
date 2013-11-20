
var Global =
{
	clickEvent:(function(){return ("ontouchend" in document)?"touchend":"mousedown";})(),
	downEvent:(function(){return ("ontouchend" in document)?"touchstart":"mousedown";})(),
	upEvent:(function(){return ("ontouchend" in document)?"touchend":"mouseup";})(),
	moveEvent:(function(){return ("ontouchend" in document)?"touchmove":"mousedown";})(),
	toggleHandler:function(e){e.currentTarget.parentNode.classList.toggle("close");},
	transitionEndEvent:(function(){
		var t = {
			"transition":"transitionend",
			"WebkitTransition":"webkitTransitionEnd",
			"MozTransition":"transitionend"
		};
		for(var i in t)
		{
			if(document.body.style[i] !== undefined)
				return t[i];
		}
		return "transitionend"
	})()
};

var CSS3 =
{
	onComplete:function(pSelector, pHandler)
	{
		var element = (typeof pSelector == "string")?document.querySelector(pSelector):pSelector;
		var completeHandler = function()
		{
			element.removeEventListener(Global.transitionEndEvent, completeHandler);
			pHandler();
		};
		element.addEventListener(Global.transitionEndEvent, completeHandler, false);
	}
};


var Helper =
{
	init:function()
	{
		Helper.handleFontSize();
		window.addEventListener("resize", Helper.handleFontSize, false);
	},
	handleFontSize:function()
	{
		var optimalLineHeight = 40;
		var extraAccounting = 12;
		var minTextHeight = 12;
		var w = document.body.clientWidth;
		var optimalSize = Math.max((w/(optimalLineHeight+extraAccounting)), minTextHeight);

		console.log(optimalSize);

		document.body.style.fontSize = Math.round(optimalSize)+"px";
	},
	handleDeleteButton:function(pSelector)
	{
		Helper.handlerMouseEvents(pSelector);
		var localHandler = function(e)
		{
			var t = e.target.parentNode.parentNode|| e.target;
			document.querySelectorAll(pSelector+".confirm").forEach(function(pEl)
			{
				if(pEl == t)
					return;
				pEl.classList.remove("confirm");
				pEl.classList.remove("confirmed");
			});
			document.removeEventListener(Global.clickEvent, localHandler, true);
		};
		document.querySelectorAll(pSelector).forEach(function(pEl)
		{
			pEl.addEventListener(Global.clickEvent, function(e)
			{
				var t = e.currentTarget;
				if(!t.classList.contains("confirm"))
				{
					document.addEventListener(Global.clickEvent, localHandler, true);
					t.classList.add("confirm");
				}
				else
				{
					t.classList.add("confirmed");
				}
			}, false);
		});
	},
	handlerMouseEvents:function(pSelector)
	{
		document.querySelectorAll(pSelector).forEach(function(pElement)
		{
			var handler = function(e)
			{
				var p = {x:e.pageX, y:e.pageY};
				var t = e.currentTarget;
				var todo;
				switch(e.type.toLowerCase())
				{
					case Global.downEvent:
						if(e.type.toLowerCase().indexOf("touch")>-1)
							p = {x: e.touches[0].pageX, y: e.touches[0].pageY};
						t.setAttribute("mouse-start", p.x+","+ p.y);
						t.setAttribute("mouse-end", p.x+","+ p.y);
						todo = "add";
						break;
					case Global.upEvent:
						var start = t.getAttribute("mouse-start").split(",");
						var last = t.getAttribute("mouse-end").split(",");
						var distanceX = (last[0] - start[0]);
						var distanceY = (last[1] - start[1]);
						var distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
						if(distance>5)
						{
							e.stopImmediatePropagation();
							e.stopPropagation();
						}
						todo = "remove";
						break;
					case Global.moveEvent:
					default:
						if(e.type.toLowerCase().indexOf("touch")>-1)
							p = {x: e.touches[0].pageX, y: e.touches[0].pageY};
						t.setAttribute("mouse-end", p.x+","+ p.y);
						todo = "remove";
						break;
				}
				t.classList[todo]("active");
			};
			pElement.addEventListener(Global.downEvent, handler);
			pElement.addEventListener(Global.moveEvent, handler);
			pElement.addEventListener(Global.upEvent, handler);
		});
	},
	handleMenuBehaviorOnTable:function(pSelector)
	{
		var elements = document.querySelectorAll(pSelector);
		Helper.handlerMouseEvents(pSelector);
		var handler = function(e)
		{
			elements.forEach(function(pEl)
			{
				if(pEl.classList.contains("current"))
					pEl.classList.remove("current");
			});
			e.currentTarget.classList.add("current");
		};

		elements.forEach(function(pEl)
		{
			pEl.addEventListener(Global.clickEvent, handler, false);
		});
	},
	fadeIn:function(pElement, pDuration, pOnComplete)
	{
		var callback = function()
		{
			if(pOnComplete)
				pOnComplete();
		};
		pElement.style.display = "block";
		M4Tween.killTweensOf(pElement);
		M4Tween.to(pElement, pDuration, {opacity:1}).onComplete(callback);
	},
	fadeOut:function(pElement, pDuration, pOnComplete)
	{
		var callback = function()
		{
			if(pOnComplete)
				pOnComplete();
			pElement.style.display = "none";
		};
		M4Tween.killTweensOf(pElement);
		M4Tween.to(pElement, pDuration, {opacity:0}).onComplete(callback);

	}
};

window.addEventListener("load", Helper.init, false);

var LocalFile =
{
	retrieve:function(pFile, pHandler, pFail, pJson)
	{
		pHandler = pHandler||null;
		pFail = pFail||null;
		pJson = pJson||false;
		var xhr = new XMLHttpRequest();
		var exists = false;
		xhr.onreadystatechange=function()
		{
			if(xhr.readyState === 2 || xhr.readyState===3)
				exists = true;
			if ((xhr.readyState===4&&!exists))
			{
				xhr.onreadystatechange = null;
				if(pFail)
					pFail();
			}
			else if (xhr.readyState==4&&exists)
			{
				var d = xhr.responseText;
				if(pJson)
					d = JSON.parse(d);
				if(pHandler)
					pHandler(d);
			}
		};

		xhr.open("GET", pFile, true);
		xhr.send();
	}
};

function Form()
{
	this.inputs = {};
	this.values = {};
}

Class.define(Form, [Class],
{
	setInputs:function(pInputs)
	{
		this.inputs = pInputs;
	},
	isValid:function()
	{
		var type, value, min, max;
		for(var i in this.inputs)
		{
			if(!this.inputs.hasOwnProperty(i))
				continue;

			var inp = document.querySelector('input[name="'+this.inputs[i]+'"]');

			if(!inp)
			{
				console.log("Form.isValid : "+i);
				continue;
			}

			type = inp.getAttribute("type");

			switch(type)
			{
				case "number":
					value = inp.value;
					if(!Form.REGEXP_NUMBER.exec(value))
					{
						inp.setAttribute("value","");
						value = "";
					}
					else
						value = Number(value);
					break;
				case "radio":
					inp = document.querySelector('input[name="'+this.inputs[i]+'"]:checked');
					value = inp&&inp.value?inp.value:"";
					break;
				case "range":
					value = inp.value;
					min = Number(inp.getAttribute("min"));
					max = Number(inp.getAttribute("max"));
					if(!Form.REGEXP_NUMBER.exec(value))
					{
						inp.setAttribute("value","");
						value = "";
					}
					value = Math.max(value, min);
					value = Math.min(value, max);
					break;
				default :
						continue;
			}
			this.values[i] = value;
		}

		return true;
	},
	getError:function()
	{

	},
	getValues:function()
	{
		return this.values;
	}
});

Form.REGEXP_NUMBER = /^[0-9]+\.*[0-9]*$/;