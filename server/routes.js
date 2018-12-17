const express = require('express');
const routes = express.Router();

const mongoClient = require('./mongo-client');

let db = mongoClient.getDb();
const lidar = db.collection('lidar');

routes.route('/lidar')
  .get((req, res) => {
    let lat =  req.query.lat.substr(1);
    let lon = req.query.lon.substr(1);
    var id = 'st'+lat+lon;

    console.log("Finding "+id);

		lidar.findOne(
      {_id: id},
      {projection: { data: 1 }},
    ).then(function(doc) {
      if(!doc) {
        console.log(id+' not found.');
      } else {
        console.log(id+' found.')
        res.json(doc);
      }
    });
  });

module.exports = routes;