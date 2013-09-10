var CodeFormater =
{
	init:function()
	{
		document.querySelectorAll("*.PendingCodeFormater").forEach(CodeFormater.applyTo);
	}
};
CodeFormater.thesaurus = {
		commentaires:[/(\/\*\*[a-z0-9\s\*\,\'\$\.\:\#\@\/йиа!\-=\(\)]{0,}\*\*\/)/gi, /(&lt;!--[a-z0-9\s,']{0,}--&gt;)/gi],
		api:[/(alert)(\(|\s)/gi,/(console)/g,/(log)/g,/\.(parent)/g, /(new\s)/g, /(parent)/g],
		string:[/(\"[a-z0-9\-\s:\/\.\_\|йазвкофи\+\=\&\?\;]*\")/gi],
		keyword:[/(else\s)/g,/(if(\s){0,}\()/g,/(function\s)/g,/(var\s)/g,/(\sArray[\s|\(])/g,/(return\s)/g,/(true|false)/g,/(\sextends\s)/g,/(\simplements\s)/g,/(class\s)/g,/(public\s)/g,/(private\s)/g],
		op:[/(\()/g,/(\))/g,/(\{)/g,/(\})/g,/(\])/g,/(\[)/g,/(\-&gt;)/g],
		php:[/(\&lt;\?php)/g,/(\?\&gt;)/g,/(&lt;\?)/g],
		xml:[/(&lt;[a-z:]+[0-9]*)/gi,/(&lt;[a-z:]+[0-9]*&gt;)/gi, /(&lt;\/[a-z:]+[0-9]*)/gi,/(\/&gt;)/gi, /(&gt;)/gi]};
CodeFormater.applyTo = function (pElement)
{
	pElement.classList.remove("PendingCodeFormater");
	var codeColored = pElement.innerHTML, family, element;
	codeColored = codeColored.replace(/\</g, "&lt;");
	codeColored = codeColored.replace(/\>/g, "&gt;");
	for(var i in CodeFormater.thesaurus)
	{
		family = CodeFormater.thesaurus[i];
		for(var j=0; j<family.length; ++j)
		{
			codeColored = codeColored.replace(family[j],"<span class='M4"+i+"'>$1</span>");
		}
	}
	pElement.innerHTML = codeColored;
};

window.addEventListener("load", CodeFormater.init, false);