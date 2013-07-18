function Template(pIdTemplate)
{
	this._content = [];
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
			return;

		var re_blocs = /(\{[a-z]+|\{\/[a-z]+)(\s|\}){1}/gi;

		var opener = ["{foreach", "{if"];
		var closer = ["{\/foreach", "{\/if"];
		var neutral= ["{else"];

		var step = 0;

		var result, tag, id, currentId;

		while (result = re_blocs.exec(t))
		{
			tag = result[1];
			if(opener.indexOf(tag)>-1)
			{
				id = ++step;
				currentId = id;
			}
			else if (closer.indexOf(tag)>-1)
			{
				currentId = id--;
			}
			else if (neutral.indexOf(tag)>-1){}
			else
				continue;

			t = t.replace(result[0], tag+"_"+currentId+result[2]);
		}

		var eval = this._parseBlock(t, this._content);
		var end = new Date().getTime();
		this.time = end - start;
		return eval;
	},
	_parseBlock:function(pString, pData, pBaseObject)
	{
		var opener = /\{([a-z]+)(_[0-9]+)([^\}]*)\}/i;

		var o, start, neutral, n, closer, c, length, s, totalBlock, blc, alt, params;

		while(o = opener.exec(pString))
		{
			start = o.index;

			closer = new RegExp('\{\/'+o[1]+o[2]+'\}', 'gi');
			c = closer.exec(pString);

			if(!c)
			{
				console.log("no end tag");
				continue;
			}

			blc = pString.substr((start + o[0].length), c.index - (start + o[0].length));
			alt = "";

			neutral = new RegExp('\{else'+o[2]+'\}', 'gi');

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
					if(pBaseObject&&pBaseObject.length)
						params[1]= params[1].replace("$"+pBaseObject+".", "");
					params[1] = params[1].replace("$","");
					var d = pData[params[1]];
					if(d && d.length)
					{
						var val = "{"+(params[2]||"$v")+"}";
						var key = "{"+(params[3]||"$k")+"}";
						var re = new RegExp("\{\\"+(params[2]||"$v")+"([a-z\.\_\-]+)*\}", "gi");
						var v = "";
						var vr;
						for(var j = 0, maxj = d.length;j<maxj;j++)
						{
							v = blc.replace(val, d[j]);
							while(vr = re.exec(v))
							{
								vr[1] = vr[1].substr(1, vr[1].length-1);
								v = v.replace(vr[0], this._getVariable(vr[1], d[j]));
							}
							v = v.replace(key, j);
							if(typeof d[j] == "string")
							{
								var tmp = d[j];
								d[j] = {};
								d[j][(params[2]||"$v")] = tmp;
							}
							d[j][(params[3]||"$k")] = j;
							v = this._parseBlock(v, d[j], (params[2]||"$v").replace("$", ""));
							r += v;
						}
					}
					else
						r = this._parseBlock(alt, pData, pBaseObject);
					break;
				case "if":
					var f = o[3];
					for(var k in pData)
					{
						if(!pData.hasOwnProperty(k))
							continue;
						var value = pData[k];
						while(f.indexOf(k)>-1)
							f = f.replace(k, value);
					}
					r = eval("(function(){var r = false; try { r = "+f+"; } catch(e){ r= false;} return r;})()");
					r = r?blc:(alt||"");
					r = this._parseBlock(r, pData, pBaseObject);
					break;
				default:
					continue;
					break;
			}

			pString = pString.replace(totalBlock, r);
		}

		re = /\{\$([a-z0-9\.\_\-]+)*\}/i;
		var vars;
		while(vars = re.exec(pString))
			pString = pString.replace(vars[0], this._getVariable(vars[1], pData));

		return pString;
	},
	_getVariable:function(pName, pContext)
	{
		var default_value = "";
		var data = pContext||this._content;
		var re = /([a-z0-9\.\_\-]+)/i;
		var result = re.exec(pName);

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

Template.$ = {};

Template.setup=function()
{
	var templates = document.querySelectorAll('script[type="html/template"]');
	templates.forEach(function(pEl)
	{
		Template.$[pEl.getAttribute("template-id")] = pEl.text;
	});
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