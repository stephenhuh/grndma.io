'use strict';

exports.index = function(req, res) {
    res.render('index', {
        user: req.user || null,
        request: req
    });
};

exports.getaccept = function(req, res) {
    res.json('get reqx');
};

exports.accept = function(req, res) {
    res.set('Content-Type', 'text/xml');
    res.sendFile(__dirname + '/1.xml');
};

exports.uberAuth = function(req, res) {
  var request = require("request")

request({
  url: 'https://api.uber.com/v1/products',
  method: "GET",
  qs: {
  'server_token': 'IjJKxQTB9RT-I6rSlvUalipTWlKdTSaf5GF-Cv29',
  'latitude': 41.9373,
  'longitude': -87.6551
  }

  }, function(err, resp, body){
   if (err)
    console.error(err)
  console.log(body)
}
        
       )
};

exports.uberOAuth2 = function (req, resp){
  
};