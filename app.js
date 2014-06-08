var util = require('util'),
    twitter = require('twitter');
var twit = new twitter({
    consumer_key: '3ljHWhbS9vQwFF9JAXxLw',
    consumer_secret: 'HV0mea8vs3zAzWgroNKmPgXkgQHuZVZjXvqTSblVmM',
    access_token_key: '115687733-A1RsnXnLB790weyJXHtrFnSjzEjG0vqSyTtmmt14',
    access_token_secret: 'xxWuOw0GBanbZd1mA9WcZEYkmlsMo5wkHnhII0VW6b7OS'
});


app.get('/', twit.gatekeeper('/login'), routes.index);
app.get('/login', routes.login);
app.get('/twauth', twit.login());