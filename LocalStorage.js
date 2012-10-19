define(["dojo/_base/declare", "dojo/store/Memory", "dojo/json"], function(declare, Memory, JSON) {
  //  module:
  //    dojo/store/LocalStorage
  //  summary:
  //    The module defines an object store based on local storage


return declare([Memory], {
	// summary:
	//		This is a local storage object store. It implements dojo.store.api.Store.
	//	storeId: String
	//		An identifier for the local store, allows you to have distinct local stores by setting unique ids on each
	storeId: "default-store",
	constructor: function(args){
		this.idPrefix = args.storeId + "-";
	},
	get: function(id){
		//	summary:
		//		Retrieves an object by its identity
		//	id: Number
		//		The identity to use to lookup the object
		//	returns: Object
		//		The object in the store that matches the given id.
		return JSON.parse(localStorage.getItem(this.idPrefix + id));
	},
	put: function(object, options){
		// 	summary:
		//		Stores an object
		// 	object: Object
		//		The object to store.
		// 	options: dojo.store.api.Store.PutDirectives??
		//		Additional metadata for storing the data.  Includes an "id"
		//		property if a specific id is to be used.
		//	returns: Number
		var data = this.data,
			index = this.index,
			options = options || {},
			idProperty = this.idProperty;
		var id = this.idPrefix + (object[idProperty] = (options && "id" in options) ? options.id : idProperty in object ? object[idProperty] : Math.random());
		if(typeof options.overwrite == "boolean"){
			if((localStorage.getItem(id) == null) == options.overwrite){ 
				throw new Error("Overwrite " + (options.overwrite ? "required" : "not allowed"));
			}
		}
		localStorage.setItem(id, JSON.stringify(object));
		return this.inherited(arguments);
	},
	remove: function(id){
		// 	summary:
		//		Deletes an object by its identity
		// 	id: Number
		//		The identity to use to delete the object
		// returns: Boolean
		// 		Returns true if an object was removed, falsy (undefined) if no object matched the id
		localStorage.removeItem(this.idPrefix + id);
		return this.inherited(arguments);
	},
	query: function(query, options){
		// 	summary:
		//		Queries the store for objects.
		// 	query: Object
		//		The query to use for retrieving objects from the store.
		//	options: dojo.store.api.Store.QueryOptions?
		//		The optional arguments to apply to the resultset.
		//	returns: dojo.store.api.Store.QueryResults
		//		The results of the query, extended with iterative methods.
		//
		// 	example:
		// 		Given the following store:
		//
		// 	|	var store = new dojo.store.Memory({
		// 	|		data: [
		// 	|			{id: 1, name: "one", prime: false },
		//	|			{id: 2, name: "two", even: true, prime: true},
		//	|			{id: 3, name: "three", prime: true},
		//	|			{id: 4, name: "four", even: true, prime: false},
		//	|			{id: 5, name: "five", prime: true}
		//	|		]
		//	|	});
		//
		//	...find all items where "prime" is true:
		//
		//	|	var results = store.query({ prime: true });
		//
		//	...or find all items where "even" is true:
		//
		//	|	var results = store.query({ even: true });
		if(!this._loaded){
			// load the data from local storage
			this._loaded = true;
			var index = this.index = {};
			var data = this.data = [];
			var idPrefix = this.idPrefix;
			var idPrefixLength = idPrefix.length;
			for(var i = 0, l = localStorage.length; i < l; i++){
				// iterate through each key
				var key = localStorage.key(i);
				
				if(key.slice(0, idPrefixLength) == idPrefix){
					var object = JSON.parse(localStorage.getItem(key));
					index[object[this.idProperty]] = data.push(object) - 1;
				}
			}
		}
		return this.inherited(arguments);
	}
});

});
