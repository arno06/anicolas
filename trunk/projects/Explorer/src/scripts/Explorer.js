function Explorer()
{
	SWFAddress.addEventListener(SWFAddressEvent.CHANGE, M4.proxy(this, this.urlChangedHandler));
}

Explorer.prototype =
{
	urlChangedHandler:function(e)
	{
		M4.addClassName(document.querySelector(".path"), "loading");
		var from = Explorer.up?"leaving":"incoming";
		var to = Explorer.up?"incoming":"leaving";
		var fileHandler = M4.proxy(this, this.fileClickedHandler);
		Explorer.up = false;
		Request.load("php/action.php", {rout:e.path, className:from})
				.onComplete(
			function(pRequest)
			{
				document.querySelector(".path").innerHTML = pRequest.responseJSON["path"];
				document.querySelector(".content .folder").innerHTML+= pRequest.responseJSON["folders"];
				document.querySelectorAll(".content .folder a.file").forEach(function(a){
					a.addEventListener("click", fileHandler);
				});
				var t = document.querySelectorAll(".content .folder table");
				for(var i = 0, max = t.length;i<max;i++)
				{
					if(t[i].hasClassName(from))
						continue;
					CSS3.onComplete(t[i], function(e)
					{
						e.target.parentNode.removeChild(e.target);
					});
					M4.addClassName(t[i], to);
				}
				M4.removeClassName(document.querySelector(".content .folder table."+from), from);
				M4.removeClassName(document.querySelector(".path"), "loading");
			}
		);
	},
	fileClickedHandler:function(e)
	{
		var a = e.currentTarget;
		e.stopPropagation();
		e.preventDefault();

		window.open(e.target.getAttribute("rel"), "_blank");
	}
};
Explorer.up = false;

function CSS3()
{

}

CSS3.onComplete = function(pEl, pHandler)
{
	pEl.addEventListener(CSS3.Tween.infos.onCompleteEvent, pHandler, false);
};
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
	_cssDeclaration:{},
	to:function(pEl, pDuration, pProperty, pName)
	{
		var t = new Date().getTime();
		pName = pName||'CSS3Tween'+t;
		var css = CSS3.Tween.infos.property;
		var key = Object.keys(pProperty);
		var cssValue = [];
		var endValue = [];
		var completeHandler = null;
		for(var i = 0, max = key.length; i<max;i++)
		{
			if(key[i] == "onComplete")
			{
				completeHandler = pProperty[key[i]];
				continue;
			}
			cssValue.push(key[i]+" "+pDuration+"s");
			endValue.push(key[i]+":"+pProperty[key[i]]);
		}

		cssValue = cssValue.join(", ");
		endValue = endValue.join("; ");
		pEl.style[css] = cssValue;

		var style = document.querySelector("#CSS3Style");
		if(!style)
		{
			style = M4.createElement("style", {"type":"text/css", "id":"CSS3Style"});
			document.getElementsByTagName('head')[0].appendChild(style);
		}

		CSS3.Tween._cssDeclaration[pName] = endValue;
		var s = "";
		key = Object.keys(CSS3.Tween._cssDeclaration);
		for(i = 0, max = key.length;i<max;i++)
		{
			s += "."+key[i]+"{"+CSS3.Tween._cssDeclaration[key[i]]+"}";
		}

		style.innerHTML = s;

		if(completeHandler!= null)
			CSS3.onComplete(pEl, completeHandler);

		M4.addClassName(pEl, pName);
	}
};