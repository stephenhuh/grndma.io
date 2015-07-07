'use strict';

var request = require('request');

request({
  url: 'https://api.uber.com/v1/products',
  method: 'GET',
  qs: {
  'server_token': 'IjJKxQTB9RT-I6rSlvUalipTWlKdTSaf5GF-Cv29',
  'latitude': 41.9373,
  'longitude': -87.6551
  }

  
}, function(err, req, body){
  if (err)
   	console.error(err);
  	console.log(body);
}
        
       );
