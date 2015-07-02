'use strict';
module.exports = function(app) {
    var api = require('../../app/controllers/api.server.controller');
    var bodyParser = require('body-parser');
    var multer = require('multer');
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(multer());

    app.route('/api')
        .get(api.index);
    app.route('/api/accept')
        .get(api.getaccept)
        .post(api.accept);
    app.route('/api/uber')
    	.get(api.uberAuth);
    app.route('/api/getUber')
        .get(api.getUber);
    app.route('/api/accept/handle')
        .post(api.handle);
};
