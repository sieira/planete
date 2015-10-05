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

  function configure() {
    server.get('/', function (req, res) {
      res.status(200).send('ok');
    });

    server.get('*', function (req, res) {
      res.status(404).send('nok');
    });
  }

  // Start it up!
  server.init = function(callback) {
    configure();

    runningInstance = server.listen(config.PORT, config.HOST, function() {
      logger.OK('Express server listening at %s:%d', config.HOST, config.PORT);
      if(callback && typeof callback == 'function') { return callback(); }
    });
  };

  server.close = function(callback) {
    if(!runningInstance.close) {
      if(callback && typeof callback == 'function') { return callback('Tried to close a server that\'s not up'); }
      else { return; }
    }

    // Once the server closes, log it and rock the callback
    if(callback && typeof callback == 'function') runningInstance.once('close', function() {
      logger.OK('Express server closed at %s:%d', config.HOST, config.PORT);
      callback();
    });

    // Stops the server from accepting new connections
    runningInstance.close(function(err) {
      if(err) {
        logger.error('Tried to close a server that\'s not up on %s:%s', config.HOST, config.PORT);
        if(callback && typeof callback == 'function') { return callback(err); }
        else { return; }
      }
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
