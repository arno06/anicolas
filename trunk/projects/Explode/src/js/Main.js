function Main(pElement, pExplodeSound)
{
	this.removeAllEventListener();
	this.$ = {};
	this.$.parent = pElement;
	this.$.explodeSound = pExplodeSound;
	this.setup(this.$.parent.dataset.cols, this.$.parent.dataset.lines);
	this.suppressionPool = [];
}

Class.define(Main, [EventDispatcher],
{
	setup:function(pCols, pLines)
	{
		this.field = {x:pCols, y:pLines};
		this.squares = [];
		if(!this.$.field)
			this.$.field = M4.createElement("div", {parentNode:this.$.parent, class:"field"});
		this.$.field.innerHTML = "";
		for(var i = 0; i<this.field.x; i++)
		{
			M4.createElement("div", {class:"col", parentNode:this.$.field});
			this.squares[i] = [];
		}

		this._prepareUI();
		this._prepareField();
		this.startGame();
	},
	_prepareUI:function()
	{
		if(this.$.scoreContainer)
			return;
		this.$.scoreContainer = M4.createElement("div", {parentNode:this.$.parent, class:"score_container"});
		this.$.multiplier = M4.createElement("div", {parentNode:this.$.scoreContainer, class:"multiplier", "text":"50"});
		this.$.score = M4.createElement("div", {parentNode:this.$.scoreContainer, class:"score", "text":"9999999999"});
	},
	_prepareField:function()
	{
		var ref = this;
		var cols = this.$.field.querySelectorAll("div.col");
		var k = 0;
		this.squares.forEach(function(col)
		{
			var colContainer = cols[k++];
			for(var i = 0;i<ref.field.y;i++)
			{
				if(col[i])
					continue;
				col[i] = new Square(colContainer, Main.utils.randomColor());
				col[i].addEventListener(Main.event.RESET_COEF, M4.proxy(ref, ref._resetCoef));
				col[i].addEventListener(Main.event.EXPLODING, M4.proxy(ref, ref._explode));
				col[i].addEventListener(Main.event.REQUEST_SUPPRESION, M4.proxy(ref, ref._requestSuppressionHandler));
			}
		});


		var n, max = this.field.x, maxj = this.field.y;
		for(var i = 0; i<max;i++)
		{
			for(var j = 0; j<maxj;j++)
			{
				n = [];
				if(i>0)
					n.push(this.squares[i-1][j]);//left
				if(j>0)
					n.push(this.squares[i][j-1]);//top
				if(j<maxj-1)
					n.push(this.squares[i][j+1]);//bottom
				if(i<max-1)
					n.push(this.squares[i+1][j]);//right

				this.squares[i][j].setNeighborhood(n);
			}
		}
		//Pass to count max color chain
		this.squares.forEach(function(col)
		{
			for(var i = 0;i<ref.field.y;i++)
			{
				col[i].countChain();
			}
		});
	},
	_explode:function(e)
	{
		var sqrs = [];
		for(var i = 0, max = this.squares.length;i<max;i++)
		{
			sqrs[i] = [];
			for(var j = 0, maxj = this.squares[i].length;j<maxj;j++)
			{
				if(this.suppressionPool.indexOf(this.squares[i][j])==-1)
				{
					sqrs[i].push(this.squares[i][j]);
					continue;
				}
				this.squares[i][j].kill();
			}
		}
		this.squares = sqrs;
		this.suppressionPool = [];
		this._prepareField();
		this.multiplier *= 1.1;
		this.multiplier = Math.round(Math.min(50, this.multiplier)*10)/10;
		this.score += Math.round(this.multiplier * (e.target.count * 25));
		this.$.explodeSound.play();
		this.updateUI();
	},
	_resetCoef:function(e)
	{
		this.multiplier = 1;
		this.updateUI();
	},
	_requestSuppressionHandler:function(e)
	{
		this.suppressionPool.push(e.target);
	},
	updateUI:function()
	{
		var s = this.score.toString();
		while(s.length<=9)
			s = "0"+s;
		this.$.score.innerHTML = s;
		this.$.multiplier.innerHTML = "x"+this.multiplier;
	},
	startGame:function()
	{
		this.multiplier = 1;
		this.score = 0;
		this.updateUI();
	}
});
Main.utils = {_types:["first", "second", "third", "fourth"]};
Main.utils.randomColor = function()
{
	var rdm = Math.floor(Math.random() * Main.utils._types.length);
	return Main.utils._types[rdm];
};

Main.config = {};
Main.config.MIN_LENGH_CHAIN = 3;

Main.event = {};
Main.event.EXPLODING = "evt_exploding";
Main.event.REQUEST_SUPPRESION = "evt_request_suppression";
Main.event.RESET_COEF = "evt_reset_coef";
Main.event.clickEvent = (function(){return "ontouchend" in document?"touchend":"click"})();

function Square(pContainer, pType)
{
	this.removeAllEventListener();
	this.$ = {};
	this.count = 0;
	this.type = pType;
	this.neighbors = [];
	this.$.element = M4.createElement("div", {"class":"square "+this.type, parentNode:pContainer});
	this._ano = {};
	this._ano.clickHandler = M4.proxy(this, this.clickHandler);
	this.$.element.addEventListener(Main.event.clickEvent, this._ano.clickHandler);
}

Class.define(Square, [EventDispatcher],
{
	setNeighborhood:function(pNeightbors)
	{
		this.neighbors = pNeightbors;
	},
	clickHandler:function()
	{
		if(this.count == NaN)
		{
			console.error("Invalid chain count", this);
			return;
		}
		if(this.count < Main.config.MIN_LENGH_CHAIN)
		{
			console.log("Chain not long enough");
			this.dispatchEvent(new Event(Main.event.RESET_COEF));
			return;
		}
		this.requestSuppression();
		this.dispatchEvent(new Event(Main.event.EXPLODING));
	},
	requestSuppression:function(pExcept)
	{
		pExcept = pExcept||[];
		pExcept.push(this);
		var neighbor;
		for(var i = 0, max = this.neighbors.length;i<max;i++)
		{
			neighbor = this.neighbors[i];
			if(neighbor.type != this.type)
				continue;
			if(pExcept.indexOf(neighbor)==-1)
				neighbor.requestSuppression(pExcept);
		}
		this.dispatchEvent(new Event(Main.event.REQUEST_SUPPRESION));
	},
	countChain:function(pExcept)
	{
		this.count = 1;
		pExcept = pExcept||[];
		pExcept.push(this);
		var neighbor;
		for(var i = 0, max = this.neighbors.length;i<max;i++)
		{
			neighbor = this.neighbors[i];
			if(neighbor.type != this.type)
				continue;
			if(pExcept.indexOf(neighbor)==-1)
				this.count+= neighbor.countChain(pExcept);
		}

		this.updateCount([], this.count);
		return this.count;
	},
	updateCount:function(pExcept, pCount)
	{
		pExcept = pExcept||[];
		pExcept.push(this);
		var neighbor;
		this.count = Math.max(this.count, pCount);
		for(var i = 0, max = this.neighbors.length;i<max;i++)
		{
			neighbor = this.neighbors[i];
			if(neighbor.type != this.type)
				continue;
			if(pExcept.indexOf(neighbor)==-1)
				neighbor.updateCount(pExcept, this.count);
		}
	},
	kill:function()
	{
		M4Tween.killTweensOf(this.$.element);
		var ref = this;
		M4Tween.to(this.$.element,.4,{opacity:0}).onComplete(function()
		{
			ref.$.element.parentNode.removeChild(ref.$.element);
		});
	}
});
