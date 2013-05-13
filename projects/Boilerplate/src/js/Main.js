var Main =
{
    init:function()
    {
        var d = document.createElement("div");
        document.body.appendChild(d);
        var req = navigator.mozContacts.find(null);
        req.onsuccess = function()
        {
            d.innerHTML = "success : <br/>";
            d.innerHTML += "il y a : "+ this.result.length+" contacts trouvés <br/>";
            for(var i = 0, max = this.result.length;i<max;i++)
            {
                d.innerHTML += this.result[i].givenName+"<br/>";
            }
        };
        req.onerror = function(pError)
        {
            d.innerHTML = "error : "+this.error.name+"<br/>";
        };

    }
};

window.addEventListener("load", Main.init, false);