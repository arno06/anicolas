var Main =
{
	slider:null,
	init:function()
	{
		var logoStage =  new Stage(136, 136, document.querySelector("header menu li.logo"));
		var logo = new Logo();
		logo.x = 68;
		logo.y = 68;
		logoStage.addChild(logo);
		logo.helloWorld();
		document.querySelectorAll(".skill").forEach(function(element){new Skill(element);});
		Main.slider = new Slider("#crea_graph .frame ul:first-child li", null, {transitionTime:.5});
		Main.slider.addControls("#crea_graph .frame ul:last-child li", "current");
		document.querySelectorAll("#crea_graph .arrows div").forEach(function(el)
		{
			el.addEventListener("click", function()
			{
				switch(el.className)
				{
					case "next":
						Main.slider.next();
						break;
					case "previous":
						Main.slider.previous();
						break;
				}
			}, false);
		});
		document.querySelectorAll(".portfolio h4").each(function(pH4)
		{
			pH4.addEventListener("click", Main.portfolio.h4ClickHandler, false);
		});
	},
	portfolio:
	{
		h4ClickHandler:function(e)
		{
			e.preventDefault();
			e.stopPropagation();
			document.querySelectorAll(".portfolio .open").each(function(d)
			{
				d.removeAttribute("class");
			});
			e.currentTarget.parentNode.setAttribute("class", "open");
		}
	}
};

NodeList.prototype.forEach = Array.prototype.forEach;

window.addEventListener("load", Main.init);

function SpriteCM()
{
	this.setup("rgba(0, 0, 0)");
}

Class.define(SpriteCM, [Sprite],
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
		this._max = 360 / SpriteCM.LINE_ANGLE;
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
			angle = M4.geom.DEGREE_TO_RADIAN * (i*SpriteCM.LINE_ANGLE);
			c = Math.cos(angle);
			s = Math.sin(angle);
			to = {cos:c * (SpriteCM.INTER_POINT_RADIUS), sin:s * (SpriteCM.INTER_POINT_RADIUS)};
			this.beginFill("rgb(243, 237, 236)");
			this.drawCircle(to.cos, to.sin,this._internPointsRadius);
			this.endFill();
		}

		if(this._coefLines[0].value)
		{
			for(i = 0;i<this._max;i++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * (i*SpriteCM.LINE_ANGLE);
				c = Math.cos(angle);
				s = Math.sin(angle);
				from = {cos:c * SpriteCM.MAIN_RADIUS, sin:s * SpriteCM.MAIN_RADIUS};
				to = {cos:c * (SpriteCM.MAIN_RADIUS + (this._coefLines[i].value * SpriteCM.LINE_SIZE)), sin:s * (SpriteCM.MAIN_RADIUS + (this._coefLines[i].value  * SpriteCM.LINE_SIZE))};

				this.setLineStyle(1, this._color+"1)");
				this.moveTo(from.cos, from.sin);
				this.lineTo(to.cos, to.sin);
				this.setLineStyle(null);
			}
			for(i = this._max-1,j = 0;i>=0;i--,j++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * (i*SpriteCM.LINE_ANGLE);
				c = Math.cos(angle);
				s = Math.sin(angle);
				to = {cos:c * (SpriteCM.EXTERN_POINT_RADIUS), sin:s * (SpriteCM.EXTERN_POINT_RADIUS)};
				this.beginFill(this._color+this._coefPoints[j].value+")");
				this.drawCircle(to.cos, to.sin, SpriteCM.EXTERN_POINT_SIZE);
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

SpriteCM.CENTER_LINE_SIZE = 33;
SpriteCM.LINE_ANGLE = 360/72;
SpriteCM.MAIN_RADIUS = 50;
SpriteCM.LINE_SIZE = 12;
SpriteCM.EXTERN_POINT_RADIUS = 66;
SpriteCM.INTER_POINT_RADIUS = 47;
SpriteCM.EXTERN_POINT_SIZE = 1;
SpriteCM.INTERN_POINT_SIZE = 1;

function Logo()
{
	this.setup("rgba(205, 117, 98,");
	this._coefCenterLine = 0;
	this._rotationCenterLine = 0;
	this._linePositionCoef = 0;
	this._imgAlpha = 0;
	this.img = document.querySelector("#head");
	this._textInfos = {alpha:0, cw:{from:-45, distance:15}, mg:{from:34, distance:-15}};
}

Class.define(Logo, [SpriteCM],
{
	_draw:function()
	{
		this.clear();
		this._drawMainCircle();
		this._drawDetails();

		if(this._coefCenterLine)
		{
			var coefImg = .5;
			var x = -((this.img.width *coefImg)>>1);
			var y = -((this.img.height *coefImg)>>1);
			this.drawImage(this.img, new Rectangle(0, 0, this.img.width, this.img.height), new Rectangle(x, y, this.img.width*coefImg, this.img.height*coefImg));

			this.beginFill(this._color+(1-this._imgAlpha)+")");
			this.drawCircle(0, 0, 30);
			this.endFill();

			var angle, distance = 360 / 90;
			for(i = 0;i<distance;i++)
			{
				angle = M4.geom.DEGREE_TO_RADIAN * ((this._rotationCenterLine-45)+(i * 90));
				c = Math.cos(angle);
				s = Math.sin(angle);
				this.setLineStyle(1, "rgb(243, 237, 236)");
				this.moveTo(c * (this._linePositionCoef * 12), s * (this._linePositionCoef * 12));
				this.lineTo(c * (this._coefCenterLine * SpriteCM.CENTER_LINE_SIZE), s*(this._coefCenterLine * SpriteCM.CENTER_LINE_SIZE));
			}
		}

		if(this._textInfos.alpha)
		{
			var a = this._textInfos.alpha;
			this.setFont("DinReg", "10px", "rgba(243, 237, 236, "+a+")");
			this.drawText("C", -3, this._textInfos.cw.from + (this._textInfos.cw.distance * a) + 2);
			this.drawText("M", this._textInfos.mg.from + (this._textInfos.mg.distance * a)-2, -7);
			this.drawText("G", -3, this._textInfos.mg.from + (this._textInfos.mg.distance * a) - 6);
			this.drawText("W", this._textInfos.cw.from + (this._textInfos.cw.distance * a)+6, -7);
		}
	},
	helloWorld:function()
	{
		var f, t;
		var ref = this;
		M4Tween.killTweensOf(this);
		M4Tween.to(this,.6, {useStyle:false, _mainRadius:SpriteCM.MAIN_RADIUS})
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
			M4Tween.to(ref,.4, {useStyle:false, _coefCenterLine:1, _internPointsRadius:SpriteCM.INTERN_POINT_SIZE}).onComplete(function()
			{
				M4Tween.to(ref,.3, {useStyle:false, _rotationCenterLine:90, _linePositionCoef:1})
				.onComplete(function()
				{
					M4Tween.to(ref,.3, {useStyle:false, _imgAlpha:1});
					M4Tween.to(ref._textInfos,.3, {useStyle:false, alpha:1});
				});
			});
		});
	}
});


function Skill(pEl)
{
	this.parent = pEl;
	this.value = this.parent.dataset.value;
	this.name = this.parent.dataset.name;
	this.color = this.parent.dataset.color||"rgb(0, 0, 0)";
	this.debug = this.parent.dataset.debug||false;
	this.stage = new Stage(Skill.OUTSIDE_RADIUS<<1, Skill.OUTSIDE_RADIUS<<1, this.parent);
	this.coef = 0;

	this.startAngle = -90;

	if(this.debug)
		this.stage.addChild(new FPS());

	this.htmlValue = M4.createElement("div", {"class":"value"});
	this.parent.appendChild(this.htmlValue);
	this.htmlName = M4.createElement("div", {"class":"name", "text":this.name});
	this.parent.appendChild(this.htmlName);

	this.draw();

	this.helloWorld();
}

Class.define(Skill, [Class],
{
	draw:function()
	{
		var center = new Vector(Skill.OUTSIDE_RADIUS, Skill.OUTSIDE_RADIUS);

		var currentAngle = this.coef *(360 * (this.value/100));
		var radius = Skill.INSIDE_RADIUS+((Skill.OUTSIDE_RADIUS - Skill.INSIDE_RADIUS)>>1);
		var angle = (((currentAngle) + this.startAngle)-Skill.THIRDPOINT_ANGLE) * M4.geom.DEGREE_TO_RADIAN;
		var p = new Vector(center.x+(radius * Math.cos(angle)), center.y+(radius * Math.sin(angle)));
		this.stage.clear();
		this.stage.beginFill(Skill.BACKGROUND_COLOR);
		this.stage.drawArc(center.x, center.y, Skill.OUTSIDE_RADIUS, 0, 360);
		this.stage.drawArc(center.x, center.y, Skill.INSIDE_RADIUS, 360, 0, true);
		this.stage.endFill();
		this.stage.beginFill(this.color);
		this.stage.drawArc(center.x, center.y, Skill.OUTSIDE_RADIUS, this.startAngle, currentAngle + this.startAngle);
		this.stage.lineTo(p.x, p.y);
		this.stage.drawArc(center.x, center.y, Skill.INSIDE_RADIUS, currentAngle + this.startAngle, this.startAngle, true);
		this.stage.endFill();
		this.htmlValue.innerHTML = Math.round(this.coef * this.value)+"<span>%</span>";
		if(this.coef === 1)
			this.stage.pause();
	},
	helloWorld:function()
	{
		var ano = M4.proxy(this, this.draw);
		M4Tween.to(this, 2 * (this.value/100), {coef:1, useStyle:false}).onUpdate(ano).onComplete(ano);
	}
});

Skill.OUTSIDE_RADIUS = 56;
Skill.INSIDE_RADIUS = 48;
Skill.THIRDPOINT_ANGLE = 4;
Skill.BACKGROUND_COLOR = "rgb(191, 191, 191)";