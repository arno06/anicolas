function EventDispatcher()
{
	this.removeAllEventListener();
}

Class.define(EventDispatcher, [Class], {
	__listeners:{},
	__listenersCapture:{},
	addEventListener:function(pType, pHandler, pCapture)
	{
		if(typeof(pCapture)!="boolean")
			pCapture = false;
		if(pCapture)
		{
			if(!this.__listenersCapture[pType])
				this.__listenersCapture[pType] = [];
			this.__listenersCapture[pType].push(pHandler);
		}
		else
		{
			if(!this.__listeners[pType])
				this.__listeners[pType] = [];
			this.__listeners[pType].push(pHandler);
		}
	},
	removeEventListener:function(pType, pHandler, pCapture)
	{
		if(typeof(pCapture)!="boolean")
			pCapture = false;
		var t = (pCapture?this.__listenersCapture:this.__listeners)[pType];
		if(typeof(t)=="undefined"||!t.length)
			return;
		var handlers = [];
		for(var i = 0, max = t.length;i<max;i++)
		{
			if(t[i]===pHandler)
				continue;
			handlers.push(t[i]);
		}
		if(pCapture)
			this.__listenersCapture[pType] = handlers;
		else
			this.__listeners[pType] = handlers;
	},
	removeAllEventListener:function(pType)
	{
		pType = pType||false;
		if(pType===false)
		{
			this.__listeners = {};
			this.__listenersCapture = {};
			return;
		}
		this.__listeners[pType] = [];
		this.__listenersCapture[pType] = [];
	},
	dispatchEvent:function(pEvent)
	{
		if(!pEvent.target)
			pEvent.target = this;
		pEvent.currentTarget = this;
		var a = [], p = this.parent, i, max, e;
		switch(pEvent.eventPhase)
		{
			case Event.CAPTURING_PHASE:
				if(typeof(this.__listenersCapture[pEvent.type])=="undefined")
					return;
				for(i = 0, max = this.__listenersCapture[pEvent.type].length;i<max;i++)
					this.__listenersCapture[pEvent.type][i](pEvent);
			break;
			case Event.AT_TARGET:
				while(p)
				{
					a.push(p);
					p = p.parent;
				}
				e = pEvent.clone();
				e.eventPhase = Event.CAPTURING_PHASE;
				for(i = a.length-1; i>=0; i--)
					a[i].dispatchEvent(e);
				if(typeof(this.__listeners[pEvent.type])=="object"&&this.__listeners[pEvent.type].length>0)
				{
					for(i = 0, max = this.__listeners[pEvent.type].length;i<max;i++)
					{
						if(this.__listeners[pEvent.type]&&this.__listeners[pEvent.type][i])
							this.__listeners[pEvent.type][i](pEvent);
					}
				}
				if(pEvent.bubbles)
				{
					e = pEvent.clone();
					e.eventPhase = Event.BUBBLING_PHASE;
					for(i = 0, max = a.length;i<max;i++)
						a[i].dispatchEvent(e);
				}
			break;
			case Event.BUBBLING_PHASE:
				if(typeof(this.__listeners[pEvent.type])=="undefined")
					return;
				for(i = 0, max = this.__listeners[pEvent.type].length;i<max;i++)
					this.__listeners[pEvent.type][i](pEvent);
			break;
		}
	}
});