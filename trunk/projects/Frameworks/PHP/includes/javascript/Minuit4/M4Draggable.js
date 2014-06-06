M4Draggable.to = function (pElement, pDroppable)
{
	return new M4Draggable(pElement, pDroppable);
};

M4Draggable.prototype.dropZone = null;
M4Draggable.prototype.droppedIn = false;
M4Draggable.prototype.droppedInHandler = null;
M4Draggable.prototype.droppedOutHandler = null;
M4Draggable.prototype.context = null;

function M4Draggable(pElement, pDroppable)
{
	this.target = pElement;
	this.zIndex = this.target.getStyle("zIndex");
	this.dropZone = pDroppable;
	this.enterFrame = null;
	this.clickPoint = {};
	this.oPoint = {};
	Event.observe(this.target, "mousedown", _(this,this.mouseDownHandler));
}

M4Draggable.prototype.onDroppedIn = function (pCallBack){this.droppedInHandler = pCallBack;return this;}
M4Draggable.prototype.onDroppedOut = function (pCallBack){this.droppedOutHandler = pCallBack;return this;}

M4Draggable.prototype.mouseUpHandler = function (e)
{
	if(!e)
		return;
	Event.stopObserving(window.document, "mouseup");
	Event.stopObserving(window.document, "mousemove");
	var t = this.target;
	var p = [];
	var callBack = null;
	var ctx;
	var z = this.zIndex;
	var dp = this.dropZone;
	var a = 1;
	try{t.style.filter = "alpha(opacity=100)";}catch(a){}
	if(!this.droppedIn)
	{
		ctx = this.context;
		p.push(this.oPoint.x, this.oPoint.y);
		callBack = this.droppedOutHandler;
	}
	else
	{
		Event.stopObserving(this.target,  "mousedown");
		ctx = {"where":"bottom", "node":this.dropZone};
		a = 0;
		p = this.dropZone.cumulativeOffset();
		p[1] += (this.dropZone.offsetHeight*.5)-(t.offsetHeight*.5);
		p[0] += (this.dropZone.offsetWidth*.5)-(t.offsetWidth*.5);
		callBack = this.droppedInHandler;
	}
	var isr = {};
	isr[ctx.where] = t;
	M4Tween.to(t, .5, {"top":(p[1])+"px", "left":(p[0])+"px", "opacity":a})
			.onComplete(function()
	{
		if(!a)
		{
			try{t.style.filter = "alpha(opacity=100)";t.style.opacity = 1;}catch(a){}
		}
		dp.removeClassName("dropHover");
		dp.removeClassName("dropOut");
		t.parentNode.removeChild(t);
		ctx.node.insert(isr);
		t.setStyle({"position":"static", "zIndex":z});
		if(callBack) callBack(t);
	});
};

M4Draggable.prototype.mouseDownHandler = function(e)
{
	if(!e)
		return;
	if(this.target.next())
		this.context = {"where":"before", "node":this.target.next()};
	else
		this.context = {"where":"bottom", "node":this.target.parentNode};
	var p = this.target.cumulativeOffset();
	this.oPoint = {x:p[0],y:p[1]};
	this.clickPoint = {x:Event.pointerX(e)-this.oPoint.x, y:Event.pointerY(e)-this.oPoint.y};
	this.target.parentNode.removeChild(this.target);
	document.body.appendChild(this.target);
	this.target.setStyle({"position":"absolute", "top":this.oPoint.y+"px", "left": this.oPoint.x+"px", "zIndex":999});
	Event.observe(window.document, "mousemove", _(this, this.frameHandler));
	Event.observe(window.document,  "mouseup", _(this, this.mouseUpHandler));
};

M4Draggable.prototype.frameHandler = function (e)
{
	if(!e)
		return;
	this.target.setStyle({"top":(Event.pointerY(e)-this.clickPoint.y)+"px", "left":(Event.pointerX(e)-this.clickPoint.x)+"px"});
	if(this.dropZone)
	{
		var tPos = this.target.cumulativeOffset();
		var tW = this.target.offsetWidth;
		var tH = this.target.offsetHeight;
		var dPos = this.dropZone.cumulativeOffset();
		var dW = this.dropZone.offsetWidth;
		var dH = this.dropZone.offsetHeight;
		var c = "";
		if(((tPos[0]+(tW*.5)>dPos[0])&&(tPos[0]+(tW*.5)<dPos[0]+dW))
		&&((tPos[1]+(tH*.5)>dPos[1])&&(tPos[1]+(tH*.5)<dPos[1]+dH)))
		{
			this.droppedIn = true;
			c = "dropHover";
		}
		else
		{
			this.droppedIn = false;
			c = "dropOut";
		}
		this.dropZone.removeClassName("dropHover");
		this.dropZone.removeClassName("dropOut");
		this.dropZone.addClassName(c);
	}
};

function _(pInstance, pMethod){return function(){pMethod.apply(pInstance, arguments)};}