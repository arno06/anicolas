var Main = function()
{
	var ref = this;
	this.holders = [];
	document.querySelectorAll("*[data-holder]").forEach(function(pEl)
	{
		var dataHolder = pEl.dataset.holder;
		var template   = pEl.dataset.template;
		if(!dataHolder||!template)
			return;
		eval("var holder = new "+dataHolder+"(pEl);");
		ref.holders.push(holder);
	});
	this.refresh();
};

Class.define(Main, [EventDispatcher],
{
	_holder:null,
	datas:null,
	refresh:function()
	{
		this.holders.forEach(function(pHold)
		{
			pHold.refresh();
		});
	}
});

Main.EVT_DATA_UPADTED = "evt_data_updated";
Main.EVT_TEMPLATE_READY = "evt_template_ready";

function RedditHolder(pDomElement)
{
	this.super();
	this._data = null;
	this._request = null;
	this._domElement = pDomElement;
	this.template = pDomElement.dataset.template;
	this.addEventListener(Main.EVT_DATA_UPADTED, M4.proxy(this, this._refreshTemplate));
}

Class.define(RedditHolder, [EventDispatcher],
{
	_data:null,
	refresh:function()
	{
		if(this._request)
			this._request.cancel();
		this._request = new Request(RedditHolder.PROXY_URL);
		this._request.onComplete(M4.proxy(this, this._dataCompleteHandler));
		this._request.onProgress(M4.proxy(this, this._dataProgressHandler));
	},
	_dataProgressHandler:function(e)
	{

	},
	_dataCompleteHandler:function(pResponse)
	{
		this._data = pResponse.responseJSON.data.children;
		var item;
		for(var i = 0, max = this._data.length;i<max;i++)
		{
			item = this._data[i].data;
			console.log(item);
			var ups = item.ups;
			var downs = item.downs;
			ups = Math.round((ups/(ups+downs)) * 100);
			downs = 100 - ups;

			item.trend_up = ups+"%";
			item.trend_down = downs+"%";

			var re = /\.(jpg|jpeg|png|gif)([?a-z0-9\=]*)$/i;
			if(re.test(item.url))
				item.src_img = item.url;
			else
			{
				switch(item.domain)
				{
					case "imgur.com":
						item.src_img = RedditHolder.PROXY_IMGUR_URL+"?url="+item.url;
						break;
					default:
						console.log(item.domain+" "+item.url);
						item.src_img = "not found";
						break;
				}
			}
			this._data[i] = item;
		}
		this.dispatchEvent(new Event(Main.EVT_DATA_UPADTED, false));
	},
	_refreshTemplate:function()
	{
		this._domElement.innerHTML = "";
		var tpl = new Template(this.template);
		tpl.addEventListener(TemplateEvent.RENDER_INIT, this._renderInitHandler);
		tpl.addEventListener(TemplateEvent.RENDER_COMPLETE, this._renderCompleteHandler);
		tpl.addEventListener(TemplateEvent.RENDER_COMPLETE_LOADED, this._renderCompleteLoadedHandler);
		tpl.assign("items", this._data);
		tpl.render(this._domElement);
	},
	_renderInitHandler:function()
	{
		console.log("init");
	},
	_renderCompleteHandler:function()
	{
		console.log("complete");
	},
	_renderCompleteLoadedHandler:function()
	{
		console.log("complete loaded");
	}
});

RedditHolder.PROXY_URL = "./php/proxy.reddit.php";
RedditHolder.PROXY_IMGUR_URL = "./php/proxy.imgur.php";