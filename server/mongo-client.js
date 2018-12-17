const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
var path = require('path');

const creds = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'creds.json'), 'utf8'));

const uri = creds.srv;

let _db;

module.exports = {
  connect: function( callback ) {
    MongoClient.connect(creds.srv, {useNewUrlParser: true}, (err, db) => {
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