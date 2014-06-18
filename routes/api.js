/*
Twitter API integration
*/
var Twit = require('twit'),
config = require('../config'),
T = new Twit(config.twitter);
var mongoose = require('mongoose'),
	fs = require('fs');

exports.trends = function(req, res) {
  var woeid = req.params.woeid;
  T.get('trends/place', {id: woeid}, function(err, data) {
    if (typeof data === "undefined") {
      res.json({status: false});
    } else {
      res.json({trends: data, status: true});

      var Trends = {};
      var trends = data[0].trends;
      //iterate over each trend
      for(i in trends) {
      	var item = trends[i];
      	var query = item.query;

       	tweets(query, function(result) {
      		var statuses = [];
      		//iterate over each tweet
      		for (j in result) {
      			
      			var tweet = result[j];
      			statuses.push(tweet.text);
      			
      		}
      		console.log(query + ' : ' + statuses.length + ' tweets fetched');
      		Trends[item.name] = statuses;

      		writeJSONtoFile('./data/'+woeid+'.json', Trends);
      		
      	});
       	
      }
      	
    }
  });
};

// define model =================
/*var Country = mongoose.model('Country', {
	name : String,
	woeid : Number,
	countrycode : String,
});*/

exports.available_cntry = function(req, res) {
  var woeid = req.params.woeid;
  T.get('trends/available', function(err, data) {
    if (typeof data === "undefined") {
      res.json({status: false});
    } else {
      res.json({countries: data, status: true});

      //write data to file in format - woeid : country

      var Countries = {"1":"Worldwide"};
      for(i in data) {
      	var item = data[i];
      	if(item.placeType.name == 'Country') {
      		Countries[item.woeid] = item.country;
      	}
      }
      writeJSONtoFile('./data/countries.json', Countries);      
	}
  });
};

function writeJSONtoFile(filname, jsonobj) {

	    fs.writeFile(filname, JSON.stringify(jsonobj, null, 4), function(err) {
			if(err) {
			    console.log(err);
			} else {
			    console.log("JSON saved to " + filname);
			}
		});
}

function tweets(query, callback) {

	  T.get('search/tweets', {q : query}, function(err, data) {
	  	if (typeof data === "undefined") {
	      callback({status:false});
	    } else {
	     callback(data.statuses);
	  		}
	  });	
}