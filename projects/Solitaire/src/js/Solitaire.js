function Solitaire(pContainer)
{
    this.removeAllEventListener();
    this.$ = {
        container:document.querySelector(pContainer),
		board:null
    };
	this.board = null;
    this._createBoard();
	this.reset();
}

Class.define(Solitaire, [EventDispatcher],
{
    _createBoard:function()
    {
		this.board = [];
        this.$.board = M4.createElement("div", {"class":"board", parentNode:this.$.container});
        var boardSize = 7;
        var disposation = [3, 5, 7, 7, 7, 5, 3];

        var currentCount, first, last, className, line, el;
        for(var i = 0; i<boardSize; i++)
        {
			line = [];
            currentCount = disposation[i];
            first = (boardSize-currentCount)/2;
            last = (first + currentCount)-1;

            for(var j = 0; j<boardSize; j++)
            {
                className = (j<=last&&j>=first)?"available":"";
                el = M4.createElement("div", {"class":"square "+className, "data-pos":i+","+j,"parentNode":this.$.board});
				if(className=="available")
					el.addEventListener("click", this._acceptPieceHandler.proxy(this), false);
				line.push(el);
            }
			this.board.push(line);
            M4.createElement("div", {"class":"crlf", "parentNode":this.$.board});
        }
    },
	reset:function()
	{
		this.countMoves = 0;
		document.querySelector("header span.count span").innerHTML = this.countMoves;

		var availables = document.querySelectorAll(".board .square.available");

		var av, p;
		for(var i = 0, max = availables.length;i<max;i++)
		{
			av = availables[i];
			av.innerHTML = "";
			p = M4.createElement("div", {"class":"piece", "parentNode":av});
			p.addEventListener("click", this._pieceClickHandler.proxy(this), false);
		}

		var middlePiece = this.board[3][3];
		middlePiece.innerHTML = "";

		this.choices = [];
		this.target = null;
	},
	_pieceClickHandler:function(e)
	{
		this.choices = [];
		this.target = null;
		document.querySelectorAll(".piece.current").forEach(function(pEl)
		{
			pEl.classList.remove("current");
		});
		var target = e.currentTarget;
		var position = target.parentNode.dataset.pos.split(",");
		position = [Number(position[0]), Number(position[1])];

		var surround = [[0,-1],[-1,0],[1,0],[0,1]];

		var choices = [];

		var neighbor, vector;
		for(var i = 0, max = surround.length; i<max;i++)
		{
			vector = surround[i];
			neighbor = [position[0]+vector[0], position[1]+vector[1]];
			if(!this.checkStatus(neighbor[0], neighbor[1], true))
				continue;

			neighbor[0] += vector[0];
			neighbor[1] += vector[1];

			if(!this.checkStatus(neighbor[0], neighbor[1], false))
				continue;

			choices.push(neighbor[0]+","+neighbor[1]);
		}

		if(!choices.length)
			return;

		this.target = target;
		this.target.classList.add("current");
		this.choices = choices;
	},
	checkStatus:function(pLine, pSquare, pHasPieces)
	{
		var line = this.board[pLine];
		if(!line)
			return false;
		var square = line[pSquare];
		if(!square||!square.classList.contains("available"))
			return false;

		var piece = square.querySelector(".piece");

		if(pHasPieces)
			return piece!=null;
		else
			return piece==null;
	},
	_acceptPieceHandler:function(e)
	{
		if(!this.target || !this.choices.length|| e.currentTarget.querySelector(".piece"))
			return;

		var position = e.currentTarget.dataset.pos;

		var n = false;
		for(var i = 0, max = this.choices.length;i<max;i++)
		{
			if(this.choices[i]==position)
				n = true
		}

		if(!n)
			return;

		position = position.split(",");
		position = [Number(position[0]), Number(position[1])];

		var targetposition = this.target.parentNode.dataset.pos.split(",");
		targetposition = [Number(targetposition[0]), Number(targetposition[1])];

		var toeat = [(position[0]+targetposition[0])>>1, (position[1]+targetposition[1])>>1];
		toeat = this.board[toeat[0]][toeat[1]].querySelector(".piece");
		toeat.parentNode.removeChild(toeat);

		this.target.parentNode.removeChild(this.target);

		e.currentTarget.appendChild(this.target);

		this.countMoves++;

		document.querySelector("header span.count span").innerHTML = this.countMoves;

		this.target.classList.remove("current");
		this.target = null;
		this.choices = [];
	}
});

function init()
{
    var sol = new Solitaire("body div.content");
	document.querySelector("header a.restart").addEventListener("click", function(e)
	{
		e.stopPropagation();
		e.preventDefault();
		e.stopImmediatePropagation();
		sol.reset();
	});
}

window.addEventListener("load", init);