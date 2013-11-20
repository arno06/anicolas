/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 */

function Router()
{
	this._rules = [];
}

Class.define(Router, [Class],
{
	_rules:null,
	_hashChangedHandler:function()
	{
		// suppression du #
		var route = location.hash.substr(1, location.hash.length-1);

		var rule, re, names, values, params, callback, j, maxj, args;
		for(var i = 0, max = this._rules.length;i<max;i++)
		{
			rule = this._rules[i];
			re = rule.regexp;
			names = rule.parameters;
			callback = rule.callback;
			args = [].concat(rule.arguments);
			params = {};

			if(values = re.exec(route))
			{
				if(!callback)
					continue;

				for(j = 0, maxj = names.length; j<maxj;j++)
					params[names[j]] = values[j+1];//values[0] == resultat de la regexp

				args.unshift(route, params);
				callback.apply(null, args);
			}
		}
	},
	addRule:function(pExpected, pHandler, pParameters, pArguments)
	{
		pHandler = pHandler||null;
		pParameters = pParameters||null;

		pExpected = pExpected.replace(Router.CHAR, "\\$1");

		var parameters = [];

		if(pParameters)
		{
			for(var i in pParameters)
			{
				if(!pParameters.hasOwnProperty(i))
					continue;
				pExpected = pExpected.replace("{$"+i+"}", "("+pParameters[i]+")");
				parameters.push(i);
			}
		}

		this._rules.push({"regexp":new RegExp("^"+pExpected+"$"), "parameters":parameters, "callback":pHandler, "arguments":pArguments});
	},
	start:function()
	{
		window.addEventListener("hashchange", this._hashChangedHandler.proxy(this), false);

		this._hashChangedHandler();
	}
});

Router.CHAR = /([\/\\\+\-\.])/g;