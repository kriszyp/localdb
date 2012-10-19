define(["dojo/_base/declare"], function(declare) {
  //  module:
  //    dojo/store/LocalStorage
  //  summary:
  //    The module defines an object store based on local storage


return declare([], {
	constructor: function(config){
		this.database = openDatabase(config.name || "db", true, true, true);// TODO: what are these arguments supposed to be?
		this.table = config.table;
		this.idColumn = config.idColumn || "id";
		this.indexPrefix = config.indexPrefix || "idx_";
	},
	idProperty: "id",
	selectColumns: ["*"],
	get: function(id){
		return when(this.executeSql("SELECT " + this.selectColumns.join(",") + " FROM " + this.table + " WHERE " + idColumn + "=?", [id]), function(result){
			return first(result.rows);
		});
	},
	getId: function(object){
		return object[idColumn];
	},
	"delete": function(id){
		return store.executeSql("DELETE FROM " + config.table + " WHERE " + idColumn + "=?", [id]); // Promise
	},
	identifyGeneratedKey: true,
	add: function(object, directives){
		var params = [], vals = [], cols = [];
		for(var i in object){
			if(object.hasOwnProperty(i)){
				cols.push(i);
				vals.push('?');
				params.push(object[i]);
			}
		}
		if(store.identifyGeneratedKey){
			params.idColumn = config.idColumn;
		}
		var sql = "INSERT INTO " + config.table + " (" + cols.join(',') + ") VALUES (" + vals.join(',') + ")";
		return when(store.executeSql(sql, params), function(results) {
			var id = results.insertId;
			object[idColumn] = id;
			return id;
		});
	},
	put: function(object, directives){
		directives = directives || {}; 
		var id = directives.id || object[this.idProperty];
		var overwrite = directives.overwrite;
		if(overwrite === undefined){
			overwrite = this.get(id);
		}

		if(!overwrite){
			store.add(object, directives);
		}
		var sql = "UPDATE " + config.table + " SET ";
		var first = true;
		var params = [];
		for(var i in object){
			if(object.hasOwnProperty(i)){
				if(first) first = false;
				else sql += ",";
				sql += i + "=?";
				params.push(object[i]);
			}
		}
		sql += " WHERE " + idColumn + "=?";
		params.push(object[idColumn]);

		return when(store.executeSql(sql, params), function(result){
			return id;
		});
	},
	query: function(query, options){
	
	},
	executeSql: function(sql, parameters){
		var deferred = defer();
		var result, error;
		database.executeSql(sql, parameters, function(value){
			deferred.resolve(result = value);
		}, function(e){
			deferred.reject(error = e);
		});
		// return synchronously if the data is already available.
		if(result){
			return result;
		}
		if(error){
			throw error;
		}
		return deferred.promise;
	}
	
});
});
