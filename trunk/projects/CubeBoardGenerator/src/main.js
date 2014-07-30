function rand(pMin, pMax){return Math.round(Math.random() * (pMax - pMin) + pMin);}

function Vector(pX, pY)
{
    this.x = pX||0;
    this.y = pY||0;
}

Vector.prototype = {
    toString:function()
    {
        return "[Object Vector x="+this.x+", y="+this.y+"]";
    }
};

var Square = (function()
{
    var position = new Vector();
    var target = new Vector();
    var style = "";
    var direction = "";

    function Square(pTargetPosition, pStyle)
    {
        this.setTarget(pTargetPosition);
        this.setPosition(pTargetPosition);
        defineStartDirection();
        style = pStyle;
    }

    Square.prototype = {
        drawTargetOnBoard:function(pBoard)
        {
            if(pBoard[target.x] == undefined ||pBoard[target.x][target.y] == undefined || pBoard[target.x][target.y] !== 0)
                return false;
            pBoard[target.x][target.y] = "g"+style;
            return true;
        },
        drawOnBard:function(pBoard)
        {
            if(pBoard[target.x][target.y] == 0)
                pBoard[target.x][target.y] = "s"+style+direction;
            else
                pBoard[target.x][target.y] += "s"+style+direction;
        },
        setTarget:function(pVector)
        {
            target = pVector;
            return target;
        },
        getTarget:function()
        {
            return target;
        },
        setPosition:function(pVector)
        {
            position = pVector;
            return position;
        },
        getPosition:function()
        {
            return position;
        },
        setDirection:function(pDirection)
        {
            direction = pDirection;
            return direction;
        },
        getDirection:function()
        {
            return direction;
        }
    };

    function defineStartDirection()
    {
        direction = CubeBoard.direction[rand(0, CubeBoard.direction.length-1)];
    }

    return Square;
})();

var CubeBoard = (function(){

    var difficulties = {
        "easy":
        {
            "square_range":[1,2],
            "move_range":[2,3]
        }
    };
    var style = "abcedf".split('');
    var direction = "lrbt".split('');
    var version = "1.0.0";
    var board_size;
    var board;
    var setup;

    function getAvailableRandPosition()
    {
        //@todo store checked positions and skip them in next iterations
        var available = false;
        var position;
        while(!available)
        {
            position = new Vector(rand(0, board_size.x-1), rand(0, board_size.y-1));
            available = board[position.x][position.y] === 0;
        }
        return position;
    }

    var CubeBoard = function(pBoardSize, pDifficulty)
    {
        board_size = pBoardSize||new Vector(5, 5);
        setup = difficulties[pDifficulty]||difficulties['easy'];
        board = null;
    };

    CubeBoard.prototype =
    {
        generate:function()
        {
            board = [];
            var line;
            for(var x = 0;x<board_size.x; x++)
            {
                line = [];
                for(var y = 0; y<board_size.y; y++)
                {
                    line.push(0);
                }
                board.push(line);
            }
            var square_count = rand(setup.square_range[0],setup.square_range[1]);

            var squares = [];
            var square;
            for(var i = 0; i<square_count; i++)
            {
                square = new Square(getAvailableRandPosition(), style[i]);

                if(!square.drawTargetOnBoard(board))
                {
                    console.error("dafuq ? impossible de positionner la cible sur la board "+square.getTarget());
                    break;
                }

                squares.push(square);
            }

            //@todo ajouter les modifiers ici - sans direction tant que les squares ne sont pas passés dessus - Redéfinir les directions des squares

            var moveCount = rand(setup.move_range[0], setup.move_range[1]) * square_count;

            for(i = 0; i<moveCount; i++)
            {

            }
        },
        toString:function()
        {
            if(!board)
                this.generate();
            var output = [];
            board.forEach(function(line){
                output.push(line.join(", "));
            });
            return output.join("\r\n");
        }
    };

    CubeBoard.style = (function(){return style;})();
    CubeBoard.direction = (function(){return direction;})();

    return CubeBoard;
})();

var b = new CubeBoard(new Vector(5, 6));

console.log("Board : \r\n"+b);