function Controller()
{
	this.parameters = [];
	this._actionsHeader = [];
	this._withHeader = true;
	this._content = {};
	this.template = this.constructor.name.substr(0, this.constructor.name.length-4);
	this.removeAllEventListener();
	if(!Template.$[this.template])
		this.template = "notfound_tpl";
}

Class.define(Controller, [EventDispatcher],
{
	parameters:null,
	template:null,
	view:null,
	_content:null,
	_withHeader:null,
	_actionsHeader:null,
	addActionHeader:function(pClassName, pHash)
	{
		this._actionsHeader.push({href:pHash, className:pClassName});
	},
	setParameters:function(pParameters)
	{
		this.parameters = pParameters;
		this._content["get"] = this.parameters;
	},
	assign:function(pName, pValue)
	{
		this._content[pName] = pValue;
	},
	render:function()
	{
		Header.setActions(this._actionsHeader);
		if(this._withHeader)
			Header.show();
		else
			Header.hide();

		document.querySelector(Main.contentHolder).innerHTML = "";
		var tpl = new Template(this.template);
		tpl.setFunction("format_date", function(pValue)
		{
			var d = new Date(pValue);
			return Main.dictionnary.get("month."+ d.getMonth())+" "+d.getDate()+", "+ d.getFullYear();
		});
		for(var i in this._content)
		{
			if(!this._content.hasOwnProperty(i))
				continue;
			tpl.assign(i, this._content[i]);
		}
		tpl.assign("dictionnary", Main.dictionnary._data);
		tpl.addEventListener(TemplateEvent.RENDER_COMPLETE_LOADED, this.dispatchEvent.proxy(this));
		tpl.render(Main.contentHolder);
	}
});

function RankingCtrl()
{
	this.super();
	this.model = new ResultsModel();
	this.model.addEventListener(ResultsModel.EVT_READY, this._dataReadyHandler.proxy(this));
}

Class.define(RankingCtrl, [Controller],
{
	_dataReadyHandler:function()
	{
		var ranking = ResultsModel.data.ranking;
		this.assign("ranking", ranking);
		this.super("render");
	},
	render:function()
	{
		this.model.retrieveData();
	}
});


function AgendaCtrl()
{
	this.super();
	this.model = new ResultsModel();
	this.model.addEventListener(ResultsModel.EVT_READY, this._dataReadyHandler.proxy(this));
}

Class.define(AgendaCtrl, [Controller],
{
	_dataReadyHandler:function()
	{
		var agenda = ResultsModel.data.agenda;
		this.assign("agenda", agenda);
		this.super("render");
	},
	render:function()
	{
		this.model.retrieveData();
	}
});

