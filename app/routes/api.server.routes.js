'use strict';

module.exports = function(app) {
    var api = require('../../app/controllers/api.server.controller');
    app.route('/api')
        .get(api.index);
    app.route('/api/accept') 
        .get(api.getaccept)
        .post(api.accept);
};
