/**
 * @author Arnaud NICOLAS - arno06@gmail.com
 * @version .2
 * @exemple
		<ul id="test">
			<li><a href="">Element 1</a>
				<div>Je met du texte lol</div>
			</li>
			<li><a href="">Element 2</a>
				<div>Je met du texte lol lol</div>
			</li>
			<li><a href="">Element 3</a>
				<div>Je met du texte lol lol gné gné</div>
			</li>
		</ul>
		<script type="text/javascript">
			M4Accordeon.create("test");
		</script>
 */
M4Accordeon.instances = {};
function M4Accordeon(pId, pTypeNode, pTriggerNode)
{
	var ref = this;
	ref.time = .4;
	ref.typeNode = pTypeNode?pTypeNode:"div";
	ref.triggerNode = pTriggerNode?pTriggerNode:"a";
	ref.element = document.getElementById(pId);
    ref.current = "";
    $$("#"+pId+" li").each(function(li){li.style.overflow = "hidden";li.style.position="relative";});
	$$("#"+pId+" li>"+ref.triggerNode).each(function(trigger)
	{
		if(!trigger.next(ref.typeNode))
				return;
		if(!trigger.next(ref.typeNode).id)
			trigger.next(ref.typeNode).id = ref.typeNode+""+Math.round(Math.random()*999);
		trigger.rel = trigger.next(ref.typeNode).getStyle("height");
		trigger.addClassName("M4Accordeon");
		trigger.next(ref.typeNode).style.height = "0px";
		Event.observe(trigger, "click", function(e)
		{
            var h, t = $(e.target).hasClassName("M4Accordeon") ? $(e.target) : $(e.target).up(ref.triggerNode+".M4Accordeon");
            var cid = t.next(ref.typeNode).id;
			$$("#"+pId+" li>"+ref.typeNode).each(function(div){M4Tween.to(div, ref.time,{height:"0px"});});
            if(ref.current==cid)
            {
                ref.current = "";
                h = "0px";
            }
            else
            {
                ref.current = cid;
                h = t.rel;
            }
			M4Accordeon.animate(document.getElementById(cid), ref.time, h);
			Event.stop(e);
		});
	});
    M4Accordeon.instances[pId] = ref;
}
M4Accordeon.update = function(pIdAccordeon, pId, pContent)
{
    var accordeon = M4Accordeon.instances[pIdAccordeon];
    if(!accordeon)
        return;
    var target = $(pId);
    target.innerHTML = pContent;
    var h = target.getStyle("height");
    target.style.height = "auto";
    target.previous(accordeon.triggerNode).rel = target.getStyle("height");
    target.setStyle({"height":h});
    if(accordeon.current == pId)
    {
	    M4Accordeon.animate(target, accordeon.time, target.previous(accordeon.triggerNode).rel);
    }
};
M4Accordeon.open = function (pIdAccordeon, pIndex)
{
    var accordeon = M4Accordeon.instances[pIdAccordeon];
	var t = $$("#"+pIdAccordeon+" li>"+accordeon.triggerNode)[pIndex],h;
	console.log($$("#"+pIdAccordeon+" li>"+accordeon.typeNode).length);
	var cid = t.next(accordeon.typeNode).id;
	$$("#"+pIdAccordeon+" li>"+accordeon.typeNode).each(function(div){M4Tween.to(div, accordeon.time,{height:"0px"});});
	if(accordeon.current==cid)
	{
		accordeon.current = "";
		h = "0px";
	}
	else
	{
		accordeon.current = cid;
		h = t.rel;
	}
	M4Accordeon.animate(document.getElementById(cid), accordeon.time, h);
};
M4Accordeon.animate = function(pTarget, pTime, pHeight)
{
	M4Tween.killTweensOf(pTarget);
	M4Tween.to(pTarget, pTime,{height:pHeight});
};
M4Accordeon.create = function(pId, pTypeNode, pTriggerNode){return new M4Accordeon(pId, pTypeNode, pTriggerNode);};