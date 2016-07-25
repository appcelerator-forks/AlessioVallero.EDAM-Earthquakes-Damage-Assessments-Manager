// This is the model for the ATC20FormsRapidPosting table on DB
exports.definition = {
	config: {
		columns: {
		    "FORM_ID": "integer PRIMARY KEY" ,
            "POSTING": "TEXT" ,
            "CLASSIFICATION": "TEXT" ,
		    "USE_AND_ENTRY_RESTRICTIONS": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "ATC20FormsRapidPosting" ,
            db_name: "EEM" ,
            idAttribute: "FORM_ID"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};