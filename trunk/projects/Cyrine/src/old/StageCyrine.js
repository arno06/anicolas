function CyrineSBV1()
{
	this.setup("rgba(0, 0, 0)");
}

Class.define(CyrineSBV1, [Sprite],
{
	setup:function(pColor)
	{
		this.reset();
		this._color = pColor;
		this._mainRadius = 0;
		this._coefLines = [];
		this._coefPoints = [];
		this._internPointsRadius = 0;
		this._coefCenterLine = 0;
		this._rotationCenterLine = 0;
		this._max = 360 / CyrineSBV1.LINE_ANGLE;
		for(var i = 0;i<this._max;i++)
		{
			this._coefPoints.push({value:0});
			this._coefLines.push({value:0});
		}
		this.addEventListener(Event.ADDED_TO_STAGE, M4.proxy(this, this.__addedHandler));
	},
	__addedHandler:function(e)
	{
		this.stage.addEventListener(Event.ENTER_FRAME, M4.proxy(this, this.__frameHandler));
	},
	__frameHandler:function(e)
	{
		this._draw();
	},
	_drawMainCircle:function()
	{
		this.beginFill(this._color+"1)");
		this.drawCircle(0, 0, this._mainRadius);
		this.endFill();
	},
	_drawDetails:function()
	{
		var angle, from, to, c, s, i;


		for(i = 0;i<this._max;i++)
		{
			angle = M4.geom.DEGREE_TO_RADIAN * (i*CyrineSBV1.LINE_ANGLE);
			c = Math.cos(angle);
			s = Math.sin(angle);
			to = {cos:c * (CyrineSBV1.INTER_POINT_RADIUS), sin:s * (CyrineSBV1.INTER_POINT_RADIUS)};
			this.beginFill("rgb(243, 237, 236)");
			this.drawCircle(to.cos, to.sin,this._internPointsRadius);
			this.endFill();
		}

		if(this._coefLines[0].value)
		{
			for(i = 0;i<this._max;i++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * (i*CyrineSBV1.LINE_ANGLE);
				c = Math.cos(angle);
				s = Math.sin(angle);
				from = {cos:c * CyrineSBV1.MAIN_RADIUS, sin:s * CyrineSBV1.MAIN_RADIUS};
				to = {cos:c * (CyrineSBV1.MAIN_RADIUS + (this._coefLines[i].value * CyrineSBV1.LINE_SIZE)), sin:s * (CyrineSBV1.MAIN_RADIUS + (this._coefLines[i].value  * CyrineSBV1.LINE_SIZE))};

				this.setLineStyle(1, this._color+"1)");
				this.moveTo(from.cos, from.sin);
				this.lineTo(to.cos, to.sin);
				this.setLineStyle(null);
			}
			for(i = this._max-1,j = 0;i>=0;i--,j++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * (i*CyrineSBV1.LINE_ANGLE);
				c = Math.cos(angle);
				s = Math.sin(angle);
				to = {cos:c * (CyrineSBV1.EXTERN_POINT_RADIUS), sin:s * (CyrineSBV1.EXTERN_POINT_RADIUS)};
				this.beginFill(this._color+this._coefPoints[j].value+")");
				this.drawCircle(to.cos, to.sin,.8);
				this.endFill();
			}
		}
	},
	_draw:function()
	{
		this.clear();
		this._drawMainCircle();
		this._drawDetails();
	}
});

CyrineSBV1.CENTER_LINE_SIZE = 41;
CyrineSBV1.LINE_ANGLE = 1.8;
CyrineSBV1.MAIN_RADIUS = 59;
CyrineSBV1.LINE_SIZE = 13;
CyrineSBV1.EXTERN_POINT_RADIUS = 83;
CyrineSBV1.INTER_POINT_RADIUS = 54;

function LogoV1()
{
	this.setup("rgba(204, 117, 98,");
	this._coefCenterLine = 0;
	this._rotationCenterLine = 0;
	this._textInfos = {alpha:0, cw:{from:-45, distance:15}, mg:{from:34, distance:-15}};
}

Class.define(LogoV1, [CyrineSBV1],
{
	_draw:function()
	{
		this.clear();
		this._drawMainCircle();
		this._drawDetails();

		if(this._coefCenterLine)
		{
			var distance = 360 / 90;
			for(i = 0;i<distance;i++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * ((this._rotationCenterLine-45)+(i * 90));
				c = Math.cos(angle);
				s = Math.sin(angle);
				this.setLineStyle(2, "rgb(243, 237, 236)");
				this.moveTo(0, 0);
				this.lineTo(c * (this._coefCenterLine * CyrineSBV1.CENTER_LINE_SIZE), s*(this._coefCenterLine * CyrineSBV1.CENTER_LINE_SIZE));
			}
		}
		if(this._textInfos.alpha)
		{
			var a = this._textInfos.alpha;
			this.setFont("DinReg", 11, "rgba(243, 237, 236, "+a+")");
			this.drawText("C", -5, this._textInfos.cw.from + (this._textInfos.cw.distance * a));
			this.drawText("M", this._textInfos.mg.from + (this._textInfos.mg.distance * a), -5);
			this.drawText("G", -5, this._textInfos.mg.from + (this._textInfos.mg.distance * a));
			this.drawText("W", this._textInfos.cw.from + (this._textInfos.cw.distance * a), -5);
		}
	},
	helloWorld:function()
	{
		var f, t;
		var ref = this;
		M4Tween.killTweensOf(this);
		M4Tween.to(this,.6, {useStyle:false, _mainRadius:CyrineSBV1.MAIN_RADIUS})
		.onComplete(function()
		{
			for(var i = 0;i<ref._max;i++)
			{
				if(i==20)
					f = M4Tween.to(ref._coefLines[i],.3, {useStyle:false, value:1, delay:i *0.01});
				else
					t = M4Tween.to(ref._coefLines[i],.3, {useStyle:false, value:1, delay:i *0.01});
			}
			f.onComplete(function()
			{
				for(var j = 0;j<ref._max;j++)
				{
					var r = M4Tween.to(ref._coefPoints[j],.3, {useStyle:false, value:1, delay:j *0.01});
					if(j==ref._max-1)
					{
						r.onComplete(function()
						{
							ref.stage.pause();
						});
					}
				}
			});
			M4Tween.to(ref,.4, {useStyle:false, _coefCenterLine:1, _internPointsRadius:.5}).onComplete(function()
			{
				M4Tween.to(ref,.3, {useStyle:false, _rotationCenterLine:90})
				.onComplete(function()
				{
					M4Tween.to(ref._textInfos,.3, {useStyle:false, alpha:1});
				});
			});
		});
	}
});

function TopV1()
{
	this.setup("rgba(80, 182, 158,");
	this._textInfo = {alpha:0, tp:{value:-52}, o:{value:12}};
}

Class.define(TopV1, [CyrineSBV1],
{
	_draw:function()
	{
		this.clear();
		this._drawMainCircle();
		this._drawDetails();

		var a = this._textInfo.alpha;
		this.setFont("Dosis", "32px", "rgba(243, 237, 236, "+a+")");
		this.drawText("T", -26, this._textInfo.tp.value);
		this.drawText("O", -9, this._textInfo.o.value);
		this.drawText("P", 10, this._textInfo.tp.value);
	},
	helloWorld:function()
	{
		var f, t;
		var ref = this;
		M4Tween.killTweensOf(this);
		M4Tween.to(this,.6, {useStyle:false, _mainRadius:CyrineSBV1.MAIN_RADIUS})
		.onComplete(function()
		{
			for(var i = 0;i<ref._max;i++)
			{
				if(i==20)
					f = M4Tween.to(ref._coefLines[i],.3, {useStyle:false, value:1, delay:i *0.01});
				else
					t = M4Tween.to(ref._coefLines[i],.3, {useStyle:false, value:1, delay:i *0.01});
			}
			f.onComplete(function()
			{
				for(var j = 0;j<ref._max;j++)
				{
					var r = M4Tween.to(ref._coefPoints[j],.3, {useStyle:false, value:1, delay:j *0.01});
					if(j==ref._max-1)
					{
						r.onComplete(function()
						{
							ref.stage.pause();
						});
					}
				}
			});
			M4Tween.to(ref._textInfo,.4, {useStyle:false, alpha:1});
			M4Tween.to(ref._textInfo.tp,.4, {useStyle:false, value:-20});
			M4Tween.to(ref._textInfo.o,.4, {useStyle:false, value:-20});
		});
	}
});