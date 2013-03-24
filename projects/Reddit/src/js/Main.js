var Main = function(pSelector)
{
	console.log("new Main('"+pSelector+"');");
	this.container = document.querySelector(pSelector);

	this.addEventListener(Main.EVT_DATA_UPADTED, M4.proxy(this, this.formatResults));
	this.update();
};

Class.define(Main, [EventDispatcher],
{
	_holder:null,
	datas:null,
	update:function()
	{
		if(this._holder)
			this._holder.cancel();
		this._holder = new Request(Main.PROXY_URL);
		this._holder.onComplete(M4.proxy(this, this.dataUpdatedHandler));
		this._holder.onError(M4.proxy(this, this.dataErrorHandler));
		this._holder.onProgress(M4.proxy(this, this.dataProgressHandler));
	},
	dataUpdatedHandler:function(pResponse)
	{
		console.log("Main.js : Main.dataUdpatedHandler - Données-à-jours");
		this.datas = pResponse.responseJSON.data;
		this.dispatchEvent(new Event(Main.EVT_DATA_UPADTED, false));
	},
	dataErrorHandler:function()
	{
		console.log("Main.js : Main.dataErrorHandler - Une erreur est apparue lors du chargement des données");
	},
	dataProgressHandler:function(pEvent)
	{
		var total = pEvent.total;
		var loaded = pEvent.loaded;
		console.log("Main.js : Main.dataProgressHandler - "+(Math.round((loaded/total)*100))+"%");
	},
	formatResults:function()
	{
		this.container.innerHTML = "";
		var children = this.datas.children;
		var item;
		var element, imgContainer, img, linkContainer, voteContainer;
		for(var i = 0, max = children.length;i<max;i++)
		{
			item = children[i].data;
			element = M4.createElement("div", {class:"element", parentNode:this.container});
			linkContainer = M4.createElement("div", {"class":"link", parentNode:element});
			M4.createElement("a", {"href":"", "class":"icon-info", parentNode:linkContainer});
			M4.createElement("a", {"href":"", "class":"icon-reddit", parentNode:linkContainer});
			imgContainer = M4.createElement("div", {"class":"img", parentNode:element});
			img = M4.createElement("img", {"alt":item.title, parentNode:imgContainer});
			voteContainer = M4.createElement("div", {class:"vote", parentNode:element});
			M4.createElement("span", {"class":"icon-up", parentNode:voteContainer});
			M4.createElement("span", {"class":"icon-down", parentNode:voteContainer});

			var re = /\.(jpg|jpeg|png|gif)([?a-z0-9\=]*)$/i;
			if(re.test(item.url))
				img.setAttribute("src", item.url);
			else
			{
				switch(item.domain)
				{
					case "imgur.com":
						img.setAttribute("src", Main.PROXY_IMGUR_URL+"?url="+item.url);
						break;
					default:
						console.log(item.domain+" "+item.url);
						break;
				}
			}
		}
	}
});

Main.PROXY_URL = "./php/proxy.main.php";
Main.PROXY_IMGUR_URL = "./php/proxy.imgur.php";
Main.EVT_DATA_UPADTED = "evt_data_updated";