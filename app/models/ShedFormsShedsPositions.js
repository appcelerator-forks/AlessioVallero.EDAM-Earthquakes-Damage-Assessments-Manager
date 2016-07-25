// This is the model for the ShedFormsShedsPositions table on DB
exports.definition = {
	config: {
        columns: {
            "FORM_ID": "integer PRIMARY KEY" ,
            "LATITUDE": "TEXT" ,
            "LONGITUDE": "TEXT" ,
            "ALTITUDE": "TEXT" ,
            "PROVINCE": "TEXT" ,
            "MUNICIPALITY": "TEXT" ,
            "PLACE": "TEXT" ,
            "ADDRESS": "TEXT" ,
            "CIVIC_NO": "TEXT"
        },
		adapter: {
			type: "sql",
			collection_name: "ShedFormsShedsPositions" ,
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