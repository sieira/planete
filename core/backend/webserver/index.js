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

  var host, port;

  function configure() {
    server.set('views', config.FRONTEND_PATH + '/views');
    server.set('view engine', 'jade');

    server.use(logger.middleware);

    server.get('/', function (req, res) {
      res.render('index');
    });

    server.get('*', function (req, res) {
      res.status(404).send('nok');
    });
  }

  server._listen = server.listen;
  server.listen = server.init;

  // Start it up!
  server.init = function(callback) {
    if(config.NODE_ENV === 'test') {
      host = config.TEST_HOST;
      port = config.TEST_PORT;
    }
    else {
      host = config.HOST;
      port = config.PORT;
    }

    configure();

    runningInstance = server._listen(port, host, function() {
      logger.OK('Express server listening at %s:%d', host, port);
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
      logger.OK('Express server closed at %s:%d', host, port);
      callback();
    });

    // Stops the server from accepting new connections
    runningInstance.close(function(err) {
      if(err) {
        logger.error('Tried to close a server that\'s not up on %s:%s', host, port);
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
