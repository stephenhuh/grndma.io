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

exports.handle = function(req, res){
    if (req.body.Digits === 1){
        res.set('Content-Type', 'test/xml');
        res.send('<Response><Say>YOOOOOO U CALLED AN UBER U CALLED AN UBER </Say></Response>');
  }
    else{
        res.set('Content-Type', 'test/xml');
        res.send('<Response><Say>U MISSED U MISSED U MISSED U MISSED</Say></Response>');
    }
};

exports.uberAuth = function(req, res) {
  var request = require('request');

request({
  url: 'https://sandbox-api.uber.com/v1/products',
  method: 'GET',
  qs: {
  'server_token': 'IjJKxQTB9RT-I6rSlvUalipTWlKdTSaf5GF-Cv29',
  'latitude': 41.9373,
  'longitude': -87.6551
  }

  }, function(err, resp, body){
   if (err)
    console.error(err);
  console.log(body);
}
);
};

exports.getUber = function(req, res) {
  var request = require('request');

request({
  url: 'https://sandbox-api.uber.com/v1/requests',
  method: 'POST',
  headers: {
    'authorization' :  'Bearer woytJBvuqvxFmcJ4MlupGOOUftHTPh'
  },
  json: {
  'product_id' : '4bfc6c57-98c0-424f-a72e-c1e2a1d49939',
  'start_latitude': 41.9373,
  'start_longitude': -87.6551,
  'end_latitude': 42.9373,
  'end_longitude': -86.6551
  }

  }, function(err, resp, body){
   if (err)
    console.error(err);

  console.log(body);

  res.send(body);
}

       );

};
