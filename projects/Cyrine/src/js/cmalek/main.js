/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * http://code.google.com/p/anicolas/
 * main.js
 */
var Main =
{
	logo:null,
	scene:{width:0, height:0},
	slider:null,
	sliders:{
		"crea_graph":{},
		"motion_des":{},
		"crea_perso":{}
	},
	skills:[],
	init:function()
	{

		Scroll.to(document.querySelector("#home"));
		var loader = document.querySelector("#loader");
		Main.scene.width = loader.offsetWidth;
		Main.scene.height = loader.offsetHeight;

		Scroll.setup();
		var logoStage =  new Stage(136, 136, document.querySelector("header menu li.logo"));
		Main.logo = new Logo();
		Main.logo.x = 68;
		Main.logo.y = 68;
		logoStage.addChild(Main.logo);

		var topStage = new Stage(180, 210, document.querySelector(".scene.contact .top"));
		topStage.addEventListener("click", function(e){Scroll.to(document.querySelector("#home"));}, false);
		Main.top = new Top();
		Main.top.x = 90;
		Main.top.y = 120;
		topStage.addChild(Main.top);

		document.querySelectorAll(".skill").forEach(function(element){Main.skills.push(new Skill(element));});

		var s;
		for(var i in Main.sliders)
		{
			Main.sliders[i] = new Slider("#"+i+" .frame>div img", "Touch", {transitionTime:.5});
			s = Main.sliders[i];
			s.addControls("#"+i+" .frame ul li", "current");
			document.querySelectorAll("#"+i+" .arrows div").forEach(function(el)
			{
				el.dataset.referrer = i;
				el.addEventListener("click", function(e)
				{
					var ref = e.currentTarget.dataset.referrer;
					var slider = Main.sliders[ref];
					switch(el.className)
					{
						case "next":
							slider.next();
							break;
						case "previous":
							slider.previous();
							break;
					}
				}, false);
			});
		}
		Scroll.prepareAll(".portfolio h4");
		document.querySelectorAll(".portfolio h4").each(function(pH4)
		{
			pH4.addEventListener("click", Main.portfolio.h4ClickHandler, false);
		});

		document.querySelector("#crea_graph").classList.add("open");
		Main.slider = Main.sliders.crea_graph;
		window.addEventListener("keydown", Main.keyDownHandler, false);


		ScrollAnimator.add(".scene.scrolldown").animateFrom(90).animateTo(220).addProp("top", "px", 290, 100);
		ScrollAnimator.add(".scene.scrolldown .a1").animateFrom(90).animateTo(220).addProp("top", "px", 391, 291);
		ScrollAnimator.add(".scene.scrolldown .a2").animateFrom(90).animateTo(220).addProp("top", "px", 405, 280);

		/**
		 * Skills Arrow and shit
		 */
		var trigger = [151, 251, 351, 451, 551];
		ScrollAnimator.add(".scene.skills>div.lvl_3.even").animateFrom(trigger[0]).animateTo(trigger[0]).addProp("paddingRight", "px", 306, 371).addProp("opacity", null, 0, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_3.even>div.little_top").animateFrom(trigger[0]).animateTo(trigger[0]).addProp("top", "px", 40, 60);
		ScrollAnimator.add(".scene.skills>div.lvl_3.even>div.little_right").animateFrom(trigger[0]).animateTo(trigger[0]).addProp("marginLeft", "px", 23, 3);
		ScrollAnimator.add(".scene.skills>div.lvl_5").animateFrom(trigger[1]).animateTo(trigger[1]).addProp("paddingLeft", "px", 256, 321).addProp("opacity", null, 0, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_5>div.little_top").animateFrom(trigger[1]).animateTo(trigger[1]).addProp("top", "px", 40, 60);
		ScrollAnimator.add(".scene.skills>div.lvl_5>div.little_left").animateFrom(trigger[1]).animateTo(trigger[1]).addProp("marginLeft", "px", -36, -16);
		ScrollAnimator.add(".scene.skills>div.lvl_5>div.big_top").animateFrom(trigger[1]).animateTo(trigger[1]).addProp("top", "px", -20, 21);
		ScrollAnimator.add(".scene.skills>div.lvl_4.even").animateFrom(trigger[2]).animateTo(trigger[2]).addProp("paddingRight", "px", 207, 272).addProp("opacity", null, 0, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_4.even>div.big_right").animateFrom(trigger[2]).animateTo(trigger[2]).addProp("marginLeft", "px", 44, 3);
		ScrollAnimator.add(".scene.skills>div.lvl_4.even>div.little_left").animateFrom(trigger[2]).animateTo(trigger[2]).addProp("marginLeft", "px", -36, -16);
		ScrollAnimator.add(".scene.skills>div.lvl_2").animateFrom(trigger[3]).animateTo(trigger[3]).addProp("paddingLeft", "px", 327, 382).addProp("opacity", null, 0, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_2>div.little_right").animateFrom(trigger[3]).animateTo(trigger[3]).addProp("marginLeft", "px", 23, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_2>div.little_top").animateFrom(trigger[3]).animateTo(trigger[3]).addProp("top", "px", 40, 60);
		ScrollAnimator.add(".scene.skills>div.lvl_1.even").animateFrom(trigger[4]).animateTo(trigger[4]).addProp("paddingRight", "px", 361, 437).addProp("opacity", null, 0, 1);
		ScrollAnimator.add(".scene.skills>div.lvl_1.even>div.little_left").animateFrom(trigger[4]).animateTo(trigger[4]).addProp("marginLeft", "px", -36, -16);
		ScrollAnimator.add(".scene.skills>div.lvl_1.even>div.little_top").animateFrom(trigger[4]).animateTo(trigger[4]).addProp("top", "px", 40, 60);
		ScrollAnimator.add(".scene.skills").animateTo(651).addProp("height", "px", 0, 956);

		/**
		 * About Brigritte and co
		 */
		var above = {from:1000, to:1100};
		var below = {from:900, to:1000};
		ScrollAnimator.add("#about h3").animateFrom(700).animateTo(900).addProp("top", "px", 250, 0);
		ScrollAnimator.add("#about menu.social").animateFrom(800).animateTo(1000).addProp("top", "px", 358, 68).addProp("right", "px", 100, 0).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about menu.social li a.pinterest").animateFrom(800).animateTo(1000).addProp("marginLeft", "px", 112, 12);
		ScrollAnimator.add("#about menu.social li a.linkedin").animateFrom(800).animateTo(1000).addProp("marginLeft", "px", 112, 12);
		ScrollAnimator.add("#about menu.social li a.viadeo").animateFrom(800).animateTo(1000).addProp("marginLeft", "px", 112, 12);
		ScrollAnimator.add("#about menu.social li a.flicker").animateFrom(800).animateTo(1000).addProp("marginLeft", "px", 112, 12);
		ScrollAnimator.add("#about .brigitte").animateFrom(900).animateTo(1100).addProp("height", "px", 1090, 740);
		ScrollAnimator.add("#about>div.content").animateFrom(1100).animateTo(1300).addProp("top", "px", 505, 115).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about>div.content h1").animateFrom(1100).animateTo(1300).addProp("marginBottom", "px", 250, 0);
		ScrollAnimator.add("#about>div.content h4.current").animateFrom(1100).animateTo(1300).addProp("marginBottom", "px", 250, 30);
		ScrollAnimator.add("#about .a1.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", -100, -60).addProp("top", "px", 250, 220).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a1.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", -100, -60).addProp("top", "px", 250, 220).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a2.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", -110, -80).addProp("top", "px", 136, 156).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a2.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", -110, -80).addProp("top", "px", 140, 160).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a3.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", -56, -26).addProp("top", "px", 0, 30).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a3.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", -60, -30).addProp("top", "px", 0, 30).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a4.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", 46, 51).addProp("top", "px", 10, 40).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a4.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", 45, 50).addProp("top", "px", 10, 40).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a5.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", 112, 92).addProp("top", "px", -10, 10).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a5.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", 110, 90).addProp("top", "px", -6, 14).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a6.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", 159, 129).addProp("top", "px", 21, 51).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a6.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", 155, 125).addProp("top", "px", 24, 54).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a7.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", 165, 135).addProp("top", "px", 150, 154).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a7.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", 165, 135).addProp("top", "px", 150, 154).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a8.below").animateFrom(below.from).animateTo(below.to).addProp("left", "px", 155, 125).addProp("top", "px", 250, 220).addProp("opacity", "", 0, 1);
		ScrollAnimator.add("#about .a8.above").animateFrom(above.from).animateTo(above.to).addProp("left", "px", 155, 125).addProp("top", "px", 250, 220).addProp("opacity", "", 0, 1);

		ScrollAnimator.observe(1400, function()
		{
			for(var i = 0, max = Main.skills.length;i<max;i++)
				Main.skills[i].helloWorld();
		});

		/**
		 * Contact and stuff
		 */
		ScrollAnimator.add("#contact").animateFrom(3100).animateTo(3630).addProp("margin-top", "px", 300, 0);
		ScrollAnimator.add(".scene.contact .dotted").animateFrom(3070).animateTo(3630).addProp("height", "px", 0, 590);

		ScrollAnimator.observe(3800, function()
		{
			Main.top.helloWorld();
		});
		/**
		 * Right menu
		 */
		ScrollAnimator.add('menu.second').animateFrom(150).animateTo(200).addProp("top", "%", 40, 50).addProp("opacity", null, 0, 1);


		ScrollAnimator.register();

		M4Tween.to(loader,1, {opacity:0}).onComplete(Main.start);

	},
	start:function()
	{
		document.body.style.overflowY = "auto";
		document.querySelector("#loader").style.display = "none";
		Main.logo.helloWorld();
	},
	keyDownHandler:function(e)
	{
		switch(e.keyCode)
		{
			case 37:
				e.preventDefault();
				Main.slider.previous();
				break;
			case 39:
				e.preventDefault();
				Main.slider.next();
				break;
			default:

				break;
		}
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
			Main.slider = Main.sliders[e.currentTarget.parentNode.getAttribute("id")];
			Scroll.to(e.currentTarget);
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
		var angle, from, to, c, s, i, j;


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

			var angle, distance = 360 / 90, c, s;
			for(var i = 0;i<distance;i++)
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

function Top()
{
	this.setup("rgba(80, 182, 158,");
	this._coefTopLines = 0;
}

Class.define(Top, [SpriteCM],
{
	_draw:function()
	{
		this.clear();

		SpriteCM.LINE_ANGLE = 360/72;
		SpriteCM.MAIN_RADIUS = 63;
		SpriteCM.LINE_SIZE = 15;
		SpriteCM.EXTERN_POINT_RADIUS = 84;

		this._drawMainCircle();
		this._drawDetails();

		SpriteCM.LINE_ANGLE = 360/72;
		SpriteCM.MAIN_RADIUS = 50;
		SpriteCM.LINE_SIZE = 12;
		SpriteCM.EXTERN_POINT_RADIUS = 66;
		if(this._coefTopLines)
		{
			var topLaneYCoef = this._coefTopLines * 20;
			this.setLineStyle(2.5, this._color+this._coefTopLines+")");
			this.beginFill("rgba(0, 0, 0, 0)");
			this.moveTo(-15, -77 - topLaneYCoef);
			this.lineTo(0, -93 - topLaneYCoef);
			this.lineTo(15, -77 - topLaneYCoef);

			var secondLaneYCoef = this._coefTopLines * 15;
			this.setLineStyle(2, this._color+this._coefTopLines+")");
			this.moveTo(-10, -76 - secondLaneYCoef);
			this.lineTo(0, -86 - secondLaneYCoef);
			this.lineTo(10, -76 - secondLaneYCoef);

			var textYCoef = this._coefTopLines * 25;
			this.setFont("Dosis", "700 32px", "rgba(237, 237, 237, "+this._coefTopLines+")");
			this.drawText("TOP", -25, -45 + textYCoef);
		}
	},
	helloWorld:function()
	{
		var f, t;
		var ref = this;
		M4Tween.killTweensOf(this);
		M4Tween.to(this,.6, {useStyle:false, _mainRadius:63})
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
			M4Tween.to(ref,.7, {useStyle:false, _coefTopLines:1});
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
		if(this.coef == 1)
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

