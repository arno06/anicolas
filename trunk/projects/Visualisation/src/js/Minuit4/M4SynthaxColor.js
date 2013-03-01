function M4SynthaxColor(){}
M4SynthaxColor.dictionnaire = {
		commentaires:[/(\/\*\*[a-z0-9\s\*\,\'\$\.\:\#\@\/йиа!\-=\(\)]{0,}\*\*\/)/gi, /(\/\/.{0,}\r{0,1}\n{0,1})/gi],
		api:[/(alert)(\(|\s)/gi,/(console)/g,/(log)/g,/\.(parent)/g, /(new\s)/g, /(parent)/g],
		string:[/(\"[a-z0-9\-\s:\/\.\_\|йазвкофи]*\")/gi],
		keyword:[/(else\s)/g,/(if(\s){0,}\()/g,/(function\s)/g,/(var\s)/g,/(\sArray[\s|\(])/g,/(return\s)/g,/(true|false)/g,/(\sextends\s)/g,/(\simplements\s)/g,/(class\s)/g,/(public\s)/g,/(private\s)/g],
		op:[/(\()/g,/(\))/g,/(\{)/g,/(\})/g,/(\])/g,/(\[)/g,/(\-&gt;)/g],
		php:[/(\&lt;\?php)/g,/(\?\&gt;)/g,/(&lt;\?)/g],
		xml:[/(&lt;[a-z]+[0-9]*)/gi,/(&lt;[a-z]+[0-9]*&gt;)/gi, /(&lt;\/[a-z]+[0-9]*)/gi,/(\/&gt;)/gi, /(&gt;)/gi]};
M4SynthaxColor.of = function (pElement)
{
	var codeColored = pElement.innerHTML, e;
	codeColored = codeColored.replace(/\</g, "&lt;");
	codeColored = codeColored.replace(/\>/g, "&gt;");
	for(var i in M4SynthaxColor.dictionnaire)
	{
		for(var j=0; j<M4SynthaxColor.dictionnaire[i].length; ++j)
		{
			e = M4SynthaxColor.dictionnaire[i][j];
			codeColored = codeColored.replace(e,"<span class='M4"+i+"'>$1</span>");
		}
	}
	pElement.innerHTML = codeColored;
};