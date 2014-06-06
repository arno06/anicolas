function M4Tree(pFolderSelector, pTimeToFold, pUnfolded)
{
	this.time = pTimeToFold||0.3;
	var ref = this;
	var nodes = pFolderSelector.split(" ");
	this.nodeName = nodes[nodes.length-1];
	nodes = this.nodeName.split(".");
	if(nodes[0])
		this.nodeName = nodes[0];
	$$(pFolderSelector).each(function(a)
	{
		var ul = a.next("ul");
        if (ul)
        {
            if (!pUnfolded)
            {
                ul.style.height="0px";
                ul.style.display = "none";
                $(ul.parentNode).addClassName("close");
            }

            Event.observe(a, "click", proxy(ref, ref.folderClickHandler));
        }

	});
}


M4Tree.EVENT_OPEN = "M4Tree:open";
M4Tree.EVENT_CLOSE = "M4Tree:close";

M4Tree.prototype =
{
    folderClickHandler:function(e)
	{
		Event.stop(e);
		var a = e.target;
		if(a.nodeName.toLowerCase() != this.nodeName)
			a = a.up(this.nodeName);
		var ul = a.next("ul");
		var toHeight = "0";
		var complete = function(){ul.style.display = "none";};
		if(ul.parentNode.hasClassName("close"))
		{
			ul.parentNode.removeClassName("close");
			ul.style.display = "block";
			ul.style.height = "auto";
			toHeight = ul.offsetHeight;
			ul.style.height = "0px";
			complete = function(){ul.style.height="auto";};
            Event.fire(a, M4Tree.EVENT_OPEN);
		}
		else
        {
            ul.style.height=ul.offsetHeight+"px";
            ul.parentNode.addClassName("close");
            Event.fire(a, M4Tree.EVENT_CLOSE);
        }
		M4Tween.killTweensOf(ul, false);
        M4Tween.to(ul, this.time, {height:toHeight+"px"}).onComplete(complete);
	},
    close:function()
    {
        for (var i = 0; i < arguments.length; i++) {
            var e = document.getElementById(arguments[i]);
            if (e)
            {
                e.style.height="0px";
                e.style.display = "none";
                $(e.parentNode).addClassName("close");
            }
        }

    },
    open:function()
    {
        var e, ul;
        for (var i = 0; i < arguments.length; i++) {
            e = $(arguments[i]);
            if (e)
            {
                e.down('a').addClassName("on");
                do {
                    if(e.nodeName.toLowerCase() != 'ul')
                        ul = e.down('ul');
                    if (ul)
                    {
                        ul.style.height="auto";
                        ul.style.display = "block";
                    }
                    $(e.parentNode).removeClassName("close");
                    e = e.up('li');
                }
                while(e);
            }

        }

    }
};

M4Tree.create = function(pFolderSelector, pTimeToFold, pUnfolded)
{
	return new M4Tree(pFolderSelector, pTimeToFold, pUnfolded);
};
