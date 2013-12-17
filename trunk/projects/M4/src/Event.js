function Event(pType, pBubbles)
{
	this.type = pType;
	this.bubbles = pBubbles||false;
	this.eventPhase = Event.AT_TARGET;
}

Class.define(Event, [Class], {
	target:null,
	currentTarget:null,
	eventPhase:null,
	type:null,
	bubbles:false,
	clone:function(){var e = new Event(this.type, this.bubbles);e.target = this.target;return e;},
	toString:function(){return this.formatToString("type", "eventPhase", "target", "currentTarget", "bubbles");}
});

Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

Event.ADDED_TO_STAGE = "added_to_stage";
Event.REMOVED_FROM_STAGE = "removed_from_stage";
Event.ENTER_FRAME = "enter_frame";
Event.DRAW = "draw";
Event.INIT = "init";
Event.COMPLETE = "complete";


function MouseEvent(pType, pBubbles, pMouseX, pMouseY, pButton)
{
	this.type = pType;
	this.localX = pMouseX||0;
	this.localY = pMouseY||0;
	this.button = pButton||0;
	this.super("constructor", pType, pBubbles);
}
Class.define(MouseEvent, [Event], {
	localX:0,
	localY:0,
	button:0
});
MouseEvent.MOUSE_OVER = "mouse_over";
MouseEvent.MOUSE_OUT = "mouse_out";
MouseEvent.MOUSE_DOWN = "mouse_down";
MouseEvent.MOUSE_UP = "mouse_up";
MouseEvent.CLICK = "click";
MouseEvent.LEFT_BUTTON = 0;
MouseEvent.RIGHT_BUTTON = 2;