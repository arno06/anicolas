NodeList.prototype.each = Array.prototype.forEach;
/**
 * Slider
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version 1.0
 */
function Slider(pSelector, pTransition, pOptions)
{
	pTransition = pTransition||"Alpha";
	this.options = pOptions||{};
	this.options.transitionTime = this.options.transitionTime||1;
	this.elements = document.querySelectorAll(pSelector);
	this.transition = new Slider[pTransition](this);
	this._controls = [];
	this._current = -1;
	this._timeout = null;
	this._timeoutRef = null;
	this.display(0);
	var ref = this.transition;
	window.addEventListener("orientationchange", function(){ref.updateSizes();}, false);
}
Slider.prototype =
{
	_current:-1,
	_direction:1,
	_timeout:null,
	_timeoutRef:null,
	_controls:[],
	addControls:function(pSelector, pClassName, pEvent)
	{
		pEvent = pEvent||"click";
		this._controls.push({selector:pSelector, className:pClassName});
		var ref = this;
		document.querySelectorAll(pSelector).each(function(pEl)
		{
			pEl.addEventListener(pEvent, function(e)
			{
				e.stopPropagation();
				e.preventDefault();
				ref.display(Number(e.target.getAttribute("rel")));
			}, false);
			if(pEl.getAttribute("rel") == ref._current)
				pEl.setAttribute("class", pClassName);
		});
	},
	setTimeout:function(pTime)
	{
		this._timeout = pTime;
		var ref = this;
		ref._timeoutRef = window.setTimeout(
			function()
			{
				ref.next();
			},
			this._timeout
		);
	},
	clearTimeout:function()
	{
		this._timeout = null;
		window.clearTimeout(this._timeoutRef);
	},
	next:function()
	{
		this._direction = 1;
		var t = this._current+1;
		if(t>=this.elements.length)
			t = 0;
		this.display(t);
	},
	previous:function()
	{
		this._direction = -1;
		var t = this._current -1;
		if(t<0)
			t = this.elements.length-1;
		this.display(t);
	},
	display:function(pIndex)
	{
		if(this._timeout)
		{
			window.clearTimeout(this._timeoutRef);
			this.setTimeout(this._timeout);
		}
		var prev = this.elements[this._current]||null;
		var next = this.elements[pIndex]||null;
		this.transition.perform(prev, next);
		this._current = pIndex;
		var ref = this;
		this._controls.forEach(function(s)
		{
			document.querySelectorAll(s.selector)
					.each(function(pEl)
			{
				pEl.removeAttribute("class");
				if(pEl.getAttribute("rel")== ref._current)
				{
					pEl.setAttribute("class", s.className);
				}
			});
		});
	}
};

Slider.Alpha = function(pSlider)
{
	this.slider = pSlider;
	var f = pSlider.elements[0];
	this.parentNode = f.parentNode;
	this.parentNode.style.cssText = "position:relative;";
	this.transitionTime = this.slider.options.transitionTime;
	this.updateSizes();
};
Slider.Alpha.prototype =
{
	perform:function(pPrev, pNext)
	{
		if(pPrev)
		{
			M4Tween.killTweensOf(pPrev);
			M4Tween.to(pPrev,this.transitionTime, {"opacity":0})
					.onComplete(function()
			{
				pPrev.style.display = "none";
			});
		}

		if(pNext)
		{
			pNext.style.display = "block";
			M4Tween.killTweensOf(pNext);
			M4Tween.to(pNext,this.transitionTime, {"opacity":1});
		}
	},
	updateSizes:function()
	{
		this.stepWidth = this.parentNode.offsetWidth;
		this.stepHeight = this.parentNode.offsetHeight;
		var ref = this;
		this.slider.elements.each(function(el)
		{
			el.style.cssText = "height:"+ref.stepHeight+"px;width:"+ref.stepWidth+"px;position:absolute;top:0;left:0;opacity:0;display:none;";
		});
	}
};

Slider.Touch = function(pSlider)
{
	this.isTouchable = "ontouchend" in document;
	this.downEvent = this.isTouchable?"touchstart":"mousedown";
	this.upEvent = this.isTouchable?"touchend":"mouseup";
	this.moveEvent = this.isTouchable?"touchmove":"mousemove";
	this.slider = pSlider;
	this.transitionTime = this.slider.options.transitionTime;
	this.oldTransitionTime = this.transitionTime;
	this.validationOffset = this.slider.options.validationOffset||.3;
	var f = pSlider.elements[0];
	this.parentNode = f.parentNode;
	this.container = document.createElement(this.parentNode.nodeName);
	this.parentNode.style.cssText = "position:relative;overflow:hidden;";
	var ref = this;
	this.slider.elements.each(function(el)
	{
		el.parentNode.removeChild(el);
		ref.container.appendChild(el);
	});
	this.parentNode.appendChild(this.container);
	this.updateSizes();
	this._anoUpHandler = function(e){ref._mouseUpHandler.apply(ref,[e]);};
	this._anoDownHandler = function(e){ref._mouseDownHandler.apply(ref,[e]);};
	this._anoMoveHandler = function(e){ref._mouseMoveHandler.apply(ref,[e]);};
	this.parentNode.addEventListener(this.downEvent, this._anoDownHandler, false);
};
Slider.Touch.prototype =
{
	perform:function(pPrev, pNext)
	{
		for(var i = 0, max = this.slider.elements.length; i<max;i++)
		{
			if(this.slider.elements[i] == pNext)
				max = --i;
		}
		M4Tween.killTweensOf(this.container);
		M4Tween.to(this.container, this.transitionTime, {marginLeft:"-"+(i*this.stepWidth)+"px"});
		M4Tween.killTweensOf(this.parentNode);
		M4Tween.to(this.parentNode, this.transitionTime, {height:pNext.offsetHeight+"px"});
		this.transitionTime = this.oldTransitionTime;
	},
	_mouseUpHandler:function(e)
	{
		this.parentNode.addEventListener(this.downEvent, this._anoDownHandler, false);
		document.removeEventListener(this.upEvent, this._anoUpHandler);
		document.removeEventListener(this.moveEvent, this._anoMoveHandler);
		var diff = (this.start.x - (this.isTouchable?e.changedTouches.item(0).clientX: e.clientX));
		if((this.stepWidth*this.validationOffset) < Math.abs(diff))
		{
			var diffTime = ((new Date().getTime())-this.startTime)/1000;
			this.transitionTime = ((this.stepWidth - diff)/(Math.abs(diff)/diffTime));
			if(diff>0 && this.slider.elements.length>this.slider._current+1)
			{
				this.slider.next();
				this.transitionTime = this.slider.options.transitionTime;
				return
			}
			else if(diff<0 && this.slider._current>0)
			{
				this.slider.previous();
				this.transitionTime = this.slider.options.transitionTime;
				return
			}
		}
		var c = this.slider._current;
		this.slider._current = -1;
		this.slider.display(c);
	},
	_mouseDownHandler:function(e)
	{
		e.preventDefault();
		M4Tween.killTweensOf(this.container);
		if(this.slider._timeoutRef)
			window.clearTimeout(this.slider._timeoutRef);
		var sx = this.isTouchable?e.targetTouches.item(0).clientX: e.clientX;
		var sy = this.isTouchable?e.targetTouches.item(0).clientY: e.clientY;
		this.start = {x:sx, y:sy};
		this.started = true;
		this.startTime = new Date().getTime();
		this.startMargin = Number(window.getComputedStyle(this.container, null).marginLeft.replace("px", ""));
		this.parentNode.removeEventListener(this.downEvent, this._anoDownHandler);
		document.addEventListener(this.upEvent, this._anoUpHandler, false);
		document.addEventListener(this.moveEvent, this._anoMoveHandler, false);
	},
	_mouseMoveHandler:function(e)
	{
		var cx = this.isTouchable?e.targetTouches.item(0).clientX: e.clientX;
		var cy = this.isTouchable?e.targetTouches.item(0).clientY: e.clientY;
		this.current = {x:cx, y:cy};
		var diffX = (this.current.x-this.start.x);
		var diffY = (this.current.y-this.start.y);
		if(this.started && Math.abs(diffX)<Math.abs(diffY))
		{
			this.parentNode.addEventListener(this.downEvent, this._anoDownHandler, false);
			document.removeEventListener(this.upEvent, this._anoUpHandler);
			document.removeEventListener(this.moveEvent, this._anoMoveHandler);
			return;
		}
		this.started = false;
		e.preventDefault();
		if((this.slider._current==0 && diffX>0)||(this.slider._current == this.slider.elements.length-1 && diffX<0))
			diffX *= .2;
		this.container.style.marginLeft = (this.startMargin + diffX)+"px";
	},
	updateSizes:function()
	{
		this.stepWidth = this.parentNode.offsetWidth;
		this.container.style.cssText = "width:"+(this.stepWidth*(this.slider.elements.length+1))+"px;display:block;margin-left:-"+(this.slider._current*this.stepWidth)+"px;";
		var ref = this;
		this.slider.elements.each(function(el)
		{
			el.style.cssText = "width:"+ref.stepWidth+"px;display:block;float:left;";
		});
		this.stepHeight = this.parentNode.offsetHeight;
		this.container.style.height = this.stepHeight+"px";
	}
};