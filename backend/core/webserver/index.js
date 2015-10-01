'use strict';

var express = require('express');

var Server = (function () {
  var app = express();
  var server;

  function configure() {
    // TODO get options from config module
    var options = {};

    app.set('port', options.port || process.env.PORT || 8080);
    app.set('ip', process.env.HOST || 'localhost');
  }

  return {
    // Start it up!
    init: function() {
      configure();
      server = app.listen(app.get('port'), app.get('ip'), function() {
        // TODO log through the logger module
        console.log('\x1b[33m' + 'Running in '+ process.env.NODE_ENV + ' mode\x1b[0m');
        console.log('\x1b[32m✔\x1b[0m [%s] Express server listening at %s:%d', Date(Date.now()), app.get('ip'),app.get('port'));
      });
    }
  }
})();

module.exports = Server;
