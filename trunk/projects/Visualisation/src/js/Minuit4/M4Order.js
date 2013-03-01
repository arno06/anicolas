/**
 * @autor Arnaud NICOLAS - arno06@gmail.com
 * @date  Janvier 2012
 */
function M4Order(pTagTree, pTagElement, pTagTrigger, pAttributeId)
{
	var	index=-1,
	target=null,
	elements=null,
	oX = 0,
	oY = 0,
	changeHandler = null,
	dragHandler=function(e)
	{
		Event.stop(e);
		target = e.target.up(pTagElement);
		if(!target||elements.length==1)
			return;
		oX = e.clientX - target.offsetLeft;
		oY = e.clientY - target.offsetTop;
		target.setAttribute("oPosition", target.style.position);
		target.style.position = "absolute";
		Event.observe(document, "mousemove", moveHandler);
		moveHandler(e);
	},
	dropHandler=function(e)
	{
		Event.stop(e);
		if(!target||elements.length==1)
			return;
		var order = [];
		target.style.top = 0;
		target.style.left = 0;
		target.style.position = target.getAttribute("oPosition");
		elements.each(function(el)
		{
			el.style.marginBottom = 0;
			el.style.marginTop = 0;
		});
		if(elements[index] ||
		   index == elements.length)
		{
			var p = target.parentNode;
			p.removeChild(target);
			if(index<elements.length)
				p.insertBefore(target, elements[index]);
			else
			{
				var el = elements[index-1];
				if(el === target)
					el = elements[index-2];
				if(el.nextSibling)
					p.insertBefore(target, el.nextSibling);
				else
					p.appendChild(target);
			}
			elements = $$(pTagTree+ " "+pTagElement);
			for(var i = 0, max = elements.length;i<max;i++)
				order.push(elements[i].getAttribute(pAttributeId));
			if(changeHandler)
				changeHandler(order);
		}
		target.removeAttribute("oPosition");
		target = null;
		Event.stopObserving(document, "mousemove", moveHandler);
	},
	moveHandler=function(e)
	{
		target.style.left = (e.clientX-oX)+"px";
		target.style.top = (e.clientY-oY)+"px";
		index = elements.length;
		for(var i = 0, max = elements.length;i<max;i++)
		{
			var el = elements[i];
			el.style.marginBottom = "0";
			if(target === el || index!=max)
				continue;
			if((e.clientY < el.offsetTop+el.offsetHeight)||
				((e.clientY < el.offsetTop+el.offsetHeight) &&
				(e.clientY > el.offsetTop)))
			{
				index = i;
				el.style.marginTop = target.offsetHeight+"px";
			}
		}
		el = null;
		if(index == elements.length)
		{
			if(elements[elements.length-1] === target)
			{
				if(elements.length>1)
					el = elements[elements.length-2]
			}
			else
				el = elements[elements.length-1];
			if(el)
				el.style.marginBottom = target.offsetHeight+"px";
		}
		for(i = 0;i<max;i++)
		{
			el = elements[i];
			if(target === el || i == index)
				continue;
			el.style.marginTop = 0;
		}
	};

	elements = $$(pTagTree + " "+pTagElement);
	$each(pTagTree + " "+pTagTrigger, "mousedown", dragHandler, false);
	$each(pTagTree + " "+pTagTrigger, "click", function(e){Event.stop(e);}, false);
	$$(pTagTree + " "+pTagTrigger).each(function(el){el.style.cursor = "move";});
	Event.observe(document, "mouseup", dropHandler);

	return {
		onChange:function(pHandler)
		{
			changeHandler = pHandler;
			return this;
		}
	};
}

M4Order.create = function(pTagTree, pTagElement, pTagTrigger, pAttributeId)
{
	return new M4Order(pTagTree, pTagElement, pTagTrigger, pAttributeId);
};