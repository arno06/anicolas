/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * In Progress
 *
 <div class="StageChart">
		<script type="application/json">
			{
				"debug":true,
				"width":400,
				"height":300,
				"type":"pie",
				"fontFace":"Arial",
				"datas":
				[
					{"color":"rgb(200, 200, 200)", "value":30, "label":"E-mails ouverts"},
					{"color":"rgb(85, 85, 85)", "value":60, "label":"E-mails non ouverts"},
					{"color":"rgb(85, 0, 85)", "value":6, "label":"E-mails non ouverts"},
					{"color":"rgb(85, 85, 0)", "value":4, "label":"E-mails non ouverts"}
				]
			}
		</script>
	</div>
 */
var StageChart =
{
	init:function()
	{
		var charts = document.querySelectorAll(".StageChart");
		var options = {width:400, height:400, debug:false, fontFace:"Arial", datas:[], options:{}};
		var chart, parent;
		for(var i = 0, max = charts.length;i<max;i++)
		{
			parent = charts[i];
			chart = JSON.parse(parent.querySelector('script[type="application/json"]').innerHTML);
			for(var j in options)
			{
				if(!chart[j])
					chart[j] = options[j];
			}
			var s;
			switch(chart.type)
			{
				case "pie":
					s = new Stage(chart.width, chart.height, parent);
					if(chart.debug)
						s.addChild(new FPS());
					var min = Math.min(chart.width, chart.height)>>1;
					var p = new PieChart(chart.datas, min, chart.options);
					p.x = chart.width >>1;
					p.y = chart.height>>1;
					s.addChild(p);
					break;
				case "bar":
					s = new Stage(chart.width, chart.height, parent);
					if(chart.debug)
						s.addChild(new FPS());
					var b = new BarChart(chart.datas, chart.width, chart.height, chart.options);
					s.addChild(b);
					break;
			}
		}

	}
};

window.addEventListener("load", StageChart.init, false);

function BarChart(pDatas, pWidth, pHeight, pOptions)
{
	var defaultOptions = {border:{size:1, color:"rgb(255, 0, 0)"}, grid:{size:0.5, color:"rgb(0, 0, 255)", cellWidth:100, cellHeight:100}, minValue:0, maxValue:10};
	for(var i in defaultOptions)
		this[i] = pOptions[i]||defaultOptions[i];
	this.width = pWidth - this.border.size;
	this.height = pHeight - this.border.size;
	this.datas = pDatas;
	this.reset();
	this.addEventListener(Event.ADDED_TO_STAGE, this.drawDatas.proxy(this));
}

Class.define(BarChart, [Container],
{
	drawDatas:function()
	{
		this.clear();
		this.setLineStyle(this.border.size, this.border.color);
		this.drawRect(this.border.size>>1, this.border.size>>1, this.width, this.height);
		this.setLineStyle(this.grid.size, this.grid.color);
		for(var i = 1, max = Math.ceil(this.width / this.grid.cellWidth);i<max;i++)
		{
			this.moveTo(i * this.grid.cellWidth, 0);
			this.lineTo(i *this.grid.cellWidth, this.height);
		}
		this.setFont("Arial", "11px");
		this.drawText(this.minValue, 2, this.height - 12);
		for(i = 1, max = Math.ceil(this.height / this.grid.cellHeight);i<max;i++)
		{
			this.drawText(Math.round(this.maxValue - (i*(this.maxValue/max))), 2, (i * this.grid.cellHeight)-12);
			this.moveTo(0, i * this.grid.cellHeight);
			this.lineTo(this.width, i *this.grid.cellHeight);
		}
		this.drawText(this.maxValue, 2, 2);
		var item, height, chartPart;
		max = this.datas.length;
		var distance = Math.floor(this.width / (max+1));
		for(i = 0; i<max;i++)
		{
			item = this.datas[i];
			height = Math.round(Math.min(this.height, (item.value / this.maxValue) * this.height));
			chartPart = new BarChartPart(30, height, item.label, item.value, item.color);
			chartPart.x = (i+1) * distance;
			chartPart.y = this.height;
			this.addChild(chartPart);

		}
	}
});

function BarChartPart(pWidth, pHeight, pLabel, pValue, pColor)
{
	this.reset();
	this.mouseEnabled = true;
	this.width = pWidth;
	this.height = pHeight;
	this.label = pLabel;
	this.value = pValue;
	this.color = pColor;
	this.addEventListener(Event.ADDED_TO_STAGE, this.drawPart.proxy(this));
}

Class.define(BarChartPart, [Container],
{
	_overHandler:function()
	{
		M4Tween.killTweensOf(this.toolTip);
		M4Tween.to(this.toolTip,.3, {y:(-(this.height>>1)-8), alpha:1, useStyle:false});
	},
	_outHandler:function()
	{
		M4Tween.killTweensOf(this.toolTip);
		M4Tween.to(this.toolTip,.3, {y:(-(this.height>>1)-8)-10, alpha:0, useStyle:false});
	},
	drawPart:function()
	{
		this.clear();
		this.beginFill(this.color);
		this.drawRect(-this.width>>1, -this.height, this.width, this.height);
		this.endFill();
		this.scaleY = 0;
		this.toolTip = new ChartToolTip(this.label, null, null, null, null, 5, 10);
		this.toolTip.y = (-(this.height>>1)-8)-10;
		this.toolTip.alpha = 0;
		this.addChild(this.toolTip);
		M4Tween.to(this, .3, {scaleY:1, useStyle:false});
		this.addEventListener(MouseEvent.MOUSE_OVER, this._overHandler.proxy(this));
		this.addEventListener(MouseEvent.MOUSE_OUT, this._outHandler.proxy(this));
	}
});

function PieChart(pDatas, pMaxRadius, pOption)
{
	this.reset();
	this.coefOver = 1.1;
	this.datas = pDatas;
	pMaxRadius = pMaxRadius - ((pMaxRadius * this.coefOver) - pMaxRadius);
	this.maxRadius = pMaxRadius||100;
	this.fontFace = pOption.fontFace||"Arial";
	this.fontSize = pOption.fontSize||"12px";
	this.addEventListener(Event.ADDED_TO_STAGE, this.drawDatas.proxy(this));
}

Class.define(PieChart, [Container],
{
	drawDatas:function()
	{
		this.removeChildren();
		var item, chartPart, itemAngle, totalAngle = 0, maxValue = 0, total = 0;
		for(var i = 0, max = this.datas.length; i<max;i++)
		{
			maxValue = Math.max(this.datas[i].value, maxValue);
			total += this.datas[i].value;
		}
		for(i = 0; i<max;i++)
		{
			item = this.datas[i];
			item.value = ((item.value/total) * 100);
			itemAngle = item.value * 3.6;
			chartPart = new PieChartPart(itemAngle, this.maxRadius, item.label, item.value, item.color, this.fontFace);
			chartPart.rotation = totalAngle;
			this.addChild(chartPart);
			totalAngle += itemAngle;
		}
	}
});

function PieChartPart(pAngle, pRadius, pLabel, pValue, pColor, pFontFace)
{
	this.reset();
	this.mouseEnabled = true;
	this.color = pColor || "rgb(255, 0, 0)";
	this.fontFace = pFontFace||"Arial";
	this.value = pValue||0;
	this.label = pLabel ||"";
	this.angle = pAngle;
	this.radius = pRadius;
	this.toolTip = null;
	this.fromToolTipY = 0;
	this.addEventListener(Event.ADDED_TO_STAGE, this.drawPart.proxy(this));
}

Class.define(PieChartPart, [Container],
{
	_over:null,
	_overHandler:function()
	{
		M4Tween.killTweensOf(this);
		M4Tween.killTweensOf(this.toolTip);
		M4Tween.to(this, .3, {scaleX:this.parent.coefOver, scaleY:this.parent.coefOver, useStyle:false});
		M4Tween.to(this.toolTip, .3, {y:this.fromToolTipY, alpha:1, useStyle:false});
	},
	_outHandler:function()
	{
		M4Tween.killTweensOf(this);
		M4Tween.killTweensOf(this.toolTip);
		M4Tween.to(this, .3, {scaleX:1, scaleY:1, useStyle:false});
		M4Tween.to(this.toolTip, .3, {y:this.fromToolTipY-10, alpha:0, useStyle:false});
	},
	drawPart:function()
	{
		this.scaleX = this.scaleY = 0;
		this.clear();
		this.beginFill(this.color);
		this.moveTo(0, 0);
		this.drawArc(0, 0, this.radius, 0, this.angle);
		this.endFill();
		this.toolTip = new ChartToolTip(this.label, this.fontFace, "12px", "rgb(255, 255, 255)", "rgba(0, 0, 0, .55)", 5, 5);
		this.parent.addChild(this.toolTip);
		this.toolTip.alpha = 0;
		var a = M4.geom.DEGREE_TO_RADIAN * (this.rotation+(this.angle>>1));
		this.toolTip.x = Math.round(Math.cos(a) * this.radius);
		this.toolTip.y = Math.round(Math.sin(a) * this.radius);

		this.fromToolTipY = this.toolTip.y;
		var ty = ((this.fromToolTipY) + (17>>1)  + 10);
		if(ty>(this.stage.height>>1))
		{
			this.fromToolTipY = this.toolTip.y = (this.stage.height>>1) - 17;
		}
		else if (ty<-(this.stage.height>>1))
			this.fromToolTipY = this.toolTip.y = -(this.stage.height>>1) + 17;
		this.toolTip.y -= 10;
		M4Tween.to(this, .3, {scaleX:1, scaleY:1, useStyle:false});
		this.addEventListener(MouseEvent.MOUSE_OVER, this._overHandler.proxy(this));
		this.addEventListener(MouseEvent.MOUSE_OUT, this._outHandler.proxy(this));
	}
});

function ChartToolTip(pLabel, pFontFace, pFontSize, pFontColor, pBackgroundColor, pBorderRadius, pXPadding)
{
	this.reset();
	this.label = pLabel;
	this.fontFace = pFontFace||"Arial";
	this.fontSize = pFontSize||"12px";
	this.fontColor = pFontColor||"rgb(255, 255, 255)";
	this.background = pBackgroundColor||"rgba(0, 0, 0, .55)";
	this.borderRadius = pBorderRadius||0;
	this.xPadding = pXPadding||5;
	this.addEventListener(Event.ADDED_TO_STAGE, this.drawToolTip.proxy(this));
}

Class.define(ChartToolTip, [Sprite],
{
	drawToolTip:function()
	{
		this.clear();
		this.setFont(this.fontFace, this.fontSize, this.fontColor);
		var w = this.measureText(this.label, this.fontFace, this.fontSize);
		this.beginFill(this.background);
		this.drawRoundRect(- (w>>1) - this.xPadding, 0, w + (this.xPadding<<1), 17, this.borderRadius, this.borderRadius, this.borderRadius, this.borderRadius);
		this.endFill();
		this.drawText(this.label,- (w>>1));
	}
});