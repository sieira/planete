'use strict';

var express = require('express'),
    logger = require('_').logger,
    config = require('_').config;

/**
 * This is the main web server
 * it creates an instance of
 */
var Server = (function () {
  var server = express(),
      runningInstance = {};

  function configure(server) {
    server.get('/', function (req, res) {
      res.status(200).send('ok');
    });

    server.get('*', function (req, res) {
      res.status(404).send('nok');
    });
  }

  // Start it up!
  server.init = function(callback) {
    configure(this);

    runningInstance = this.listen(config.PORT, config.HOST, function() {
      logger.info('Running in '+ config.NODE_ENV + ' mode');
      logger.OK('Express server listening at %s:%d', config.HOST, config.PORT);
      if(callback) { callback(); }
    });
  };

  server.close = function(callback) {
    if(!runningInstance.close) {
      if(callback) { return callback('Tried to close a server that\'s not up'); }
      else { return; }
    }
    // Stops the server from accepting new connections and keeps existing connections.
    runningInstance.close(function(err) {
      if(err) {
        logger.error('Tried to close a server that\'s not up on %s:%s', config.HOST, config.PORT);
        if(callback) { return callback(err); }
        else { return; }
      }
      logger.OK('Express server closed at %s:%d', config.HOST, config.PORT);
      if(callback) { return callback(); }
      else { return; }
    });
  };

  server.on = function(event, handler) {
    runningInstance.on(event,handler);
  };

  server.once = function(event, handler) {
    runningInstance.once(event,handler);
  };

  return server;
})();

module.exports = Server;
