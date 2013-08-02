function Request(pTarget, pParams, pMethod)
{
	pMethod = pMethod||"POST";
	this.xhr_object = null;
    if (window.XMLHttpRequest)
	    this.xhr_object = new XMLHttpRequest();
    else if (window.ActiveXObject)
    {
    	var t = ['Msxml2.XMLHTTP','Microsoft.XMLHTTP'],i = 0;
    	while(!this.xhr_object&&t[i++])
    		try {this.xhr_object = new ActiveXObject(t[i]);}catch(e){}
    }
	if(!this.xhr_object)
		return;
	var ref = this, v = "", j = 0;
	for(i in pParams)
		v += (j++>0?"&":"")+i+"="+pParams[i];
	this.xhr_object.open(pMethod, pTarget, true);
	this.xhr_object.onprogress = function(pEvent)
	{
		if(ref.onProgressHandler)
			ref.onProgressHandler(pEvent);
	};
	this.xhr_object.onreadystatechange=function()
	{
		if(ref.xhr_object.readyState==4)
		{
			switch(ref.xhr_object.status)
			{
				case 304:
				case 200:
					var ct = ref.xhr_object.getResponseHeader("Content-type");
					if(ct.indexOf("json")>-1)
						eval("ref.xhr_object.responseJSON = "+ref.xhr_object.responseText+";");
					if(ref.onCompleteHandler)
						ref.onCompleteHandler(ref.xhr_object);
				break;
				case 403:
				case 404:
				case 500:
					if(ref.onErrorHandler)
						ref.onErrorHandler(ref.xhr_object.responseText);
				break;
			}
		}
	};

	this.xhr_object.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset:ISO-8859-1');
	this.xhr_object.send(v);
}
Class.define(Request, [Class],
{
	onComplete:function(pFunction)
	{
		this.onCompleteHandler = pFunction;
		return this;
	},
	onProgress:function(pFunction)
	{
		this.onProgressHandler = pFunction;
		return this;
	},
	onError:function(pFunction)
	{
		this.onErrorHandler = pFunction;
		return this;
	},
	cancel:function()
	{
		this.xhr_object.abort();
	}
});
Request.load = function (pUrl, pParams){return new Request(pUrl, pParams);};
Request.update = function(pId, pUrl, pParams){return Request.load(pUrl, pParams).onComplete(function(pResponse){document.getElementById(pId).innerHTML = pResponse.responseText;});};