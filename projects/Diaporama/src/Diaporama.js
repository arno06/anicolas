if(!Array.prototype.each)
{
	Array.prototype.each = function(pHandler)
	{
		if(!pHandler)
			return;
		for(var i = 0, max = this.length;i<max;i++)
		{
			pHandler(this[i]);
		}
	}
}
/**
 * MDN Fix https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/keys
 */
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
        hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
        dontEnums = [
          'toString',
          'toLocaleString',
          'valueOf',
          'hasOwnProperty',
          'isPrototypeOf',
          'propertyIsEnumerable',
          'constructor'
        ],
        dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

      var result = [];

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }

      if (hasDontEnumBug) {
        for (var i=0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    }
  })()
};

/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 */
function Diaporama(pSelector)
{
	this.$ = {};
	this.$.parent = $$(pSelector)[0];
	if(!this.$.parent)
		return;
	this._harmonize();
	this.display(0);
}

Diaporama.prototype =
{
	_current:null,
	_viewer:{elts:null,width:null},
	_controls:{elts:null, height:null, width:null, count:null, currents:[]},
	_transition:false,
	_harmonize:function()
	{
		var ref = this;
		var viewer = this.$.parent.down(".viewer");
		this._viewer.elts = viewer.getElementsBySelector("li");
		var imgViewer = viewer.getElementsBySelector("img");
		imgViewer.each(function(pImg)
		{
			pImg.style.width = viewer.offsetWidth+"px";
			pImg.style.height = viewer.offsetHeight+"px";
		});
		this._viewer.elts.each(function(pEl)
		{
			pEl.style.display = "none";
			pEl.style.left = "0";
			var div = document.createElement("div");
			div.innerHTML = pEl.querySelector("img").getAttribute("alt");
			pEl.appendChild(div);
		});
		this._viewer.width = viewer.offsetWidth;

		var controls = this.$.parent.querySelector(".controls");
		this._controls.elts = controls.querySelectorAll("li");
		this._controls.height = this._controls.elts.item(0).offsetHeight;
		this._controls.width = controls.offsetWidth;

		var imgControls = controls.getElementsBySelector("img");
		imgControls.each(function(pImg)
		{
			pImg.style.width = ref._controls.width+"px";
			pImg.style.height = ref._controls.height+"px";
		});

		var aControls = controls.getElementsBySelector("a");
		var i = 0;
		aControls.each(function(pA)
		{
			pA.setAttribute("iterator", i++);
			Event.observe(pA, "click", function(e)
			{
				Event.stop(e);
				ref.display(e.findElement("a").getAttribute("iterator"));
			});
		});

		this._controls.count = Math.floor(controls.offsetHeight / this._controls.height);
	},
	next:function()
	{
		if(this._current<this._viewer.elts.length-1)
			this.display(this._current+1);
		else
			this.display(0);
	},
	prev:function()
	{
		if(this._current>0)
			this.display(this._current-1, -1);
		else
			this.display(this._viewer.elts.length-1, -1);
	},
	display:function(pIndex, pTo)
	{
		pTo = pTo || 1;
		if(!this._viewer.elts[pIndex]||this._transition||this._current==pIndex)
			return;
		/**
		 * Main frame
		 */
		var currentlyAvailable = [];
		var prev, next;
		if(this._current>=0)
		{
			/**
			 * Transition out for current element
			 */
			prev = this._viewer.elts[this._current];
			M4Tween.killTweensOf(prev);
			M4Tween.to(prev,.5, {left:(-pTo*this._viewer.width)+"px"});
		}

		/**
		 * Identification of previous, current and next elements
		 */
		prev = this._viewer.elts[pIndex-1>=0?pIndex-1:this._viewer.elts.length-1];
		next = this._viewer.elts[pIndex+1]||this._viewer.elts[0];
		var ref = this;
		var c = this._viewer.elts[pIndex];
		c.style.display = "block";
		c.style.left = (pTo*this._viewer.width)+"px";
		this._transition = true;

		/**
		 * Push for exception
		 */
		currentlyAvailable.push(c);
		currentlyAvailable.push(prev);
		currentlyAvailable.push(next);

		/**
		 * Animate Main frame
		 */
		M4Tween.killTweensOf(c);
		M4Tween.to(c,.5, {left:"0px"}).onComplete(function()
		{
			ref._transition = false;
			next.style.display = "block";
			next.style.left = ref._viewer.width+"px";
			prev.style.display = "block";
			prev.style.left = "-"+ref._viewer.width+"px";

			ref._viewer.elts.each(function(pElement)
			{
				if(currentlyAvailable.indexOf(pElement)!=-1)
					return;
				pElement.style.display = "none";
			});
		});

		/**
		 * Control frame
		 */
		var displayed = [this._controls.elts[(pIndex==0?this._viewer.elts.length-1:pIndex-1)]];
		if(pTo==-1)
		{
			this._controls.elts[pIndex].style.top = -this._controls.height+"px";
		}
		var max = Math.min(pIndex+this._controls.count, this._viewer.elts.length);
		for(var i = pIndex; i<max;i++)
			displayed.push(this._controls.elts[i]);
		if(!displayed.length<4)
		{
			max = 4 - displayed.length;
			for(i = 0;i<max;i++)
			{
				if(i>=pIndex)
					continue;
				displayed.push(this._controls.elts[i]);
			}
		}

		var item, to, ele, oc;
		for(i = 0, max = displayed.length;i<max;i++)
		{
			item = displayed[i];
			item.style.display = "block";
			M4Tween.killTweensOf(item);
			to = (-this._controls.height+(i * (this._controls.height)));
			if(i==0)
			{
				if(pTo==-1)
					to = (displayed.length-1)*ref._controls.height;
				ele = item;
				oc = function(){ele.style.top=((displayed.length-1)*ref._controls.height)+"px";};
			}
			var t = M4Tween.to(item,.5, {top:to+"px"}).onComplete(oc);
		}

		this._current = pIndex;
	}
};