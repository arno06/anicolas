MinesweeperOptions =
{
	"difficulty":[
		{'id':'easy','label':'Facile', 'checked':true,'field':new Vector(9, 9), 'mines':10},
		{'id':'medium','label':'Moyenne', 'checked':false, 'field':new Vector(16, 16), 'mines':25},
		{'id':'hard','label':'Difficile', 'checked':false, 'field':new Vector(30, 30), 'mines':99}
	],
	"skin":[
		{'id':'default','label':'Base', 'checked':true, 'url':'imgs/minesweeper.png'}
	]
};

function Minesweeper(pLines, pCols, pMines)
{
	this.super();
	this.reset();
	this.config(pLines, pCols, pMines);
	this.loader = new MassLoader();
	this.loader.addEventListener(Event.COMPLETE, this.assetLoaded.proxy(this));
	this.loader.load({"sprite":Minesweeper.SPRITESHEET});
	this.clear();
	this.setFont("Arial", "12px", "#000000");
	this.drawText("Chargement...");
}
Class.define(Minesweeper, [Container], {
	width:null,
	height:null,
	__resetButton:null,
	squares:[],
	config:function(pLines, pCols, pMines)
	{
		this.totalMines = Math.min(pLines*pCols, pMines);
		if(this.mineCounter)
			this.mineCounter.value = this.totalMines;
		this.field = new Vector(pCols, pLines);
		this.width = Minesweeper.FIELD_X+(this.field.x*Minesweeper.SQUARE_WIDTH)+9;
		this.height = Minesweeper.FIELD_Y+(this.field.y*Minesweeper.SQUARE_HEIGHT)+9;
	},
	gameOverHandler:function()
	{
		window.clearInterval(this.timer);
		this.timer = null;
		this.__resetButton.gameOver();
	},
	gameWinHandler:function()
	{
		var i, j, max, maxj;
		for(i = 0, max = this.field.y; i<max;i++)
		{
			for(j = 0, maxj = this.field.x; j<maxj;j++)
				this.squares[i][j].removeAllEventListener();
		}
		window.clearInterval(this.timer);
		this.timer = null;
		this.__resetButton.gameWin();
	},
	assetLoaded:function()
	{
		this.clear();
		this.addEventListener(Minesweeper.GAME_OVER, this.gameOverHandler.proxy(this));
		this.addEventListener(Minesweeper.GAME_WIN, this.gameWinHandler.proxy(this));
		this.setupUI();
		this.startGame();
	},
	restartHandler:function()
	{
		this.gameOverHandler();
		this.resetField();
		if(this.mineCounter)
			this.mineCounter.value = this.totalMines;
		this.startGame();
	},
	startGame:function()
	{
		this.started = false;
		this.timeCounter.value = 0;
		this.__resetButton.reset();
		this.setupBackground();
		this.setupField();
	},
	setupBackground:function()
	{
		var w = this.width - 9;
		var h = this.height - 9;
		
		this.__resetButton.x = ((this.width)>>1)-13;
		this.timeCounter.x = w-44;

		this.clear();

		this.beginFill(Minesweeper.COLOR_BACKGROUND);
		this.drawRect(0, 0, this.width, this.height);
		this.endFill();

		this.setLineStyle(2, Minesweeper.COLOR_DOWNLINE);
		this.moveTo(7, 7);
		this.lineTo(w+2, 7);
		this.moveTo(7, 7);
		this.lineTo(7, 42);
		this.setLineStyle(2, Minesweeper.COLOR_UPLINE);
		this.moveTo(8, 43);
		this.lineTo(w+2, 43);
		this.moveTo(w+2, 7);
		this.lineTo(w+2, 43);

		this.setLineStyle(2, Minesweeper.COLOR_UPLINE);
		this.moveTo(w+1.5, Minesweeper.FIELD_Y-1.5);
		this.lineTo(w+1.5, h+1.5);
		this.moveTo(w+1.5, h+1.5);
		this.lineTo(Minesweeper.FIELD_X-1.5, h+1.5);

		this.setLineStyle(3, Minesweeper.COLOR_DOWNLINE);
		this.moveTo(Minesweeper.FIELD_X-1.5, h+1.5);
		this.lineTo(Minesweeper.FIELD_X-1.5, Minesweeper.FIELD_Y-1.5);
		this.moveTo(Minesweeper.FIELD_X-1.5, Minesweeper.FIELD_Y-1.5);
		this.lineTo(w+1.5, Minesweeper.FIELD_Y-1.5);

		this.setLineStyle(3, Minesweeper.COLOR_UPLINE);
		this.moveTo(w+1.5, Minesweeper.FIELD_Y-1.5);
		this.lineTo(w+1.5, h+1.5);
		this.moveTo(w+1.5, h+1.5);
		this.lineTo(Minesweeper.FIELD_X-1.5, h+1.5);
	},
	setupUI:function()
	{
		this.__resetButton = new ResetButton(this.loader.assets.sprite);
		this.__resetButton.y = 12;
		this.__resetButton.addEventListener(Minesweeper.RESTART, this.restartHandler.proxy(this));
		this.addChild(this.__resetButton);

		this.mineCounter = new Counter(this.loader.assets.sprite);
		this.mineCounter.x = 13;
		this.mineCounter.y = 12;
		this.mineCounter.value = this.totalMines;
		this.addChild(this.mineCounter);

		this.timeCounter = new Counter(this.loader.assets.sprite);
		this.timeCounter.y = 12;
		this.addChild(this.timeCounter);
	},
	setupField:function()
	{
		var i, j, s, max, maxj, tx, ty, n;
		for(i = 0, max = this.field.y; i<max;i++)
		{
			this.squares[i] = [];
			for(j = 0, maxj = this.field.x; j<maxj;j++)
			{
				s = new Square(this.loader.assets.sprite);
				s.x = Minesweeper.FIELD_X+(j * Minesweeper.SQUARE_WIDTH);
				s.y = Minesweeper.FIELD_Y+(i * Minesweeper.SQUARE_HEIGHT);
				s.addEventListener(Minesweeper.START, this.startHandler.proxy(this));
				s.addEventListener(MouseEvent.MOUSE_DOWN, this.squareDownHandler.proxy(this));
				s.addEventListener(MouseEvent.CLICK, this.squareUpHandler.proxy(this));
				s.addEventListener(Minesweeper.EXPLODING, this.explodeHandler.proxy(this));
				s.addEventListener(Minesweeper.DEDUCT, this.deductHandler.proxy(this));
				s.addEventListener(Minesweeper.COUNT, this.countHandler.proxy(this));
				this.addChild(s);
				this.squares[i][j] = s;
			}
		}
		for(i = 0, max = this.totalMines;i<max;i++)
		{
			tx = Math.floor(Math.random()*(this.field.x));
			ty = Math.floor(Math.random()*(this.field.y));
			if(this.squares[ty][tx].isMine)
				i--;
			else
				this.squares[ty][tx].setMine();
		}
		for(i = 0, max = this.field.y; i<max;i++)
		{
			for(j = 0, maxj = this.field.x; j<maxj;j++)
			{
				n = [];
				if(i>0)
				{
					if(j>0)
						n.push(this.squares[i-1][j-1]);
					n.push(this.squares[i-1][j]);
					if(j<maxj-1)
						n.push(this.squares[i-1][j+1])
				}
				if(j>0)
					n.push(this.squares[i][j-1]);
				if(j<maxj-1)
					n.push(this.squares[i][j+1]);
				if(i<max-1)
				{
					if(j>0)
						n.push(this.squares[i+1][j-1]);
					n.push(this.squares[i+1][j]);
					if(j<maxj-1)
						n.push(this.squares[i+1][j+1]);
				}
				this.squares[i][j].setEntourage(n);
			}
		}
	},
	deductHandler:function()
	{
		--this.mineCounter.value;
	},
	countHandler:function()
	{
		++this.mineCounter.value;
	},
	resetField:function()
	{
		if(!this.squares.length)
			return;
		var i, j, max, maxj;
		for(i = 0, max = this.squares.length; i<max;i++)
		{
			for(j = 0, maxj = this.squares[i].length; j<maxj;j++)
			{
				this.removeChild(this.squares[i][j]);
				delete this.squares[i][j];
			}
		}
		delete this.squares;
		this.squares = [];
	},
	squareDownHandler:function()
	{
		this.__resetButton.__currentState = 'square_press';
	},
	squareUpHandler:function(e)
	{
		if(e.currentTarget.isMine)
		{
			return;
		}
		var i, j, max, maxj, up = 0;
		for(i = 0, max = this.squares.length; i<max;i++)
		{
			for(j = 0, maxj = this.squares[i].length; j<maxj;j++)
			{
				if(this.squares[i][j].hidden)
					up++;
			}
		}
		if(up==this.totalMines)
			this.dispatchEvent(new Event(Minesweeper.GAME_WIN, false));
	},
	explodeHandler:function()
	{
		var i, j, max, maxj;
		for(i = 0, max = this.field.y; i<max;i++)
		{
			for(j = 0, maxj = this.field.x; j<maxj;j++)
				this.squares[i][j].explode();
		}
		this.dispatchEvent(new Event(Minesweeper.GAME_OVER, false));
	},
	startHandler:function()
	{
		this.timer = setInterval(this.tickHandler.proxy(this), 1000);
		this.timeCounter.value = 0;
		this.started = true;
	},
	tickHandler:function()
	{
		this.timeCounter.value++;
	}
});
Minesweeper.SQUARE_WIDTH = 16;
Minesweeper.SQUARE_HEIGHT = 16;
Minesweeper.NUMBER_WIDTH = 13;
Minesweeper.NUMBER_HEIGHT = 23;
Minesweeper.RESET_WIDTH = 26;
Minesweeper.RESET_HEIGHT = 26;
Minesweeper.FIELD_X = 9;
Minesweeper.FIELD_Y = 52;
Minesweeper.GAME_OVER = "evt_game_over";
Minesweeper.GAME_WIN = "evt_game_win";
Minesweeper.RESTART = "evt_restart";
Minesweeper.START = "evt_start";
Minesweeper.EXPLODING = "evt_exploding";
Minesweeper.DEDUCT = "evt_deduct";
Minesweeper.COUNT = "evt_count";
Minesweeper.SPRITESHEET = "imgs/minesweeper.png";
Minesweeper.COLOR_UPLINE = "rgb(255, 255, 255)";
Minesweeper.COLOR_DOWNLINE = "rgb(128, 128, 128)";
Minesweeper.COLOR_BACKGROUND = "rgb(192, 192, 192)";


function Square(pSprite)
{
	this.reset();
	this.sprite = pSprite;
	this.mouseEnabled = true;
	this.isMine = false;
	this.surrounded = 0;
	this.entourage = [];
	this.hidden = true;
	this.state = {"default":new Vector(2, 53),
				"empty0":new Vector(19, 53),
				"empty1":new Vector(2, 70),
				"empty2":new Vector(19, 70),
				"empty3":new Vector(36, 70),
				"empty4":new Vector(53, 70),
				"empty5":new Vector(70, 70),
				"empty6":new Vector(87, 70),
				"empty7":new Vector(104, 70),
				"empty8":new Vector(121, 70),
				"mine":new Vector(87, 53),
				"triggered_mine":new Vector(104, 53),
				"flag":new Vector(36,53),
				"dunno":new Vector(53, 53)};
	this.currentState = "default";
	this.addEventListener(MouseEvent.CLICK, this.trigger.proxy(this));
	this.addEventListener(Event.ADDED_TO_STAGE, this._addedHandler.proxy(this));
	this.__drawHandler = this.drawHandler.proxy(this);
	this.addEventListener(Event.REMOVED_FROM_STAGE, this.removedHandler.proxy(this));
}
Class.define(Square, [Sprite], {
	__drawHandler:null,
	_addedHandler:function()
	{
		this.stage.addEventListener(Event.ENTER_FRAME, this.__drawHandler);
	},
	removedHandler:function(e)
	{
		e.currentTarget.stage.removeEventListener(Event.ENTER_FRAME, e.currentTarget.__drawHandler);
		e.currentTarget.removeAllEventListener();
		e.currentTarget.state = null;
	},
	setEntourage:function(pEnt)
	{
		this.entourage = pEnt;
		for(var i = 0, max = this.entourage.length;i<max;i++)
		{
			if(this.entourage[i].isMine)
				this.surrounded++;
		}
	},
	setMine:function()
	{
		this.isMine = true;
	},
	explode:function()
	{
		this.removeAllEventListener();
		if(!this.isMine||this.currentState == "triggered_mine")
			return;
		this.mouseEnabled = false;
		this.hidden = false;
		this.currentState = "mine";
	},
	trigger:function()
	{
		if(!this.mouseEnabled)
			return;
		if(!this.parent.started)
			this.dispatchEvent(new Event(Minesweeper.START, false));
		if(this.stage.rightClick)
		{
			switch(this.currentState)
			{
				case "default":
					this.dispatchEvent(new Event(Minesweeper.DEDUCT, false));
					this.currentState = "flag";
					break;
				case "flag":
					this.dispatchEvent(new Event(Minesweeper.COUNT, false));
					this.currentState = "dunno";
					break;
				default:
					this.currentState = "default";
				break;
			}
			return;
		}
		if(this.currentState == "flag")
			return;
		this.currentState = this.isMine?"triggered_mine":"empty"+this.surrounded;
		this.mouseEnabled = false;
		this.hidden = false;
		if(!this.isMine&&this.surrounded==0)
		{
			for(var i = 0, max = this.entourage.length;i<max;i++)
				this.entourage[i].trigger();
		}
		if(this.isMine)
			this.dispatchEvent(new Event(Minesweeper.EXPLODING, false));
	},
	drawHandler:function()
	{
		this.clear();
		var s = this.state[this.currentState];
		if(!s)
			return;
		this.beginFill("rgba(0,0,0,0)");
		this.drawRect(1, 1, Minesweeper.SQUARE_WIDTH-2, Minesweeper.SQUARE_HEIGHT-2);
		this.drawImage(this.sprite, new Rectangle(s.x, s.y, Minesweeper.SQUARE_WIDTH, Minesweeper.SQUARE_HEIGHT), new Rectangle(0, 0, Minesweeper.SQUARE_WIDTH, Minesweeper.SQUARE_HEIGHT));
		this.endFill();
	}
});


function Counter(pSprite)
{
	this.super();
	this.reset();
	this.value = 0;
	this.sprite = pSprite;
	this.number = {'n1':new Vector(2, 2),
				'n2': new Vector(16, 2),
				'n3': new Vector(30, 2),
				'n4': new Vector(44, 2),
				'n5': new Vector(58, 2),
				'n6': new Vector(72, 2),
				'n7': new Vector(86, 2),
				'n8': new Vector(100, 2),
				'n9': new Vector(114, 2),
				'n0': new Vector(128, 2)};
	this.addEventListener(Event.ADDED_TO_STAGE, this._addedHandler.proxy(this));
}
Class.define(Counter, [Sprite],
{
	_addedHandler:function()
	{
		this.stage.addEventListener(Event.ENTER_FRAME, this.drawHandler.proxy(this));
	},
	drawHandler:function()
	{
		var a = Math.floor(this.value/100);
		var b = Math.floor((this.value - (a*100))/10);
		var c = this.value - (a*100) - (b*10);
		a = this.number['n'+a];
		b = this.number['n'+b];
		c = this.number['n'+c];
		this.clear();
		this.setLineStyle(1, Minesweeper.COLOR_DOWNLINE);
		this.moveTo(0, 23);
		this.lineTo(0,0);
		this.moveTo(0, 0);
		this.lineTo(39, 0);
		this.setLineStyle(1, Minesweeper.COLOR_UPLINE);
		this.moveTo(41, 1);
		this.lineTo(41, 23);
		this.moveTo(41, 25);
		this.lineTo(1, 26);
		this.drawImage(this.sprite, new Rectangle(a.x, a.y, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT), new Rectangle(1, 1, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT));
		this.drawImage(this.sprite, new Rectangle(b.x, b.y, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT), new Rectangle(14, 1, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT));
		this.drawImage(this.sprite, new Rectangle(c.x, c.y, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT), new Rectangle(27, 1, Minesweeper.NUMBER_WIDTH, Minesweeper.NUMBER_HEIGHT));
	}
});

function ResetButton(pSprite)
{
	this.super();
	this.reset();
	this.mouseEnabled = true;
	this.sprite = pSprite;
	this.__gameOver = false;
	this.state = {
		idle:new Vector(2, 26),
		this_press:new Vector(29, 26),
		square_press:new Vector(56,26),
		game_win:new Vector(83,26),
		game_over:new Vector(110, 26)
	};
	this.__currentState = "idle";
	this.addEventListener(MouseEvent.MOUSE_DOWN, this.changeStateHandler.proxy(this));
	this.addEventListener(MouseEvent.MOUSE_UP, this.resetHandler.proxy(this));
	this.addEventListener(Event.ADDED_TO_STAGE, this._addedHandler.proxy(this));
}
Class.define(ResetButton, [Sprite], {
	sprite:null,
	__gameOver:false,
	__gameWin:false,
	__currentState:null,
	_addedHandler:function()
	{
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.changeStateHandler.proxy(this));
		this.stage.addEventListener(Event.ENTER_FRAME, this.drawHandler.proxy(this));
	},
	resetHandler:function()
	{
		this.dispatchEvent(new Event(Minesweeper.RESTART, false));
	},
	gameOver:function()
	{
		this.__gameOver = true;
		this.__gameWin = false;
		this.__currentState = 'game_over';
	},
	gameWin:function()
	{
		this.__gameWin = true;
		this.__gameOver = false;
		this.__currentState = 'game_win';
	},
	reset:function()
	{
		this.__gameWin = false;
		this.__gameOver = false;
		this.__currentState = "idle";
	},
	changeStateHandler:function(e)
	{
		if(!this.mouseEnabled)
			return;
		switch(e.type)
		{
			case MouseEvent.MOUSE_DOWN:
				this.__currentState = 'this_press';
			break;
			case MouseEvent.MOUSE_UP:
				if(this.__gameWin)
					this.__currentState = 'game_win';
				else
					this.__currentState = this.__gameOver?'game_over':'idle';
			break;
		}
	},
	drawHandler:function()
	{
		this.clear();
		this.beginFill("rgba(0,0,0,0)");
		this.drawRect(1, 1, Minesweeper.RESET_WIDTH-2, Minesweeper.RESET_HEIGHT-2);
		this.endFill();
		this.drawImage(this.sprite, new Rectangle(this.state[this.__currentState].x, this.state[this.__currentState].y, Minesweeper.RESET_WIDTH, Minesweeper.RESET_HEIGHT), new Rectangle(0, 0, Minesweeper.RESET_WIDTH, Minesweeper.RESET_HEIGHT));
	}
});

function SettingButton()
{
	this.reset();
	this.gear_1 = new Bitmap("imgs/settings.png");
	this.gear_2 = new Bitmap("imgs/settings.png");
	this.gear_2.scaleX = this.gear_2.scaleY = .75;
	this.beginFill("rgba(0, 0, 0, 0)");
	this.drawRect(0, 0, 27, 16);
	this.endFill();
	this.mouseEnabled = true;
	this.addEventListener(Event.ADDED_TO_STAGE, this.__addedHandler.proxy(this));
	this.addEventListener(MouseEvent.MOUSE_OVER, this.__overHandler.proxy(this));
	this.addEventListener(MouseEvent.MOUSE_OUT, this.__outHandler.proxy(this));
}

Class.define(SettingButton, [Container],
{   gear_1:null,
	gear_2:null,
	__addedHandler:function()
	{
		this.addChild(this.gear_1);
		this.addChild(this.gear_2);
		this.gear_1.x = 8;
		this.gear_2.x = 20;
		this.gear_1.y = 8;
		this.gear_2.y = 6;
	},

	__overHandler:function()
	{
		M4Tween.to(this.gear_1, .3, {rotation:90});
		M4Tween.to(this.gear_2, .3, {rotation:-90});
	},

	__outHandler:function()
	{
		M4Tween.to(this.gear_1, .3, {rotation:0});
		M4Tween.to(this.gear_2, .3, {rotation:0});
	}
});

function MineButton(pLabel)
{
	this.reset();
	this.mouseEnabled = true;
	this.label = pLabel;
	this.addEventListener(Event.ADDED_TO_STAGE, this.__addedHandler.proxy(this));
	this.addEventListener(MouseEvent.MOUSE_DOWN, this.__downHandler.proxy(this));
}

Class.define(MineButton, [Sprite],
{
	label:null,
	padding:8,
	__width:null,
	__addedHandler:function()
	{
		this.__width = this.measureText(this.label, "visitor", "20px") + (this.padding<<1) - 2;
		this.__upHandler();
		this.stage.addEventListener(MouseEvent.MOUSE_UP, this.__upHandler.proxy(this));
	},
	__upHandler:function()
	{
		this.__redraw(Minesweeper.COLOR_UPLINE, Minesweeper.COLOR_DOWNLINE, "rgb(60, 60, 60)");
	},

	__downHandler:function()
	{
		this.__redraw(Minesweeper.COLOR_DOWNLINE, Minesweeper.COLOR_DOWNLINE, "rgb(0, 0, 0)");
		this.setLineStyle(1, Minesweeper.COLOR_BACKGROUND);
		this.moveTo(this.__width-1, 14);
		this.lineTo(this.__width-1, 0);
		this.moveTo(this.__width-1, 14);
		this.lineTo(0, 14);
	},

	__redraw:function(pTopColor, pBottomColor, pFontColor)
	{
		this.clear();
		this.beginFill(Minesweeper.COLOR_BACKGROUND);
		this.drawRect(1, 1, this.__width, 14);
		this.endFill();
		this.setLineStyle(2, pTopColor);
		this.moveTo(0, 0);
		this.lineTo(this.__width, 0);
		this.moveTo(0, 0);
		this.lineTo(0, 15);
		this.setLineStyle(2, pBottomColor);
		this.moveTo(this.__width, 15);
		this.lineTo(this.__width, 0);
		this.moveTo(this.__width, 15);
		this.lineTo(0, 15);
		this.setFont("visitor", "20px", pFontColor);
		this.drawText(this.label, this.padding, .5);
	}
});