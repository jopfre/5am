require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;

let _db;

module.exports = {
  connect: function( callback ) {
    MongoClient.connect(process.env.DBURI, {useNewUrlParser: true}, (err, db) => {
			if(err) {
				console.log(err);
			} else {
				console.log('Connected to MongoDB');
		    _db = db.db("5am");
		    return callback( err )
			}
		});	
  },
  getDb: function() {
    return _db;
  },
  close: function() {
  	MongoClient.close();
  }
};