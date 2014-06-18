// set up ======================================================================
var express  = require('express'),
	fs = require('fs'),
	app = module.exports = express(), 								// create our app w/ express
	server = require('http').createServer(app),
	routes = require('./routes'),
	api = require('./routes/api');

var mongoose = require('mongoose'); 					// mongoose for mongodb

var uristring = 'mongodb://localhost/viztrends';


	app.use(express.static(__dirname + '/public'));


// routes ===========================

app.get('/', routes.index);  
app.get('/api/trends/:woeid', api.trends);
app.get('/api/available', api.available_cntry);

	

// listen (start app with node server.js) ======================================
var port = Number(process.env.PORT || 8080);
app.listen(port, function() {
  console.log("Listening on " + port);
});


/*
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Connected to: ' + uristring);
  }
});*/
