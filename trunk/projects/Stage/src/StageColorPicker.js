/**
 * Class ColorPicker
 * @author Arnaud NICOLAS - arno06@gmail.com
 *
 * @param pWidth int
 * @param pHeight int
 * @param pParent domElement
 * @param pDebug bool
 * @constructor
 */
function ColorPicker(pWidth, pHeight, pParent, pDebug)
{
	this.icon = M4.createElement("div",
	{
		"style":ColorPicker.style.icon,
		"parentNode":pParent
	});
	pDebug = pDebug||false;
	this.super();
	this.parentNode = pParent;
	this.parentNode.style.cssText = "position:relative;";
	this.mouseEnabled = true;
	this.backgroundColor = "rgba(255, 0, 0, 1)";
	this.width = 0;
	this.height = 0;
	this.localX = 0;
	this.localY = 0;
	this.addEventListener(Event.ADDED_TO_STAGE, M4.proxy(this, this._addedHandler));
	this.addEventListener(MouseEvent.MOUSE_DOWN, M4.proxy(this, this._mouseDownHandler));
	this.addEventListener(MouseEvent.MOUSE_UP, M4.proxy(this, this._mouseUpHandler));
	this.addEventListener(MouseEvent.MOUSE_OUT, M4.proxy(this, this._mouseUpHandler));
	this._anoEnterFrame = M4.proxy(this, this._enterFrameHandler);
	var stage = new Stage(pWidth, pHeight, pParent);
	stage.addChild(this);
	if(pDebug)
		stage.addChild(new FPS());
	this.cursor = M4.createElement("div",
	{
		style:ColorPicker.style.cursor,
		"parentNode":this.parentNode
	});
	this.selector = M4.createElement("div",
	{
		"style":ColorPicker.style.selector,
		"parentNode":this.parentNode
	});
	this.selector.style.left = (this.height+22)+"px";
	this.cursor.addEventListener("mouseup", M4.proxy(this, this._mouseUpHandler));
}

Class.define(ColorPicker, [Sprite],
{
	_addedHandler:function()
	{
		this.width = this.stage.width;
		this.height = this.stage.height;
		this._draw();
	},
	_mouseUpHandler:function(e)
	{
		this.removeEventListener(Event.ENTER_FRAME, this._anoEnterFrame);
	},
	_mouseDownHandler:function(e)
	{
		this.addEventListener(Event.ENTER_FRAME, this._anoEnterFrame);
	},
	_enterFrameHandler:function(e)
	{
		var c = this.getPixel(this.stage.mouseX, this.stage.mouseY);
		var d = new RGBAColor(c.r, c.g, c.b, c.alpha);
		if(this.stage.mouseX > this.height)
		{
			this.backgroundColor = d.toString();
			this._draw();
			this.selector.style.top = (this.stage.mouseY-3)+"px";
		}
		else
		{
			this.localX = Math.max(0, this.stage.mouseX);
			this.localY = Math.max(0, this.stage.mouseY);
			this.cursor.style.left = this.stage.domElement.offsetLeft+(this.localX-7)+"px";
			this.cursor.style.top = (this.localY-7)+"px";
		}
		c = this.getPixel(this.localX, this.localY);
		d = new HSLColor(c.r, c.g, c.b, this.alpha);
		this.icon.style.backgroundColor = d.getRGB();
		c = new HSLColor();
		c.fromString(this.cursor.style.borderColor);
		c.setL(1 - d.getL());
		this.cursor.style.border = "1px solid "+c.getRGB();
		this.dispatchEvent(new ColorPickerEvent(ColorPickerEvent.COLOR_PICKED, d.getRGB(), this.localX, this.localY));
	},
	_draw:function()
	{
		this.clear();
		this.beginFill(this.backgroundColor);
		this.drawRect(0, 0, this.height, this.height);
		this.endFill();

		var g = this.createLinearGradient(0, 0, this.width, 0);
		g.addColor("rgba(255, 255, 255, 0)", 1).addColor("rgba(255, 255, 255, 1)", 0);
		this.beginFill(g);
		this.drawRect(0, 0, this.height, this.height);
		this.endFill();

		g = this.createLinearGradient(0, 0, 0, this.height);
		g.addColor("rgb(0, 0, 0)", 1).addColor("rgba(255, 255, 255, 0)", 0);
		this.beginFill(g);
		this.drawRect(0, 0, this.height, this.height);
		this.endFill();

		g = this.createLinearGradient(0, 0, 0, this.height);
		var colors = ["rgb(255, 0, 0)","rgb(255, 0, 255)","rgb(0, 0, 255)","rgb(0, 255, 255)","rgb(0, 255, 0)","rgb(255, 255, 0)","rgb(255, 0, 0)"];
		var c = 0;
		var d = 1 / (colors.length-1);
		colors.forEach(function(color)
		{
			g.addColor(color, c);
			c+= d;
		});
		this.beginFill(g);
		this.drawRect(this.height, 0, this.width-this.height, this.height);
		this.endFill();
	}
});

function ColorPickerEvent(pType, pColor, pX, pY)
{
	this.type = pType;
	this.color = pColor||"";
	this.localX = pX||"";
	this.localY = pY||"";
	this.super("constructor", pType, false);
}
ColorPickerEvent.COLOR_PICKED = "color_picked_evt";
Class.define(ColorPickerEvent,[Event], {});

ColorPicker.style = {};
ColorPicker.style.icon =
{
	"width":"22px",
	"height":"22px",
	"float":"left",
	"background-image":"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkI5NDUwMzhBQURCRjExRTJCRTk0RDA1MDE1OUJFRkNCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkI5NDUwMzhCQURCRjExRTJCRTk0RDA1MDE1OUJFRkNCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6Qjk0NTAzODhBREJGMTFFMkJFOTREMDUwMTU5QkVGQ0IiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6Qjk0NTAzODlBREJGMTFFMkJFOTREMDUwMTU5QkVGQ0IiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7fE42AAAABcElEQVR42rSVsaqDMBSGk5hSULBdO/gOjrp2v+B0h/sAbd9C+xIF71P4Fs7dCx0cuiniZlu9/oEjCh28qQ3E6CHny++fcMKjKPpijG3YvO0mm6bZHI/HeE5qGIZ7gDk+2radBco5Z2DK5/OpoOiu6+7fgZ7P5xgcMAHm3QoKbFkWS9P0Vwfq+/4OHDQwR4pt29ZWi1yykxSrAFZbrVbaYOSOwI/HgxN4sVhog5FLYDCVYkDRpZTaYOQOPB4rfhc8UozH3IoJzD4A/qAV9/u9V2wYxiTI6XT6vlwu62EMuaQYzJHiqeDr9bruCk2M3R82WACG9uZhHiB1Xb8sQr0VpFgIMQmMeZSTJAnLsow5jsOCIFBxMIWOFZhHOV1FZHmeq5GKmVJcVZWgIgQl3Y2ym6oYHUo9z1MjxcCURVEI8vhwOEy+SeAvnYLtdtu/YwRTlmVp4NeWy+W/bhHkvLIOMTC5aZo/HdCZ887rTkb2J8AAMUtmWC+sZUQAAAAASUVORK5CYII=')"
};
ColorPicker.style.cursor =
{
	width:"14px",
	"height":"14px",
	"border-radius":"7px",
	"background":"rgba(0, 0, 0, 0)",
	"border":"1px solid #999999",
	"position":"absolute",
	"top":"-7px",
	"left":"15px",
	"pointer-events":"none"//OP
};
ColorPicker.style.selector =
{
	"width":"18px",
	"border":"1px solid #999999",
	"height":"6px",
	"position":"absolute",
	"top":"-3px",
	"pointer-events":"none"//OP
};