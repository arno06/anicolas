var Scroll =
{
	__offsets:[],
	__scrollHandler:function(e)
	{
		var o, currentHash;
		for(var i = 0, max = Scroll.__offsets.length;i<max;i++)
		{
			o = Scroll.__offsets[i];
			if(o.offset <= window.scrollY && o.offset+50 >= window.scrollY)
				currentHash = o.href;
		}
	},
	setup:function()
	{
		window.addEventListener("scroll", Scroll.__scrollHandler, false);
		document.querySelectorAll('a[href^="#"]').forEach(function(a)
		{
			Scroll.__offsets.push({href:a.getAttribute("href"), offset:Scroll.offsetTop(document.querySelector(a.getAttribute("href")))});
			a.addEventListener("click", function(e){
				e.preventDefault();
				e.stopPropagation();
				var t = e.target.getAttribute("href") ? e.target : e.target.parentNode;
				t.classList.add("current");
				Scroll.to(document.querySelector(t.getAttribute("href"))).onComplete(function(){
					window.location.hash = t.getAttribute("href").replace("#", "");
					document.querySelectorAll('a.current')
							.forEach(function(a)
							{
								if(a == t)
									return;
								a.classList.remove("current");
							});
					document.querySelectorAll('a[href^="'+t.getAttribute("href")+'"]')
							.forEach(function(a)
							{
								a.classList.add("current");
							});
				});
			}, false);
		});
		Scroll.__offsets.sort(function(a, b)
		{
			if(a.offset < b.offset)
				return -1;
			else if(a.offset > b.offset)
				return 1;
			return 0;
		});
	},
	prepareAll:function(pSelector)
	{
		var els = document.querySelectorAll(pSelector);
		els.forEach(function(pEl){pEl.setAttribute("data-scrollTop", Scroll.offsetTop(pEl));});
	},
	to:function(pElement, pTime)
	{
		pTime = pTime||.5;
		var st = Number(pElement.getAttribute("data-scrollTop")||Scroll.offsetTop(pElement));
		var t = document.documentElement.scrollTop ? document.documentElement:document.body;
		M4Tween.killTweensOf(t);
		return M4Tween.to(t, pTime, {useStyle:false, scrollTop:st});
	},
	offsetTop:function(pElement)
	{
		var v = 0;
		var o = pElement.offsetParent;
		while(o)
		{
			v += o.offsetTop;
			o = o.offsetParent;
		}
		if(!v)
			v += pElement.offsetTop;
		return v;
	}
};