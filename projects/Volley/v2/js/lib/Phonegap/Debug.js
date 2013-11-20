var DEBUG =
{
	log:function(pMessage, pOpen)
	{
		pOpen = pOpen||false;
		var debug = document.querySelector("#debug");
		if(!debug.getAttribute("event"))
		{
			document.querySelector("#debug .toggle").addEventListener(Global.clickEvent, Global.toggleHandler, false);
			debug.setAttribute("event", "ok");
		}
		if(pOpen)
			debug.classList.remove("close");
		var ul = debug.querySelector("ul");
		var d = new Date();
		d = d.getHours()+":"+ d.getMinutes()+":"+ d.getSeconds()+" "+ d.getMilliseconds();
		var newli = "<li><span class='dt'>"+d+"</span><span class='mess'>"+pMessage+"</span><span class='clear'></span></li>";
		ul.innerHTML = newli + ul.innerHTML;
	}
};
