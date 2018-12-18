const express = require('express');
const routes = express.Router();

const mongoClient = require('./mongo-client');

const { PerformanceObserver, performance } = require('perf_hooks');

const obs = new PerformanceObserver((items) => {
  console.log(items.getEntries()[0].name+' took '+items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ['measure'] });

let db = mongoClient.getDb();
const lidar = db.collection('lidar');

routes.route('/lidar')
  .get((req, res) => {
    let lat =  req.query.lat.substr(1);
    let lon = req.query.lon.substr(1);
    var id = 'st'+lat+lon;

    console.log("Finding "+id);
    performance.mark('A');

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
    }).catch(function(err){
      console.log(err);
    });
    performance.mark('B');
    performance.measure('Find '+id, 'A', 'B');

  });

module.exports = routes;