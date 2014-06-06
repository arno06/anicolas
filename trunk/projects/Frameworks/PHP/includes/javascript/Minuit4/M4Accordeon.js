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
function M4Accordeon(pId, pTypeNode, pTriggerNode, pOpenedIndex)
{
	var ref = this;
	ref.time = .4;
	ref.typeNode = pTypeNode?pTypeNode:"div";
	ref.triggerNode = pTriggerNode?pTriggerNode:"a";
	ref.element = document.getElementById(pId);
    ref.current = "";
    $$("#"+pId+">li").each(function(li){li.style.overflow = "hidden";li.style.position="relative";});
	$$("#"+pId+">li>"+ref.triggerNode).each(function(trigger, index)
	{
		if(!trigger.next(ref.typeNode))
				return;
        var d = trigger.next(ref.typeNode);
        var paddingTop = d.getStyle("paddingTop");
        var paddingBottom = d.getStyle("paddingBottom");
        trigger.setAttribute("M4Accordeon", paddingTop+" "+paddingBottom);
		if(!d.id)
			d.id = ref.typeNode+""+Math.round(Math.random()*999);
        var h = d.offsetHeight;
        if (paddingTop) h -= paddingTop.slice(0, -2);
        if (paddingBottom) h -= paddingBottom.slice(0, -2);
        trigger.rel = h+"px";
        trigger.addClassName("M4Accordeon");

		if (pOpenedIndex == index)
        {
            ref.current = d.id;
            d.setStyle({height:h+"px"});
        }
        else
            d.setStyle({height:"0px", paddingTop:"0px", paddingBottom:"0px"});


		Event.observe(trigger, "click", function(e)
		{
            var h,pTop, pBottom, t = $(e.target).hasClassName("M4Accordeon") ? $(e.target) : $(e.target).up(ref.triggerNode+".M4Accordeon");
            var cid = t.next(ref.typeNode).id;
			$$("#"+pId+">li>"+ref.typeNode).each(function(div){M4Tween.killTweensOf(div);M4Tween.to(div, ref.time,{height:"0px", "paddingTop":"0px", "paddingBottom":"0px"});});
            if(ref.current==cid)
            {
                ref.current = "";
                h = pTop = pBottom = "0px";

            }
            else
            {
                ref.current = cid;
                h = t.rel;
                var padding = t.getAttribute("M4Accordeon").split(" ");
                pTop = padding[0];
                pBottom = padding[1];
            }
            M4Tween.killTweensOf(document.getElementById(cid));
            M4Tween.to(document.getElementById(cid), ref.time,{height:h, paddingTop:pTop, paddingBottom:pBottom});
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
        M4Tween.to(target, accordeon.time, {height:target.previous(accordeon.triggerNode).rel});
};
M4Accordeon.open = function (pIdAccordeon, pIndex)
{
    var accordeon = M4Accordeon.instances[pIdAccordeon];
	var t = $$("#"+pIdAccordeon+" li>"+accordeon.triggerNode)[pIndex],h;
	var cid = t.next(accordeon.typeNode).id;
	$$("#"+pIdAccordeon+">li>"+accordeon.typeNode).each(function(div){M4Tween.to(div, accordeon.time,{height:"0px"});});
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
    M4Tween.to(document.getElementById(cid), accordeon.time,{height:h});
};
M4Accordeon.create = function(pId, pTypeNode, pTriggerNode, pOpenedIndex){return new M4Accordeon(pId, pTypeNode, pTriggerNode, pOpenedIndex);};