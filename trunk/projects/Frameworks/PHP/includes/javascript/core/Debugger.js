NodeList.prototype.forEach = Array.prototype.forEach;

var Debugger =
{
    error:false,
	current:"sortie",
	__init:function()
	{
		if(document.querySelector(".debugselected"))
			Debugger.current = document.querySelector(".debugselected a");
		document.querySelectorAll("#debug_buttons div").forEach(function(div)
		{
			var listener = Debugger.__controlConsoleClickHandler;
			if(div.classList.contains("vars"))
				listener = Debugger.__controlVarsClickHandler;
			div.addEventListener("click", listener);
		});
        if(Debugger.error)
        {
            var el = document.querySelector("#debug .debug_console");
            el.scrollTop = el.scrollHeight;
            Debugger.fullscreen();
        }
		document.querySelector("#debug_toggle").addEventListener("click", Debugger.toggle);
        document.querySelector("#debug_fullscreen").addEventListener("click", Debugger.fullscreen);
		document.querySelector("#debug_close").addEventListener("click", Debugger.close);
		window.addEventListener("keydown", Debugger.keyDownHandler);
	},
	keyDownHandler:function(e)
	{
		switch(e.keyCode)
		{
			case 113:
				e.preventDefault();
                if(e.shiftKey)
                    Debugger.fullscreen();
                else
				    Debugger.toggle();
				break;
		}
	},
	toggle:function(e)
	{
		var t = document.getElementById("debug_toggle");
		t.innerHTML = (t.innerHTML == "Agrandir"?"Minimiser":"Agrandir");
		var value = t.innerHTML=="Minimiser"?"350px":"20px";
		M4Tween.to(document.querySelector("#debug"), .2,{"height":value});
		try
		{
			e.preventDefault();
		}catch(e){}
	},
    fullscreen:function(e)
    {
        var value =  window.innerHeight+"px";
        var t = document.getElementById("debug_toggle");
        t.innerHTML = "Minimiser";
        M4Tween.to(document.querySelector("#debug"), .2,{"height":value});
        try
        {
            e.preventDefault();
        }catch(e){}
    },
	close:function(e)
	{
		document.querySelector("#debug").style.display = "none";
		e.preventDefault();
	},
	updateConsole:function()
	{
		document.querySelectorAll("#debug_buttons div").forEach(function(button)
		{
			var display = "table-row";
			if(button.classList.contains("disabled"))
				display = "none";
			document.querySelectorAll(".debug_console table.console tr."+button.getAttribute("rel")).forEach(function(tr)
			{
				tr.style.display = display;
			});
		});
	},
	__controlVarsClickHandler:function(e)
	{
		e.preventDefault();
		var t = e.target.nodeName.toLowerCase()!="div" ? e.target.parentNode : e.target;
		document.querySelectorAll("#debug_buttons div.vars").forEach(function(div)
		{
			if(!div.classList.contains("disabled"))
				div.classList.add("disabled");
		});
		t.classList.remove("disabled");
		document.querySelectorAll(".debug_vars pre").forEach(function(pre)
		{
			if(pre.getAttribute("rel") == t.getAttribute("rel"))
				pre.style.display = "block";
			else
				pre.style.display = "none";
		});
	},
	__controlConsoleClickHandler:function(e)
	{
		e.preventDefault();
		var t = e.target.nodeName.toLowerCase()!="div" ? e.target.parentNode : e.target;
        t.classList.toggle("disabled");
		Debugger.updateConsole();
	}
};
NodeList.prototype.forEach = Array.prototype.forEach;
window.addEventListener("load", Debugger.__init);