function Dictionnary()
{
	this._data = null;
	this.loaded = false;
}

Class.define(Dictionnary, [EventDispatcher],
{
	_fileLoadedHandler:function(pData)
	{
		this._data = pData;
		this.loaded = true;
		this.dispatchEvent(new Event(Dictionnary.EVT_READY));
	},
	_fileNotLoadedHandler:function()
	{
		this.dispatchEvent(new Event(Dictionnary.EVT_ERROR));
	},
	load:function(pName)
	{
		LocalFile.retrieve(pName, this._fileLoadedHandler.proxy(this), this._fileNotLoadedHandler.proxy(this), true);
	},
	get:function(pId)
	{
		/**
		 * Depth reading of data object
		 */
		var ids = pId.split(".");
		var value = this._data;
		for(var i = 0, max = ids.length;i<max;i++)
		{
			if(!value[ids[i]])
				return "Undefined";
			value = value[ids[i]];
		}
		return value;
	},
	parse:function(pData)
	{
		for(var i in pData)
		{
			if(!pData.hasOwnProperty(i))
				continue;
			var type = (typeof pData[i]).toLowerCase();
			switch(type)
			{
				case "string":
					if(pData[i][0] != "@")
						continue;
					pData[i] = this.get(pData[i].substr(1, pData[i].length-1));
					break;
				case "object":
					pData[i] = this.parse(pData[i]);
					break;
			}
		}
		return pData;
	}
});

Dictionnary.EVT_READY = "evt_ready";
Dictionnary.EVT_ERROR = "evt_error";