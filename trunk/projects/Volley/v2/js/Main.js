var Main =
{
	config:
	{
		language:"fr",
		debug:false,
		firstScreen:"#bouboup/"
	},
	routing:null,
	router:null,
	dictionnary:null,
	controllersPool:null,
	contentHolder:"#screen .content .holder",
    initialize: function()
	{
		this.router = new Router();
		this.dictionnary = new Dictionnary();
	    this.controllersPool = [];
		this.dictionnary.addEventListener(Dictionnary.EVT_READY, this._dictionnaryReadyHandler.proxy(this));
		this.startAppHandler();
    },
	startAppHandler: function()
	{
		LocalFile.retrieve(Main.CONFIG_FILE, this.configLoadedHandler.proxy(this), false, true);
    },
	configLoadedHandler:function(pData)
	{
		for(var i in pData)
		{
			if(!pData.hasOwnProperty(i))
				continue;
			this.config[i] = pData[i];
		}

		LocalFile.retrieve(Main.ROUTING_FILE, this.routingLoadedHandler.proxy(this), false, true);

	},
	routingLoadedHandler:function(pRouting)
	{
		this.routing = pRouting;

		var templates = {};
		var route, tpl;
		for(var i = 0, max = this.routing.length;i<max;i++)
		{
			route = this.routing[i];
			this.router.addRule(route.hash, this.newRouteFound, route.parameters, [route.controller, route.inMenu]);
			tpl = route.controller.substr(0, route.controller.length-4);
			templates[tpl] = Main.TEMPLATE_FOLDER+tpl+".tpl";
		}

		Template.load(templates).onComplete(function()
		{
			Main.dictionnary.load(Main.LOCAL_FOLDER+Main.config.language+".json");
		});
	},
	newRouteFound:function(pRoute, pParameters, pController, pInMenu)
	{
		var hideLoader = function()
		{
			Helper.fadeOut(loader,.4);
		};

		document.querySelectorAll('a[href^="#"]').forEach(function(pElement)
		{
			if(pElement.classList.contains("current"))
				pElement.classList.remove("current");
		});
		var sel = pRoute==""?'a[href="#"]':'a[href^="#'+pRoute+'"]';
		document.querySelectorAll(sel).forEach(function(pElement)
		{
			if(!pElement.classList.contains("current"))
				pElement.classList.add("current");
		});
		Menu.hide();
		if(pInMenu)
			Header.showMenuButton();
		else
			Header.showBackButton();
		var ctrl = Main.controllersPool[pController];
		if(!ctrl)
		{
			var eval_ctrl = "try{ctrl = new "+pController+"();}catch(e){ctrl=false;}";
			eval(eval_ctrl);
			if(!ctrl)
			{
				pController = "Controller";
				ctrl = new Controller();
			}
			Main.controllersPool[pController] = ctrl;
			Main.controllersPool[pController].addEventListener(TemplateEvent.RENDER_COMPLETE_LOADED, hideLoader, false);
		}

		Main.controllersPool[pController].setParameters(pParameters);

		var loader = document.querySelector(".loader");

		function display()
		{
			document.querySelector(Main.contentHolder).removeAttribute("style");
			document.querySelector(Main.contentHolder).style.overflow = "auto";
			document.querySelector(Main.contentHolder).scrollTop = 0;
			Main.controllersPool[pController].render();
		}
		Helper.fadeIn(loader,.3, display);
	},
	_dictionnaryReadyHandler:function()
	{
		this.config = this.dictionnary.parse(this.config);
		this.routing = this.dictionnary.parse(this.routing);

		var main_tpl = new Template("struct_tpl");
		main_tpl.addEventListener(TemplateEvent.RENDER_COMPLETE, this._tplStructCompleteHandler.proxy(this), false);
		main_tpl.assign("dictionnary", this.dictionnary._data);
		main_tpl.assign("routing", this.routing);
		main_tpl.render("body");
	},
	_tplStructCompleteHandler:function()
	{
		Helper.handlerMouseEvents("menu.main li a");
		document.querySelector("#screen .overlay").addEventListener(Global.clickEvent, this._toggleMenuHandler.proxy(this), false);
		Header.init();
		document.location.hash = this.config.firstScreen;
		this.router.start();
	},
	_backHandler:function(e)
	{
		if(e)
		{
			e.stopPropagation();
			e.stopImmediatePropagation();
			e.preventDefault();
		}
		window.history.back();
	},
	_toggleMenuHandler:function(e)
	{
		e.stopPropagation();
		e.stopImmediatePropagation();
		e.preventDefault();
		Menu.toggle();
	}
};

Main.CONFIG_FILE = "data/config.json";
Main.ROUTING_FILE = "data/routing.json";
Main.LOCAL_FOLDER = "data/local/";
Main.TEMPLATE_FOLDER = "templates/";

var Menu =
{
	el:function()
	{
		return document.querySelector("menu.main");
	},
	display:function()
	{
		Menu.el().classList.remove("hidden");
	},
	hide:function()
	{
		Menu.el().classList.add("hidden");
	},
	toggle:function()
	{
		Menu.el().classList.toggle("hidden");
	}
};

var Header =
{
	element:function(){return document.querySelector("#screen header");},
	actions:function(){return document.querySelector("#screen header .actions");},
	backButton:function(){return document.querySelector("#backbutton");},
	menuButton:function(){return document.querySelector("#menubutton");},
	init:function()
	{
		Header.menuButton().addEventListener(Global.clickEvent, Main._toggleMenuHandler.proxy(Main), false);
		Header.backButton().addEventListener(Global.clickEvent, Main._backHandler.proxy(Main), false);
	},
	showMenuButton:function()
	{
		this.menuButton().classList.remove("hidden");
		if(!this.backButton().classList.contains("hidden"))
			this.backButton().classList.add("hidden");
	},
	showBackButton:function()
	{
		if(!this.menuButton().classList.contains("hidden"))
			this.menuButton().classList.add("hidden");
		this.backButton().classList.remove("hidden");
	},
	hideButtons:function()
	{
		if(!this.backButton().classList.contains("hidden"))
			this.menuButton().classList.add("hidden");
		if(!this.backButton().classList.contains("hidden"))
			this.backButton().classList.add("hidden");
	},
	show:function()
	{
		var el = Header.element();
		if(!el.classList.contains("hidden"))
			return;
		el.classList.remove("hidden");
	},
	hide:function()
	{
		var el = Header.element();
		if(el.classList.contains("hidden"))
			return;
		el.classList.add("hidden");
	},
	setActions:function(pActions)
	{
		var ac = Header.actions();

		ac.querySelectorAll("a").forEach(function(el)
		{
			el.classList.add("removing");
			M4Tween.killTweensOf(el);
			M4Tween.to(el, .5, {opacity:0, marginTop:"-20px"}).onComplete(function()
			{
				el.parentNode.removeChild(el);
			});
		});

		var a;
		for(var i = 0, max = pActions.length;i<max;i++)
		{
			a = pActions[i];
			M4.createElement("a", {parentNode:ac, "class": a.className, href: a.href, style:{opacity:0, "margin-top":"-20px"}});
		}

		ac.querySelectorAll("a").forEach(function(el)
		{
			if(el.classList.contains("removing"))
				return;
			M4Tween.killTweensOf(el);
			M4Tween.to(el,.5, {opacity:1, marginTop:"0px"});
		});
	}
};

window.addEventListener("load", Main.initialize.proxy(Main), false);