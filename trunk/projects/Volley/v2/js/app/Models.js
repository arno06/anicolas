function Model()
{
	this.inputs = {};
	this._data = [];
	this.removeAllEventListener();
}

Class.define(Model, [EventDispatcher],
{
	inputs:null,
	_data:null,
	setParameters:function(pParameters)
	{

	},
	getData:function()
	{
		return this._data;
	}
});

function ResultsModel()
{
	this.super();
}

Class.define(ResultsModel, [Model],
{
	_dataReadyHandler:function(pResponse)
	{
		ResultsModel.data = pResponse.responseJSON;
		console.log("_dataReadyHandler");
		this.dispatchEvent(new Event(ResultsModel.EVT_READY));
	},
	retrieveData:function()
	{
		console.log("retrieveData");
		if(!ResultsModel.data)
		{
			Request.load("data/php/proxy.ffvb.php").onComplete(this._dataReadyHandler.proxy(this));
		}
		else
			this.dispatchEvent(new Event(ResultsModel.EVT_READY));
	}
});

ResultsModel.data = null;
ResultsModel.EVT_READY = "evt_data_ready";