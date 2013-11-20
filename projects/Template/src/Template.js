function Template(pIdTemplate)
{
	this.removeAllEventListener();
	this._content = {};
	this._functions = Template.FUNCTIONS||{};
	this.time = null;
	this._id = pIdTemplate;
}

Class.define(Template, [EventDispatcher],
{
	_content:{},
	assign:function(pName, pValue)
	{
		this._content[pName] = pValue;
	},
	setFunction:function(pName, pCallBack)
	{
		this._functions[pName] = pCallBack;
	},
	render:function(pParentNode)
	{
		var self = this;
		var p = pParentNode;
		if((typeof p).toLowerCase()=="string")
			p = document.querySelector(pParentNode);
		if(!p)
			return;

		this.dispatchEvent(new TemplateEvent(TemplateEvent.RENDER_INIT, 0, false));

		p.innerHTML += this.evaluate();

		this.dispatchEvent(new TemplateEvent(TemplateEvent.RENDER_COMPLETE, this.time, false));

		var imgs = p.querySelectorAll("img");

		var max = imgs.length;

		if(!max)
		{
			this.dispatchEvent(new TemplateEvent(TemplateEvent.RENDER_COMPLETE_LOADED, this.time, false));
			return;
		}

		var i = 0;

		imgs.forEach(function(img)
		{
			img.addEventListener("load", function()
			{
				if(++i==max)
					self.dispatchEvent(new TemplateEvent(TemplateEvent.RENDER_COMPLETE_LOADED, self.time, false));
			});
		});

	},
	evaluate:function()
	{
		var start = new Date().getTime();
		var t = Template.$[this._id];
		if(!t)
			return "";

		var t0 = Template.TAG[0];
		var t1 = Template.TAG[1];

		var re_blocs = new RegExp("(\\"+t0+"[a-z]+|\\"+t0+"\/[a-z]+)(\\s|\\"+t1+"){1}", "gi");

		var opener = [t0+"foreach", t0+"if"];
		var closer = [t0+"\/foreach", t0+"\/if"];
		var neutral= [t0+"else"];

		var step = 0;

		var result, tag, currentId;

		var opened = [];

		while (result = re_blocs.exec(t))
		{
			tag = result[1];
			if(opener.indexOf(tag)>-1)
			{
				currentId = ++step;
				opened.unshift(currentId);
			}
			else if (closer.indexOf(tag)>-1)
			{
				currentId = opened.shift();
			}
			else if (neutral.indexOf(tag)>-1)
			{
				currentId = opened[0];
			}
			else
				continue;

			t = t.replace(result[0], tag+"_"+currentId+result[2]);
		}
		var eval = this._parseBlock(t, this._content);
		var end = new Date().getTime();
		this.time = end - start;
		return eval;
	},
	_parseBlock:function(pString, pData)
	{
		var t_0 = Template.TAG[0];
		var t_1 = Template.TAG[1];

		//{opener_X}
		var opener = new RegExp('\\'+t_0+'([a-z]+)(_[0-9]+)([^\}]*)\\'+t_1, 'i');

		//$path.to.var
		var rea = /\$([a-z0-9\.\_\-]+)*/i;

		var o, start, neutral, n, closer, c, length, totalBlock, blc, alt, params;

		while(o = opener.exec(pString))
		{
			start = o.index;

			closer = new RegExp('\\'+t_0+'\/'+o[1]+o[2]+'\\'+t_1, 'gi');
			c = closer.exec(pString);

			if(!c)
			{
				console.log("no end tag");
				break;
			}

			blc = pString.substr((start + o[0].length), c.index - (start + o[0].length));
			alt = "";

			neutral = new RegExp('\\'+t_0+'else'+o[2]+'\\'+t_1, 'gi');

			n = neutral.exec(pString);
			if(n)
			{
				blc = pString.substr(start+o[0].length, n.index - (start + o[0].length));
				alt = pString.substr(n.index+n[0].length, c.index - (n.index+n[0].length));
			}

			length = (c.index + c[0].length) - start;

			totalBlock = pString.substr(start, length);

			var r = "";
			switch(o[1])
			{
				case "foreach":
					params = o[3].split(" ");//Setup [*, tablename, itemname, keyname]
					params[1] = params[1].replace("$","");
					var d = this._getVariable(params[1], pData);
					if(d && d.length)
					{
						var val = t_0+(params[2]||"$v")+t_1;
						var key = t_0+(params[3]||"$k")+t_1;
						var c_key = (params[3]||"$k").replace("$", "");
						var re = new RegExp("\\"+t_0+"\\"+(params[2]||"$v")+"([a-z0-9\.\_\-]+)*\\"+t_1, "gi");
						var v = "";
						var tmp = "";
						var vr;
						for(var j = 0, maxj = d.length;j<maxj;j++)
						{
							v = blc.replace(val, d[j]);
							tmp = v;
							while(vr = re.exec(v))//Keep exec on "v" and replacing on "tmp" (loosing string index)
							{
								vr[1] = vr[1].substr(1, vr[1].length-1);
								tmp = tmp.replace(vr[0], this._getVariable(vr[1], d[j]));
							}
							v = tmp.replace(key, t_0+(params[2]||"$v")+"."+c_key+t_1);
							v = v.replace("$"+c_key, (params[2]||"$v")+"."+c_key);
							if(typeof d[j] == "string")
							{
								tmp = d[j];
								d[j] = {};
								d[j][(params[2]||"$v")] = tmp;
							}
							d[j][c_key] = j;

							var dataCloned = Object.clone(pData);
							dataCloned[(params[2]||"$v").replace("$", "")] = d[j];
							dataCloned[c_key] = j;
							v = this._parseBlock(v, dataCloned);
							r += v;
						}
					}
					else
						r = this._parseBlock(alt, pData);
					break;
				case "if":
					var f = this._parseVariables(o[3], pData, rea);
					while(f[0]==" ")
						f = f.replace(/^\s/, '');
					if(/^\s*$/.exec(f)||/^\!\=/.exec(f)||/^\=\=/.exec(f)||/^\>\=/.exec(f)||/^\<\=/.exec(f)||/^\%/.exec(f)||/^\|/.exec(f))
						f = false;
					r = eval("(function(){var r = false; try { r = "+f+"; } catch(e){ r= false;} return r;})()");
					r = r?blc:(alt||"");
					r = this._parseBlock(r, pData);
					break;
				default:
					continue;
					break;
			}

			pString = pString.replace(totalBlock, r);
		}

		pString = this._parseVariables(pString, pData, Template.REGXP_VAR);

		var func;
		var a;
		var p;
		while(func = Template.REGXP_FUNC.exec(pString))
		{
			var funcName = func[1];
			if(!this._functions[funcName])
			{
				throw new Error("Call to undefined function "+funcName);
			}
			params = func[2];
			p = [];
			params = params.replace(/,\s/g, ",");
			params = params.split(",");
			for(var i = 0, max = params.length;i<max;i++)
			{
				if(params[i][0]=="$")
					p.push(this._getVariable(params[i], pData));
				else
				{
					if(/^[0-9][0-9\.]*[0-9]*$/.exec(params[i]))
						params[i] = Number(params[i]);
					if(/^("|')/.exec(params[i]))
						params[i] = params[i].substr(1, params[i].length-2);
					p.push(params[i]);
				}
			}
			pString = pString.replace(func[0], this._functions[funcName].apply(null, p));
		}

		return pString;
	},
	_parseVariables:function(pString, pData, pRegXP)
	{
		pRegXP = pRegXP||Template.REGXP_ID;
		var res;
		while(res = pRegXP.exec(pString))
		{
			pString = pString.replace(res[0], this._getVariable(res[1], pData));
		}
		return pString;
	},
	_getVariable:function(pName, pContext)
	{
		var default_value = "";
		var data = pContext||this._content;
		var result = Template.REGXP_ID.exec(pName);

		if(!result)
			return default_value;

		var levels = result[1].split(".");

		for(var i = 0, max = levels.length;i<max;i++)
		{
			if (typeof data[levels[i]] == "undefined")
			{
				return default_value;
			}
			data = data[levels[i]];
		}

		return data;
	}
});

Template.TAG = ["{", "}"];
Template.REGXP_FUNC = new RegExp("\\"+Template.TAG[0]+"\\=([^(]+)\\(([^"+Template.TAG[1]+"]+)\\)\\"+Template.TAG[1], "i");
Template.REGXP_VAR = new RegExp("\\"+Template.TAG[0]+"\\$([a-z0-9\.\_\-]+)*\\"+Template.TAG[1], "i");
Template.REGXP_ID = new RegExp("([a-z0-9\.\_\-]+)", "i");

Template.FUNCTIONS =
{
	truncate:function(pString, pLength, pEnd)
	{
		pLength = pLength||80;
		pEnd = pEnd||"...";
		if(pString.length<=pLength)
			return pString;
		pString = pString.substr(0, pLength-pEnd.length);
		return pString+pEnd;
	},
	uppercase:function(pString)
	{
		return pString.toUpperCase();
	},
	lowercase:function(pString)
	{
		return pString.toLowerCase();
	},
	replace:function(pString, pSearch, pReplace, pFlags)
	{
		pFlags = pFlags||"gi";
		var re = new RegExp(pSearch, pFlags);
		return pString.replace(re, pReplace);
	},
	add:function()
	{
		var result = 0;
		for(var i = 0, max = arguments.length;i<max;i++)
		{
			result+=Number(arguments[i]);
		}
		return result;
	}
};

Template.$ = {};

Template.setup=function()
{
	var templates = document.querySelectorAll('script[type="html/template"]');
	templates.forEach(function(pEl)
	{
		Template.$[pEl.getAttribute("id")] = pEl.text;
		pEl.parentNode.removeChild(pEl);
	});
};

Template.load = function(pDataList)
{
	var _data = [];
	for(var i in pDataList)
	{
		if(!pDataList.hasOwnProperty(i))
			continue;
		_data.push({"name":i, "file":pDataList[i]});
	}

	var _currentIndex = -1;
	var _callBack = null;

	function templateLoadedHandler(pResquest)
	{
		Template.$[_data[_currentIndex].name] = pResquest.responseText;
		next();
	}

	function next()
	{
		_currentIndex++;
		if(_currentIndex>=_data.length)
		{
			if(_callBack)
				_callBack();
			return;
		}

		Request.load(_data[_currentIndex].file, {}, "get").onComplete(templateLoadedHandler).onError(next);
	}

	next();

	return {
		onComplete:function(pCallBack)
		{
			_callBack = pCallBack;
			return this;
		}
	};
};

window.addEventListener("load", Template.setup, false);

function TemplateEvent(pType, pTime, pBubbles)
{
	this.time = pTime||0;
	this.super("constructor", pType, pBubbles);
}

Class.define(TemplateEvent, [Event],
{
	clone:function(){var e = new TemplateEvent(this.type, this.time, this.bubbles);e.target = this.target;return e;},
	toString:function(){return this.formatToString("type", "time", "eventPhase", "target", "currentTarget", "bubbles");}
});

TemplateEvent.RENDER_INIT               = "evt_render_start";
TemplateEvent.RENDER_COMPLETE           = "evt_render_complete";
TemplateEvent.RENDER_COMPLETE_LOADED    = "evt_render_loaded_complete";