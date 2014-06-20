/*
Twitter API integration
*/
var Twit = require('twit'),
config = require('../config'),
T = new Twit(config.twitter),
  fs = require('fs');
var _ = require('underscore'),  //to use utility functions
    q = require('q'); // to use promises

exports.trends = function(req, res) {
  var woeid = req.params.woeid; //woeid denotes id for a country

  /*get latest trends hashtags of a country*/
  T.get('trends/place', {id: woeid}, function(err, data) {
    if (typeof data === "undefined") {
      res.json({status: false});
    } else {

      var TrendsFile = {};
      var trends = data[0].trends;

      get_all_tweets(trends, TrendsFile).then(function(v) {
        writeJSONtoFile('./data/'+woeid+'.json', TrendsFile);
        res.json({status: true});
      }, function(err) {
        res.json({status: false, err: 'error fetching tweets'});
      });
        
    }
  });
};

// define model =================
/*var Country = mongoose.model('Country', {
  name : String,
  woeid : Number,
  countrycode : String,
});*/

/*get woeid of countries*/
exports.available_cntry = function(req, res) {
  
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
/*write JSON content to a file*/
function writeJSONtoFile(filname, jsonobj) {

      fs.writeFile(filname, JSON.stringify(jsonobj, null, 4), function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("JSON saved to " + filname);
      }
    });
}

/*get tweets of a hashtag*/
function getTweets(query) {

    var d = q.defer();

    T.get('search/tweets', {q : query}, function(err, data) {
      if (typeof data === "undefined") {
        d.reject({status:false});
        //callback({status:false});
      } else {
       //callback(data.statuses);
       d.resolve(data.statuses);
        }
    });
    return d.promise;
}

/*fetch tweets of a list of trends and save it in file*/
function get_all_tweets(trends, TrendsFile) {
  var all_promises = [];

      _.each(trends, function(item) {
        var deferred = q.defer();

        var query = item.query;
        getTweets(query).then(function(tweets){
                                  var statuses = [];
                                  _.each(tweets, function(tweet) {
                                         statuses.push(tweet.text); TrendsFile[item.name] = statuses; console.log('fetching for :'+item.name);
                                    }); 
                                  deferred.resolve(TrendsFile);
                        });
        all_promises.push(deferred.promise);

      });

      return q.all(all_promises);
}