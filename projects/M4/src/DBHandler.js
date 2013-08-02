window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
window.IDBTransaction = window.webkitIDBTransaction;
window.IDBKeyRange = window.webkitIDBKeyRange;

function DBHandler(pName)
{
	this.removeAllEventListener();
	this._idb = this._ressource = null;
	this._models = [];
	this._name = pName;
	this._setIDB();
}

Class.define(DBHandler, [EventDispatcher],{
	_name:null,
	_idb:null,
	_ressource:null,
	_models:null,
	db:null,
	open:function()
	{
		var ref = this;
		this._ressource = this._idb.open(this._name);
		this._ressource.onerror = function()
		{
			ref.dispatchEvent(new Event(DBHandler.DBERROR, false));
		};

		this._ressource.onsuccess = function(e)
		{
			ref.db = e.target.result;
			for(var i = 0, max = ref._models.length;i<max;i++)
				ref._models[i].setDB(ref.db);
			ref.dispatchEvent(new Event(DBHandler.READY, false));
		};

	},
	registerModel:function(pModel)
	{
		this._models.push(pModel);
	},
	createFromModel:function()
	{
		for(var i = 0, max = this._models.length;i<max;i++)
			this._models[i].create();
	},
	_setIDB:function()
	{
		this._idb = window.indexedDB;
	}
});
DBHandler.DBERROR = "evt_dberror";
DBHandler.READY = "evt_ready";

function BaseModel(){}

Class.define(BaseModel, [], {
	_name:null,
	_id:null,
	_db:null,
	_currentId:null,
	create:function()
	{
		if(this._db.objectStoreNames.contains(this._name))
			this._db.deleteObjectStore(this._name);
		this._db.createObjectStore(this._name, {keyPath:this._id});
	},
	setDB:function(pDb)
	{
		this._db = pDb;
	},
	all:function()
	{
		return this.query().all();
	},
	insert:function(pDatas)
	{
		if(!pDatas[this._id])
			pDatas[this._id] = new Date().getTime();
		return this.query().insert(pDatas);
	},
	update:function(pId, pDatas)
	{
		pDatas[this._id] = pId;
		return this.query().update(pId, pDatas);
	},
    delete:function(pId)
    {
        return this.query().delete(pId);
    },

	query:function()
	{
		return new IndexedDBQuery(this._db, this._name);
	}
});

BaseModel.RESULT_READY = "evt_result_rdy";
BaseModel.ERROR_RESULT = "err_result";


function IndexedDBQuery(pDb, pName)
{
	this._result = [];
    this._transaction = pDb.transaction([pName], 1);
    this._store = this._transaction.objectStore(pName);
	this._resultHandler = this._errorHandler = null;
}

Class.define(IndexedDBQuery, [], {
	_transaction:null,
	_store:null,
	_resultHandler:null,
	_errorHandler:null,
	_result:null,
	all:function()
	{
		var ref = this;
		var keyRange = IDBKeyRange.lowerBound(0);
		var cursor = this._store.openCursor(keyRange);
		cursor.onsuccess = function(e)
		{
			var r = e.target.result;
			if(!r)
			{
				ref._triggerResult();
				return;
			}
			ref._result.push(r.value);
			r["continue"]();
		};
		return this;
	},
	insert:function(pDatas)
	{
		var q = this._store.put(pDatas);
		q.onsuccess = M4.proxy(this, this._triggerResult);
		return this;
	},
    delete:function(pId)
    {
        var q = this._store.delete(pId);
        q.onsuccess = M4.proxy(this, this._triggerResult);
        return this;
    },
	update:function(pId, pDatas)
	{
		var ref = this;
		var keyRange = IDBKeyRange.only(pId);
		var cursor = this._store.openCursor(keyRange);
		cursor.onsuccess = function(e)
		{
			var r = e.target.result;
			if(!r)
				return;
			var d = r.value;
			for(var i in pDatas)
				d[i] = pDatas[i];
			var req = r.update(d);
			req.onsuccess = function()
			{
				ref._triggerResult();
			};
		};
		return this;
	},
	_triggerResult:function()
	{
		if(this._resultHandler)
			this._resultHandler(this._result);
	},
	onResult:function(pHandler)
	{
		this._resultHandler = pHandler;
		return this;
	},
	onError:function(pHandler)
	{
		this._errorHandler = pHandler;
		return this;
	}
});