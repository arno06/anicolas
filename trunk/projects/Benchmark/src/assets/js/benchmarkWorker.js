self.window = null;
self.addEventListener("message", function(e)
{
	var repetition = 3;
	var t1, t2, g, r;
	for(var i = 0;i<repetition; i++)
	{
		t1 = (new Date).getTime();
		for(var k = 0; k<e.data.iteration; k++)
		{
			r = eval(e.data.method+"()");
		}
		t2 = (new Date).getTime();
		g = t2 - t1;
	}
	g = Math.round((g/repetition)*100000) / 100000;
	self.postMessage({result:r, time:g});
}, false);

function test1()
{
	var tableau = ["bouboup", "niark", "yeah", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "aze", "woot"];
	var r;
	for(var i = 0, max = tableau.length;i<max;i++)
		r = tableau[i];
	return r;
}

function test2()
{
	var tableau = ["bouboup", "niark", "yeah", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "aze", "woot"];
	var r;
	for(var i in tableau)
		r = tableau[i];
	return r;
}

function test3()
{
	var tableau = ["bouboup", "niark", "yeah", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "aze", "woot"];
	var r;
	var i = 0;
	while(tableau[i]!=null)
		r = tableau[i++];
	return r;
}

function test4()
{
	var tableau = ["bouboup", "niark", "yeah", 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "aze", "woot"];
	var r;
	for(var i in tableau)
	{
		if(!tableau.hasOwnProperty(i))
			continue;
		r = tableau[i];
	}
	return r;
}

function test5()
{
	var obj = {"this":"is sparta", "bouboup":"ahah", "niark":"random", "foo":"bar", "0":"yeah", "woot":"bouboup", "1":"2"};
	var r;
	for(var i in obj)
	{
		r = obj[i];
	}
	return r;
}

function test5bis()
{
	var obj = {"this":"is sparta", "bouboup":"ahah", "niark":"random", "foo":"bar", "0":"yeah", "woot":"bouboup", "1":"2"};
	var keys = Object.keys(obj);
	var r;
	for(var i = 0, max = keys.length;i<max;i++)
	{
		r = obj[keys[i]];
	}
	return r;
}

function test6()
{
	var obj = {"this":"is sparta", "bouboup":"ahah", "niark":"random", "foo":"bar", "0":"yeah", "woot":"bouboup", "1":"2"};
	var r;
	for(var i in obj)
	{
		if(!obj.hasOwnProperty(i))
			continue;
		r = obj[i];
	}
	return r;
}

function test7()
{
	var someVar = "niark";
	if(someVar == "niark2")
	{
		return "test";
	}
	else
		return "ok";
}

function test8()
{
	var someVar = "niark";
	return someVar == "niark2"?"test":"ok";
}

function test9()
{
	var someVar = "niark";
	switch(someVar)
	{
		case "niark2":
			return "test";
		break;
		default:
			return "ok";
		break;
	}
}

function ClientClosure(pName, pAge)
{
	var name = pName;
	var age = pAge;
	return {
		greetings:function()
		{
			return "hi, my name is "+name+", i am "+age+" years old !";
		}
	};
}

function Client(pName, pAge)
{
	this.name = pName;
	this.age = pAge;
}

Client.prototype =
{
	greetings:function()
	{
		return "hi, my name is "+this.name+", i am "+this.age+" years old !";
	}
};

function test10()
{
	var c = new Client("toto", "2");
	return c.greetings();
}

function test11()
{
	var c = {
			"name":"toto",
			"age" : 2,
			greetings:function()
			{
				return "hi, my name is "+this.name+", i am "+this.age+" years old !";
			}
	};
	return c.greetings();
}

function test12()
{
	var c = new ClientClosure("toto", 2);
	return c.greetings();
}

function test13()
{
	var test = function(){var bouboup = "niark";};
	return typeof(test)=="function";
}

function test14()
{
	var test = function(){var bouboup = "niark";};
	return test instanceof Function;
}

function test15()
{
	var test = {"name":"un name", "value":"une value"};
	return typeof(test)=="object";
}

function test16()
{
	var test = {"name":"un name", "value":"une value"};
	return test instanceof Object;
}

function test17()
{
	return 16>>1;
}

function test18()
{
	return 16/2;
}

function test19()
{
	return 16 * .5;
}

function test20()
{
	var n = "16";
	return n * 1;
}

function test21()
{
	var n ="16";
	return Number(n);
}

function test22()
{
	var first = null;
	var i = 1000;
	var d, prev;
	while(i--)
	{
		d = new Dummy(i);
		if(first)
		{
			first.prev = d;
			d.next = first
		}
		first = d;
	}


	var current = first;
	while(current)
	{
		if (current.id == 499)
			return true;
		current = current.next;
	}
	return false;
}

function test23()
{
	var s = [];
	var i = 1000;
	while(i--)
	{
		s.push(new Dummy(i));
	}
	i = 1000;
	while(i--)
	{
		if(s[i].id == 499)
			return true;
	}
	return false;
}

function Dummy(pId)
{
	this.next = this.prev = null;
	this.name = "bouboup";
	this.id = pId;
}

function test24(p1, p2, p3, t)
{
	if(t == null)
		t = "valeur";
	return t;
}

function test25(p1, p2, p3, t)
{
	t = t||"valeur";
	return t;
}


function test26()
{


	function RectangleNormal(pWidth, pHeight)
	{
		this.width = pWidth;
		this.height = pHeight;
	}

	RectangleNormal.prototype =
	{
		getArea:function(){return this.width * this.height;}
	};

	var r = new RectangleNormal(100, 200);
	return r.getArea();
}
function test27()
{

	var asRectangle = (function(){
		function getArea()
		{
			return this.width * this.height;
		}
		return function() {
		    this.getArea = getArea;
		  };

	})();

	function RectangleCached (pWidth, pHeight)
	{
		this.width = pWidth;
		this.height = pHeight;
	}

	asRectangle.call(RectangleCached.prototype);
	var r = new RectangleCached(100, 200);
	return r.getArea();
}

function test28()
{
	return fact1(15);
}

function test29()
{
	return fact2(15);
}

function fact1(pNumber)
{
	var r = 1;
	for(var i = 1; i<=pNumber;i++)
	{
		r *= i;
	}
	return r;
}

function fact2(pNumber)
{
	if(pNumber>1)
		return pNumber * fact2(pNumber-1);
	else
		return 1;
}