function M4StepShow(pIdStepShow, pIdContainer, pClassSteps, pLoop, pStepDisplay)
{
    this.id = pIdStepShow;
    this.container = document.getElementById(pIdContainer);
    this.className = pClassSteps;
    this.steps = $$("#"+this.id+" #"+this.container.id+" ."+this.className);
    this.stepWidth = this.steps[0].offsetWidth;
    this.stepDisplay = pStepDisplay === 'undefined' ? 0 : pStepDisplay-1;
    this.stepLast = this.steps.length-1;
    this.current = 0;
    this.stepFirst = 0;
    this.loop = pLoop === true;
    this.controller = false;
}

M4StepShow.prototype.next = function()
{
    if(this.current+1>this.stepLast-this.stepDisplay) {
        if(!this.loop)
            return;
        else
            this.display(this.stepFirst);
    }
    else
        this.display(this.current+1);
}

M4StepShow.prototype.previous = function()
{
    if(this.current-1<0) {
        if(!this.loop)
            return;
        else
            this.display(this.stepLast);
    }
    else
        this.display(this.current-1);
}

M4StepShow.prototype.display = function(pIndex)
{
    pIndex=Number(pIndex);
    if(pIndex<0 || pIndex>this.stepLast || pIndex == this.current)
        return;
    if(this.controller)
        this.buttonSwitch("s",this.current+1,pIndex+1);
    this.current = pIndex;
    var ml = this.current * this.stepWidth;
    M4Tween.to(this.container.style,  .4, {"marginLeft":"-"+ml+"px", "useStyle":false});
    //M4Tween.to(document.getElementById(this.id),  .4, {"height":this.steps[this.current].offsetHeight+"px"});
}

M4StepShow.prototype.buttonSwitch = function(pPrefix,pCurrent,pNext)
{
    var current = pPrefix+pCurrent;
    var next = pPrefix+pNext;

    $(current).className = $(current).className.replace('active','');
    $(next).className = "active";
}