function M4Tree(pFolderSelector, pTimeToFold)
{
	this.time = pTimeToFold||0.3;
	var ref = this;
	$$(pFolderSelector).each(function(a)
	{
		var ul = a.next("ul");
		ul.style.height="0px";
		ul.style.display = "none";
		ul.parentNode.addClassName("close");
		Event.observe(a, "click", proxy(ref, ref.folderClickHandler));
	});
}

M4Tree.prototype =
{
	folderClickHandler:function(e)
	{
		Event.stop(e);
		var a = e.target;
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
		}
		else
			ul.parentNode.addClassName("close");
		M4Tween.killTweensOf(ul, false);
		M4Tween.to(ul, this.time, {height:toHeight+"px"}).onComplete(complete);
	}
};

M4Tree.create = function(pFolderSelector, pTimeToFold)
{
	return new M4Tree(pFolderSelector, pTimeToFold);
};