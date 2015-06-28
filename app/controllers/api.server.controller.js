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
    if (req.body.Digits == 1){
        res.set('Content-Type', 'test/xml');
        res.send('<Response><Say>YOOOOOO U CALLED AN UBER U CALLED AN UBER </Say></Response>');
    }
    else{
        res.set('Content-Type', 'test/xml');
        res.send('<Response><Say>U MISSED U MISSED U MISSED U MISSED</Say></Response>')
    }
};

