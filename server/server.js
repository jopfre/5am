require('dotenv').config();

const express = require('express');
const mongoClient = require('./mongo-client');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 8080;

// console.log(process.env.NODE_ENV);

mongoClient.connect((err) => {
	const routes = require('./routes.js');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	
	app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});

	app.use('/', routes);

	app.listen(port, () => {
		console.log(`Listening on http://localhost:${port}`);
	});
});