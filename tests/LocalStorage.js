define([
	"doh/main",
	"../LocalStorage"
], function(doh, LocalStorage){
	var store = new LocalStorage({storeId: "test"});
	doh.register("localdb/tests/LocalStorage", {
		"io": {
			runTest: function(t){
				store.put({
					id: 1,
					name: "One",
					odd: true
				});
				doh.is(store.get(1).name, "One");
				doh.is(store.get(1).odd, true);
				doh.is(store.getIdentity(store.get(1)), 1);
				store.add({
					id: 2,
					name: "Two",
					odd: false
				});
				doh.is(store.get(2).name, "Two");
				doh.is(store.get(2).odd, false);
				doh.is(store.get(1).name, "One");
				var overwriteAllowed;
				try{
					store.put({
						id: 2,
						name: "Three",
						odd: false
					}, {overwrite: false});
					overwriteAllowed = true;
				}catch(e){
				}
				doh.f(overwriteAllowed);
				doh.is(store.get(2).name, "Two");
				doh.is(store.query().length, 2);
				var length = 0;
				store.query({odd:true}).forEach(function(object){
					doh.is(object.odd, true);
					length++;
				});
				doh.is(length, 1);
				store.remove(1);
				doh.is(store.get(1), undefined);
				store.remove(2);
				doh.is(store.get(2), undefined);
				doh.is(store.query().length, 0);
				store.query({odd:true}).forEach(function(object){
					doh.error("should be empty");
				});
			}
		}
	}, function(){}, function(){
				store.remove(1);
				store.remove(2);				
	});
});
