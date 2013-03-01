function M4StepShow(pNode, pClassName)
{
	if(typeof(pNode)=="string")
		pNode = document.getElementById(pNode);
	this._node = pNode;
	this.current = 0;
	this.steps = $$("#"+this._node.getAttribute("id")+" ."+pClassName);
	this._container = this._node.childNodes[1];
	this.stepWidth = this.steps[0].offsetWidth;
}
M4StepShow.prototype =
{
	time_transition:.4,
	steps:null,
	current:null,
	_container:null,
	_node:null,
	_stepWidth:"200px",
	next:function()
	{
		if(this.current+1>this.steps.length-1)
			return;
		this.display(++this.current);
	},
	previous:function()
	{
		if(this.current-1<0)
			return;
		this.display(--this.current);
	},
	display:function(pIndex)
	{
		pIndex*=1;
		if(pIndex<0||pIndex>this.steps.length-1)
			return;
		this.current = pIndex;
		var ml = this.current * this.stepWidth;
		M4Tween.killTweensOf(this._container);
		M4Tween.killTweensOf(this._node);
		M4Tween.to(this._container,  this.time_transition, {"marginLeft":"-"+ml+"px"});
		M4Tween.to(this._node,  this.time_transition, {"height":this.steps[this.current].offsetHeight+"px"});
	}
};