define(["dojo/has"], function(has){
	has.add("indexed", !!window.IndexedDB);
	return has;
});