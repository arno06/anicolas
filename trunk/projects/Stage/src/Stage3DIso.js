function IsoVector(pX, pY, pZ)
{
	this.x = pX||0;
	this.y = pY||0;
	this.z = pZ||0;
}
Class.define(IsoVector, [Vector],
{
	applyRotation:function(pDistance, pOrigine)
	{
		if (!pOrigine)
			pOrigine = new Vector();
		var d = M4.geom.get2DDistance(new Vector(this.x, this.y), pOrigine);
		var m = new Vector((this.x - pOrigine.x) / d, (this.y - pOrigine.y) / d);
		var c = Math.acos(m.x);
		var s = Math.asin(m.y);
		var a = c * (180 / Math.PI);
		if (s < 0)
			a = 360 - a;
		a += pDistance;
		var r = a * (Math.PI / 180);
		this.x = pOrigine.x + Math.cos(r) * d;
		this.y = pOrigine.y + Math.sin(r) * d;
	},
	getProjection:function()
	{
		return new Vector((IsoVector.C1) * (this.x - this.y), -((IsoVector.C2 * this.z) - (IsoVector.C3 * (this.x + this.y))));
	},
	toString:function()
	{
		return this.formatToString("x", "y", "y");
	}
});
M4.geom.get2DDistance = function(pPoint1, pPoint2)
{
	var dx = pPoint1.x - pPoint2.x;
	var dy = pPoint1.y - pPoint2.y;
	return Math.sqrt((dx * dx) + (dy * dy));
};
M4.geom.getIsoDIstance = function(pPoint1, pPoint2)
{
	var dx = pPoint1.x - pPoint2.x;
	var dy = pPoint1.y - pPoint2.y;
	var dz = pPoint1.z - pPoint2.z;
	return Math.sqrt((dx * dx) + (dy * dy)+ (dz * dz));
};

IsoVector.C1 = Math.sqrt(2) / 2;
IsoVector.C2 = Math.sqrt(2 / 3);
IsoVector.C3 = 1 / Math.sqrt(6);

function IsoShape(pColor, pLight)
{
	this.reset();
	this._distance = 0;
	this._rotationY = 0;
	this.color = pColor||"rgb(127, 0, 0)";
	this._material = new IsoMaterial(this.color);
	this._light = pLight;
	this._light.addEventListener(IsoLightEvent.UPDATED, this.update.proxy(this));
	this.addEventListener(Event.ADDED_TO_STAGE, this.update.proxy(this));
}

Class.define(IsoShape, [Sprite],
{
	fromPoint:function(pPoint)
	{
		this._points = [pPoint];
	},
	addPoint:function(pPoint)
	{
		if (!this._points.length)
			throw new Error("Le premier appel de la méthode 'addPoint' doit être précédé de la méthode 'fromPoint'");
		this._points.push(pPoint);
	},
	setPoints:function()
	{
		this._points = arguments;
	},
	getRotationY:function()
	{
		return this._rotationY;
	},
	setRotationY:function(pValue)
	{
		this._distance = pValue - this._rotationY;
		this._rotationY = pValue;
		for (var i = 0, max = this._points.length; i < max; i++)
			this._points[i].applyRotation(this._distance, new Vector());
		this.update();
	},
	update:function()
	{
		this.clear();
		if(!this._points.length)
			return;
		this.beginFill(this._material.apply(this._light, this.getBarycentre()));
		var proj = this._points[0].getProjection();
		this.moveTo(proj.x, proj.y);
		for (var i = 1, max = this._points.length; i < max; i++)
		{
			proj = this._points[i].getProjection();
			this.lineTo(proj.x, proj.y);
		}
		this.endFill();
	},
	getBarycentre:function()
	{
		var b = new IsoVector();
		for (var i = 0, max = this._points.length; i < max; i++)
		{
			b.x += this._points[i].x;
			b.y += this._points[i].y;
			b.z += this._points[i].z;
		}
		b.x /= max;
		b.y /= max;
		b.z /= max;
		return b;
	},
	toString:function()
	{
		return this.formatToString("x", "y", "z", "_rotationY", "_distance");
	}
});

function IsoCube()
{

}

Class.define(IsoCube, [Container],
{

});

function IsoLight(pX, pY, pZ, pRange)
{
	this.x = pX||0;
	this.y = pY||0;
	this.z = pZ||0;
	this._range = pRange||100;
}

Class.define(IsoLight, [IsoVector, EventDispatcher],
{
	setRange:function(pValue)
	{
		this._range = pValue;
		this.dispatchEvent(new IsoLightEvent(IsoLightEvent.UPDATED));
	},
	setX:function(pValue)
	{
		this.x = pValue;
		this.dispatchEvent(new IsoLightEvent(IsoLightEvent.UPDATED));
	},
	setY:function(pValue)
	{
		this.y = pValue;
		this.dispatchEvent(new IsoLightEvent(IsoLightEvent.UPDATED));
	},
	setZ:function(pValue)
	{
		this.z = pValue;
		this.dispatchEvent(new IsoLightEvent(IsoLightEvent.UPDATED));
	},
	getRange:function()
	{
		return this._range;
	},
	toString:function()
	{
		return this.formatToString("x", "y", "z", "_range");
	}
});

/**
 * Simple Color Material
 * @param pColor    rgb() or rgba() both are accepted
 * @constructor
 */
function IsoMaterial(pColor)
{
	var r = /rgb\(([0-9]+),\s*([0-9]+),\s*([0-9]+)\)/.exec(pColor);
	if(!r||!r.length)
		r = /rgba\(([0-9]+),\s*([0-9]+),\s*([0-9]+),\s*([0-9]*\.*[0-9]+)\)/.exec(pColor);
	else
		r.push("1");
	if(!r||!r.length)
		r = ["255", "0", "0", "1"];
	this._r = Number(r[1]);
	this._g = Number(r[2]);
	this._b = Number(r[3]);
	this._alpha = Number(r[4]);
}

Class.define(IsoMaterial, [Class],
{
	/**
	 * Too stupid and lazy to do it right, don't judge me
	 */
	apply:function(pLight, pBary)
	{
		var c = new HSLColor(this._r, this._g, this._b, this._alpha);
		var d = M4.geom.getIsoDIstance(pLight, pBary);
		var min = 0;
		var max = pLight.getRange();
		var dm = max - min;
		var dv = d - min;
		var p = dm / dv;
		p = Math.min(1, Math.max(0, p));
//		c.setL(c.getL() + (.35 * p));
		c.setL(p);
		return c.getRGB();
	}
});

function IsoLightEvent(pType, pBubbles)
{
	this.type = pType;
	this.bubbles = pBubbles||false;
	this.eventPhase = Event.AT_TARGET;
}

Class.define(IsoLightEvent, [Event],{});
IsoLightEvent.UPDATED = "evt_isolight_updated";