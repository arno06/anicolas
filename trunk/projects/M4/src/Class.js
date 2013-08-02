function Class(){}

Class.prototype = {
	super:function(pMethodName)
	{
		pMethodName = pMethodName||"constructor";
		if(!this.__SUPER__||!this.__SUPER__[pMethodName])
			throw new Error("Method '"+pMethodName+"' undefined");
		var args = [];
		for(var i = 1, max = arguments.length;i<max;i++)
			args.push(arguments[i]);
		var func;
		if(this[pMethodName]&&this[pMethodName]==this.__SUPER__[pMethodName])
			func = this.__SUPER__.__SUPER__[pMethodName].proxy(this);
		else
			func = this.__SUPER__[pMethodName].proxy(this);
		return func.apply(this, args);
	},
	toString : function()
	{
		return this.formatToString();
	},
	formatToString : function()
	{
		var t = /^function ([a-z][a-z0-9_]*)\(/i.exec(this.constructor.toString());
		var s = "[Object "+t[1];
		for(var i=0, max = arguments.length;i<max;i++)
			s+= " "+arguments[i]+"=\""+this[arguments[i]]+"\"";
		return s+"]";
	}
};

Class.extend = function(pTarget, pClassParent)
{
	for(var i in pClassParent.prototype)
	{
		pTarget.prototype[i] = pClassParent.prototype[i];
	}
	pTarget.prototype.__SUPER__ = pClassParent.prototype;
};
Class.define = function(pTarget, pExtends, pPrototype)
{
	if(pExtends.length>0)
	{
		for(var i = 0, max=pExtends.length; i<max; i++)
			Class.extend(pTarget, pExtends[i]);
	}
	for(var k in pPrototype)
		pTarget.prototype[k] = pPrototype[k];
};