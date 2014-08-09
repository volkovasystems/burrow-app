Cellar
==============
### Brainless short-term single-document storage for MongoDB

`Cellar` is a small module built on top of [Mongoose](http://www.mongoosejs.com) to allow easy short-term storage of simple schemas.

It's primary purpose is for storage of OAuth tokens and other data that you need cached for a short period.

Installation
-------------

Through [NPM](http://www.npmjs.org)
``` bash
$ npm install cellar
```

 or using Git
``` bash
$ git clone git://github.com/treygriffith/cellar.git node_modules/cellar/
```

API/How to Use
-----------

#### Instantiate Cellar with a collection name, mongoDB details or a Mongoose instance, and a schema

``` javascript
// with Mongoose and Mongoose Schema

var mongoose = require('mongoose');
var mongoUrl = 'mongodb://' + db.user + ':' + db.pass + '@' + db.host + ':' + db.port + '/' + db.name;
mongoose.connect(mongoUrl);

var myschema = mongoose.Schema({hello: String, stored_by: String});

var cellar = new Cellar('mystore', mongoose, myschema, {maxAge:3});


// with mongoDB details and object literal of Schema (maxAge of -1 stores docs forever)

var cellar = new Cellar('mystore', {user:db.user, pass:db.pass, host:db.host, port:db.port, name:db.name}, {hello: String, stored_by: String}, {maxAge:-1});
```

#### Cellar exposes 3 methods:

1. `store` - Create and update documents in the collection

	``` javascript
	// Create Doc/Insert
	cellar.store({hello: "world", stored_by: "cellar"}, function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log(doc,'sucessfully stored');
		}
	});

	// Update existing
	// As of 0.0.2, this syntax will upsert, resulting in a document of {hello: "planet", stored_by: "cellar"}
	cellar.store({stored_by: "cellar"}, {hello: "planet"}, function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log(doc,'sucessfully updated');
		}
	})
	```

2. `retrieve` - Find and return single documents in the collection

	``` javascript
	// Find whole doc
	cellar.retrieve({stored_by: "cellar"}, function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log(doc,'found');
		}
	});

	// Find doc with only 1 field returned
	cellar.retrieve({stored_by: "cellar"}, ["hello"], function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log(doc,'found');
		}
	});
	```

3. `retrieve_field` - Find and return the contents of a single field on a single document in the collection

	``` javascript
	// Find contents of one field
	cellar.retrieve_field({stored_by: "cellar"}, "hello", function(err, hello) {
		function(err, doc) {
		if(err) {
			console.log(err);
		} else {
			console.log('hello '+hello); // prints 'hello world'
		}
	})
	```
