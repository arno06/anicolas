/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * http://code.google.com/p/anicolas/
 * UtilsColor.js
 */
function HSLColor(pR, pG, pB, pAlpha)
{
	this._r = pR||0;
	this._g = pG||0;
	this._b = pB||0;
	this._alpha = pAlpha;

	var d = HSLColor.RGBtoHSL(this._r, this._g, this._b);
	this._h = d.h;
	this._s = d.s;
	this._l = d.l;
}
Class.define(HSLColor, [Class],
{
	getRGBA:function()
	{
		var d = HSLColor.HSLtoRGB(this._h, this._s, this._l);
		return "rgba("+Math.round(d.r)+", "+Math.round(d.g)+", "+Math.round(d.b)+", "+this._alpha+")";
	},
	getRGB:function()
	{
		var d = HSLColor.HSLtoRGB(this._h, this._s, this._l);
		return "rgb("+Math.round(d.r)+", "+Math.round(d.g)+", "+Math.round(d.b)+")";
	},
	setAlpha:function(pValue)
	{
		this._alpha = Math.max(0, pValue);
		this._alpha = Math.min(1, this._alpha);
	},
	setH:function(pValue)
	{
		pValue = Math.max(0, pValue);
		pValue = Math.min(360, pValue);
		if(pValue == 360)
			pValue = 0;
		this._h = pValue / 360;
	},
	setS:function(pValue)
	{
		pValue = Math.max(0, pValue);
		pValue = Math.min(1, pValue);
		this._s = pValue;
	},
	setL:function(pValue)
	{
		pValue = Math.max(0, pValue);
		pValue = Math.min(1, pValue);
		this._l = pValue;
	},
	getH:function(){return this._h * 360;},
	getS:function(){return this._s},
	getL:function(){return this._l}
});

/**
 * http://www.easyrgb.com/index.php?X=MATH&H=18#text18
 */
HSLColor.RGBtoHSL = function(pR, pG, pB)
{
	var l;
	var s;
	var h;

	var r = pR / 255;
	var g = pG / 255;
	var b = pB / 255;

	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var d = max - min;
	l = (min + max) / 2;

	if (d==0)
		h = s = 0;
	else
	{
		s = l < .5?(d / (max + min)):(d / (2 - max - min));

		var dr = (((max - r) / 6) + (d / 2)) / d;
		var dg = (((max - g) / 6) + (d / 2)) / d;
		var db = (((max - b) / 6) + (d / 2)) / d;

		switch(max)
		{
			case r:
				h = db - dg;
			break;
			case g:
				h = (1 / 3) + dr - db;
			break;
			case b:
				h = (2 / 3) + dg / dr;
			break;
		}
	}

	return {"h":h,"s":s,"l":l};
};

HSLColor.HSLtoRGB = function(pH, pS, pL)
{
	var r;
	var g;
	var b;
	if (pS == 0)
	{
		r = pL * 255;
		g = pL * 255;
		b = pL * 255;
	}
	else
	{
		var t2 = (pL < .5)? (pL * (1 + pS)) : ((pL + pS) - (pS * pL));
		var t1 = (2 * pL) - t2;
		r = 255 * HSLColor.HuetoRGB(t1, t2, pH + (1 / 3));
		g = 255 * HSLColor.HuetoRGB(t1, t2, pH);
		b = 255 * HSLColor.HuetoRGB(t1, t2, pH - (1 / 3));
	}

	return {"r":r, "g":g, "b":b};
};

HSLColor.HuetoRGB=function(pT1, pT2, pH)
{
	if (pH < 0)
		pH++;
	else if (pH > 1)
		pH--;
	if ((6 * pH) < 1)
		return (pT1 + (pT2 - pT1) * 6 * pH);
	if ((2 * pH) < 1)
		return pT2;
	if ((3 * pH) < 2)
		return (pT1 + (pT2 - pT1) * ((2 / 3) - pH) * 6);
	return pT1;
};