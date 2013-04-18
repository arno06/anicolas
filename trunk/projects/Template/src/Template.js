function Template(pIdTemplate)
{
	this._content = [];
	this._id = pIdTemplate;
}

Class.define(Template, [],
{
	_content:{},
	assign:function(pName, pValue)
	{
		if((typeof pValue) != "object")
			this._content["$"+pName] = pValue;
		else
		{
			this._content["$"+pName] = pValue;
			for(var i in pValue)
			{
				if(!pValue.hasOwnProperty(i))
					continue;
				this.assign(pName+"."+i, pValue[i]);
			}
		}
	},
	render:function(pParentNode)
	{
		var p = document.querySelector(pParentNode);
		if(!p)
			return;
		p.innerHTML += this.evaluate();

	},
	evaluate:function()
	{
		var t = Template.$[this._id];
		if(!t)
			return;
		return this._parseBlock(t, this._content);
	},
	_parseBlock:function(pString, pData, pBaseObject)
	{
		var reg = /\{foreach([^\}]*)\}\s*(.*)\s*(\{else\}\s*(.*)\s*)*\{\/foreach\}/i;
		var result, r, s, item, d, re, val, key, v, vr;
		while(result = reg.exec(pString))
		{
			r = "";//Replacement
			s = result[1].split(" ");//Setup [*, tablename, itemname, keyname]
			item = result[2];
			if(pBaseObject&&pBaseObject.length)
				s[1]= s[1].replace("$"+pBaseObject+".", "");
			d = pData[s[1]];
			if(d && d.length)
			{
				val = "{"+(s[2]||"$v")+"}";
				key = "{"+(s[3]||"$k")+"}";
				re = new RegExp("\{\\"+(s[2]||"$v")+"\.([a-z]*)\}", "i");
				v = "";
				for(var j = 0, maxj = d.length;j<maxj;j++)
				{
					v = item.replace(val, d[j]);
					while(vr = re.exec(v))
						v = v.replace(vr[0], d[j][vr[1]]);
					v = v.replace(key, j);
					if(typeof d[j] == "string")
					{
						var tmp = d[j];
						d[j] = {};
						d[j][(s[2]||"$v")] = tmp;
					}
					d[j][(s[3]||"$k")] = j;
					v = this._parseBlock(v, d[j], (s[2]||$v).replace("$", ""));
					r += v;
				}
			}
			else
				r = result[4]||"";

			pString = pString.replace(result[0], r);
		}

		reg = /\{if([^\}]*)\}\s*([^\{]*)\s*(\{else\}\s*([^\{]*)\s*)*\{\/if\}/i;
		while(result = reg.exec(pString))
		{
			s = result[1];
			for(var k in pData)
			{
				if(!pData.hasOwnProperty(k))
					continue;
				value = pData[k];
				while(s.indexOf(k)>-1)
					s = s.replace(k, value);
			}
			r = eval(s);
			item = result[2];
			pString = pString.replace(result[0], r?item:(result[4]||""));
		}

		var value;
		for(var i in pData)
		{
			if(!pData.hasOwnProperty(i))
				continue;
			value = pData[i];
			i = "{"+i+"}";
			while(pString.indexOf(i)>-1)
				pString = pString.replace(i, value);
		}
		return pString;
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