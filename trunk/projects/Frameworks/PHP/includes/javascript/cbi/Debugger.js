NodeList.prototype.forEach = Array.prototype.forEach;

var Debugger =
{
    error:false,
	current:"sortie",
	__init:function()
	{
		if($one(".debugselected"))
			Debugger.current = document.querySelector(".debugselected a");
		document.querySelectorAll("#debug_buttons div").forEach(function(div)
		{
			var listener = Debugger.__controlConsoleClickHandler;
			if(div.hasClassName("vars"))
				listener = Debugger.__controlVarsClickHandler;
			Event.observe(div, "click", listener);
		});
        if(Debugger.error)
        {
            document.querySelector("#debug .debug_console").scrollTop = document.querySelector("#debug .debug_console").scrollHeight;
            Debugger.fullscreen();
        }
		Event.observe($("debug_toggle"), "click", Debugger.toggle);
        Event.observe($("debug_fullscreen"), "click", Debugger.fullscreen);
		Event.observe($("debug_close"), "click", Debugger.close);
		Event.observe(window, "keydown", Debugger.keyDownHandler);
	},
	keyDownHandler:function(e)
	{
		switch(e.keyCode)
		{
			case 113:
				Event.stop(e);
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
		M4Tween.to($("debug"), .2,{"height":value});
		try
		{
			Event.stop(e);
		}catch(e){}
	},
    fullscreen:function(e)
    {
        var value =  document.viewport.getHeight()+"px";
        var t = document.getElementById("debug_toggle");
        t.innerHTML = "Minimiser";
        M4Tween.to($("debug"), .2,{"height":value});
        try
        {
            Event.stop(e);
        }catch(e){}
    },
	close:function(e)
	{
		$("debug").style.display = "none";
		Event.stop(e);
	},
	updateConsole:function()
	{
		$$("#debug_buttons div").each(function(button)
		{
			var display = "table-row";
			if(button.hasClassName("disabled"))
				display = "none";
			$$(".debug_console table.console tr."+button.getAttribute("rel")).each(function(tr)
			{
				tr.style.display = display;
			});
		});
	},
	__controlVarsClickHandler:function(e)
	{
		Event.stop(e);
		var t = e.target.nodeName.toLowerCase()!="div" ? e.target.parentNode : e.target;
		$$("#debug_buttons div.vars").each(function(div)
		{
			if(!div.hasClassName("disabled"))
				div.addClassName("disabled");
		});
		t.removeClassName("disabled");
		$$(".debug_vars pre").each(function(pre)
		{
			if(pre.getAttribute("rel") == t.getAttribute("rel"))
				pre.style.display = "block";
			else
				pre.style.display = "none";
		});
	},
	__controlConsoleClickHandler:function(e)
	{
		Event.stop(e);
		var t = e.target.nodeName.toLowerCase()!="div" ? e.target.parentNode : e.target;
		if(t.hasClassName("disabled"))
			t.removeClassName("disabled");
		else
			t.addClassName("disabled");
		Debugger.updateConsole();
	}
};
Event.observe(window, "load", Debugger.__init);