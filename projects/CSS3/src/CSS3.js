function CSS3(){}

CSS3.Tween =
{
	infos:(function()
	{
		var d = document.createElement("div");
		var transitions =
		{
			'transition':'transitionEnd',
			'MSTransition':'msTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

		for(var t in transitions)
		{
		   if(d.style[t] !== undefined )
		   {
				return {
					"onCompleteEvent":transitions[t],
					"property":t
				};
		   }
		 }
	})(),
	css:
	{
		_declarations:{},
		update:function()
		{
			var style = document.querySelector("#"+CSS3.Tween.TAG_ID);
			if(!style)
			{
				style = document.createElement("style");
				style.setAttribute("type", "text/css");
				style.setAttribute("id", CSS3.Tween.TAG_ID);
				document.getElementsByTagName('head')[0].appendChild(style);
			}

			var s = "";
			var key = Object.keys(CSS3.Tween.css._declarations);
			for(var i = 0, max = key.length;i<max;i++)
				s += "."+key[i]+"{"+CSS3.Tween.css._declarations[key[i]]+"}";
			style.innerHTML = s;
		},
		add:function(pName, pValue)
		{
			CSS3.Tween.css._declarations[pName] = pValue;
			CSS3.Tween.css.update();
		},
		remove:function(pName)
		{
			CSS3.Tween.css._declarations[pName] = null;
			delete(CSS3.Tween.css._declarations[pName]);
			CSS3.Tween.css.update();
		}
	},
	TAG_ID:"css3_tween_style",
	killTweensOf:function(pSelector)
	{
		var elements = document.querySelectorAll(pSelector);

		elements.forEach(function(element)
		{
			var className = element.getAttribute("class");
			var classes = className.split(" ");
			for(var i = 0, max = classes.length; i<max;i++)
			{
				var style = window.getComputedStyle(element);
				if(CSS3.Tween.css._declarations[classes[i]])
				{
					var props = CSS3.Tween.css._declarations[classes[i]].split("; ");
					for(var k = 0, maxk = props.length;k<maxk;k++)
					{
						var prop = props[k].split(": ");
						element.style[prop[0]] = style[prop[0]];
					}
					element.classList.remove(classes[i]);
				}
			}
			if(element.css3TweenCallback)
				element.removeEventListener(CSS3.Tween.infos.onCompleteEvent, element.css3TweenCallback);
		});
	},
	to:function(pSelector, pDuration, pProperty, pName)
	{
		var t = new Date().getTime();
		var elements = document.querySelectorAll(pSelector);
		if(!elements.length)
			return;
		pName = pName||'css3_tween_'+t;
		var css = CSS3.Tween.infos.property;
		var key = Object.keys(pProperty);
		var cssValue = [];
		var endValue = [];
		var completeHandler = null;
		var complete = false;
		for(var i = 0, max = key.length; i<max;i++)
		{
			if(key[i] == "onComplete")
			{
				completeHandler = pProperty[key[i]];
				continue;
			}
			cssValue.push(key[i]+" "+pDuration+"s");
			endValue.push(key[i]+": "+pProperty[key[i]]);
		}
		cssValue = cssValue.join(", ");
		endValue = endValue.join("; ")+";";
		elements.forEach(function(el)
		{
			if(el.style.cssText == endValue)
				complete = true;
		});

		if(complete)
		{
			if(completeHandler!= null)
				completeHandler();
			return;
		}

		elements.forEach(function(el){el.style[css] = cssValue;});

		CSS3.Tween.css.add(pName, endValue);

		var callback = function()
		{
			elements.forEach(function(el){el.style.cssText = endValue;});
			CSS3.Tween.css.remove(pName);
			elements.forEach(function(el){el.classList.remove(pName);});
			if(completeHandler!= null)
				completeHandler();
		};

		CSS3.Tween.onComplete(elements[0], callback);

		elements.forEach(function(el){el.classList.add(pName);});
	},
	onComplete:function(pEl, pCallBack)
	{
		pEl.css3TweenCallback = pCallBack;
		pEl.addEventListener(CSS3.Tween.infos.onCompleteEvent, pEl.css3TweenCallback, false);
	}
};