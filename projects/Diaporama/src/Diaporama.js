NodeList.prototype.forEach = Array.prototype.forEach;

/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 */
function Diaporama(pSelector)
{
	this.$ = {};
	this.$.parent = document.querySelector(pSelector);
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
		var viewer = this.$.parent.querySelector(".viewer");
		this._viewer.elts = viewer.querySelectorAll("li");
		var imgViewer = viewer.querySelectorAll("img");
		imgViewer.forEach(function(pImg)
		{
			pImg.style.width = viewer.offsetWidth+"px";
			pImg.style.height = viewer.offsetHeight+"px";
		});
		this._viewer.elts.forEach(function(pEl)
		{
			pEl.style.display = "none";
			pEl.style.left = "0";
		});
		this._viewer.width = viewer.offsetWidth;

		var controls = this.$.parent.querySelector(".controls");
		this._controls.elts = controls.querySelectorAll("li");
		this._controls.height = this._controls.elts.item(0).offsetHeight;
		this._controls.width = controls.offsetWidth;

		var imgControls = controls.querySelectorAll("img");
		imgControls.forEach(function(pImg)
		{
			pImg.style.width = ref._controls.width+"px";
			pImg.style.height = ref._controls.height+"px";
		});

		var aControls = controls.querySelectorAll("a");
		var i = 0;
		aControls.forEach(function(pA)
		{
			pA.dataset.iterator = i++;
			pA.addEventListener("click", function(e)
			{
				e.preventDefault();
				ref.display(e.currentTarget.dataset.iterator);
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
		if(!this._viewer.elts.item(pIndex)||this._transition||this._current==pIndex)
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
			prev = this._viewer.elts.item(this._current);
			M4Tween.killTweensOf(prev);
			M4Tween.to(prev,.5, {left:(-pTo*this._viewer.width)+"px"});
		}

		/**
		 * Identification of previous, current and next elements
		 */
		prev = this._viewer.elts.item(pIndex-1>=0?pIndex-1:this._viewer.elts.length-1);
		next = this._viewer.elts.item(pIndex+1)||this._viewer.elts.item(0);
		var ref = this;
		var c = this._viewer.elts.item(pIndex);
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

			ref._viewer.elts.forEach(function(pElement)
			{
				if(currentlyAvailable.indexOf(pElement)!=-1)
					return;
				pElement.style.display = "none";
			});
		});

		/**
		 * Control frame
		 */
		var displayed = [this._controls.elts.item(pIndex==0?this._viewer.elts.length-1:pIndex-1)];
		var max = Math.min(pIndex+this._controls.count, this._viewer.elts.length);
		for(var i = pIndex; i<max;i++)
			displayed.push(this._controls.elts.item(i));
		if(!displayed.length<4)
		{
			max = 4 - displayed.length;
			for(i = 0;i<max;i++)
			{
				if(i>=pIndex)
					continue;
				displayed.push(this._controls.elts.item(i));
			}
		}

		var item;
		for(i = 0, max = displayed.length;i<max;i++)
		{
			item = displayed[i];
			item.style.display = "block";
			M4Tween.killTweensOf(item);
			M4Tween.to(item,.5, {top:(-this._controls.height+(i * (this._controls.height)))+"px"});
		}

		this._current = pIndex;
	}
};