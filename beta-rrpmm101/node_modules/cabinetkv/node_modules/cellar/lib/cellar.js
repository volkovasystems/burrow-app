// Cellar - Brainless short-term single document storage for MongoDB
// by Trey Griffith at Endorse.me
// see https://github.com/treygriffith/cellar

// An even simpler Key-Value version of Cellar is in Cabinet (https://github.com/treygriffith/cabinet).

var _mongoose = require('mongoose');


// Cellar
// Initialize an Cellar instance

// ### Arguments
// * `name` - String name of the mongoDB collection
// * `mongoose` - Object instance of Mongoose or Object literal of mongoDB credentials
// * `schema` - Instance of Mongoose#Schema or Object literal that can be instantiated as a Mongoose Schema
// * `options` - Object of additional options
//		- Properties
//			* `maxAge` - Number of days that a document should remain in the store. -1 will not remove any documents. Defaults to 1.
//			* `verbose` - Determines whether a success message is logged when removing old documents

// ### Returns
// * Instance of Cellar

function Cellar(name, mongoose, schema, options) {
	// connect to mongodb if they pass credentials
	if(mongoose.constructor.name === 'Object') {
		var mongoUrl = 'mongodb://' + mongoose.user + ':' + mongoose.pass + '@' + mongoose.host + ':' + mongoose.port + '/' + mongoose.name;
		mongoose = _mongoose.connect(mongoUrl);
	}
	// create a schema instance if they pass the literal
	schema = schema instanceof mongoose.Schema ? schema : new mongoose.Schema(schema);

	options = options || {};
	//default maxAge is 1 day, -1 means no expiration
	var maxAge = (typeof options.maxAge === undefined ? 1 : options.maxAge);
	// initialize lastChecked as a long time ago
	var lastChecked = new Date(0);
	// add an `updated_at` field to track when the document was last touched
	schema.add({updated_at: {type: Date, required:true, "default": Date.now}});

	// instantiate the model
	var mongoose_model = mongoose.model(name, schema);

	// prune

	// Private
	// Remove expired documents from the collection

	// ### Arguments
	// None

	// ### Returns
	// None

	function prune() {
		//check if this database is meant to be pruned
		if(~maxAge) {
			var d = new Date();
			d.setDate(d.getDate() - maxAge);

			if(lastChecked < d) { // make sure we're not trying to prune more often than at least maxAge since the last time we did
				mongoose_model.remove()
					.where('updated_at').lt(d)
					.exec(function(error, numAffected) {
						lastChecked = new Date(); //update our lastChecked to reflect our touching the database
						if(error) {
							console.log("Error while removing docs from database", error);
						} else {
							if(options.verbose) {
								console.log("Removed "+numAffected+" old docs from the database.");
							}
						}
					});
			}
		}
	}

	// Cellar#store

	// Public
	// Create or update a document in the collection

	// ### Arguments
	// * `where` - Optional Object describing criteria by which to update the document (see http://www.mongodb.org/display/DOCS/Querying)
	// * `data` - Object of data to update or create the document
	// * `callback` - Function to be evaluated upon completion of the insert/update
	//		- Arguments
	//			1. Error
	//			2. Mongoose document created or updated

	// ### Returns
	// * Instance of Cellar

	this.store = function(where, data, callback) {
		if(arguments.length < 3) {
			callback = data;
			data = where;
			where = null;
		}

		if(where) {
			//update
			data.updated_at = Date.now();
			for(var p in where) {
				if(where.hasOwnProperty(p)) {
					if(typeof data[p] === 'undefined') {
						// add all the `where` properties to the replacement doc (where there are no conflicts) in case this document gets upserted
						data[p] = where[p];
					}
				}
			}
			mongoose_model.findOneAndUpdate(where, data, {upsert:true}, callback);
		} else {
			//insert
			var store = new mongoose_model(data);
			store.save(callback);
		}
		//prune the db
		prune();
		return this;
    };

    // Cellar#retrieve

	// Public
	// Find a document in the collection

	// ### Arguments
	// * `where` - Object of criteria by which to find the document (see http://www.mongodb.org/display/DOCS/Querying)
	// * `fields` - Optional Array of String field names to retrieve on the document
	// * `callback` - Function to be evaluated upon completion of the find operation
	//		- Arguments
	//			1. Error
	//			2. Mongoose document that matched the criteria or null if no document matched

	// ### Returns
	// * Instance of Cellar

    this.retrieve = function(where, fields, callback) {
		if(arguments.length < 3 || fields === undefined || fields === null) {
			fields = [];
		}
		var args = [where];
		if(fields.length) {
			args.push(fields.join(" "));
		}
		args.push(callback);
		mongoose_model.findOne.apply(mongoose_model, args);
		return this;
    };

    // Cellar#retrieve_field

	// Public
	// Find the contents of one field on a document in the collection

	// ### Arguments
	// * `where` - Object of criteria by which to find the document where the field is (see http://www.mongodb.org/display/DOCS/Querying)
	// * `field` - String name of field desired
	// * `callback` - Function to be evaluated after the find is completed
	//		- Arguments
	//			1. Error - will also return an error if looking for a field on a document which does not have the field
	//			2. Contents of `field` in a matching document, or null if no document matched

	// ### Returns
	// * Instance of Cellar

    this.retrieve_field = function(where, field, callback) {
		this.retrieve(where, [field], function(error, doc) {
			if(error || !doc) {
				callback(error);
				return;
			}
			if(!doc[field]) {
				callback(new Error(field+" does not exist in this document"));
				return;
			}
			callback(null, doc[field]);
		});
		return this;
    };

    return this;
}

module.exports = Cellar;