/**
Copyright © 2015 Luis Sieira Garcia

This file is part of Planète.

    Planète is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Planète is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>
**/
'use strict';

var express = require('express'),
    core = require('_'),
    CoreModule = require('_/core-module'),
    bodyParser = require('body-parser'),
    logger = core.logger,
    config = core.config;

/**
 * This is the main web server
 * it creates an instance of
 */
var Server = (function () {
  var server = new CoreModule(__dirname);

  var app = express(),
      runningInstance = {},
      frontend = require('#');

  var host, port;

  function configure() {
    app.locals.__ = core.i18n.__;
    app.use(logger.middleware);

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());


    // Attach frontend routes
    var error;

    try {
      frontend.registerRoutes(app);
    } catch (err) {
      error = err;
      logger.error('Error registering frontend routes: ' + err);
      logger.error(err.stack);
    }

    if(!error) { logger.OK('Frontend routes registered'); }
  }

  app.static = express.static;

  // Start it up!
  app.init = function(callback) {
    if(config.NODE_ENV === 'test') {
      host = config.TEST_HOST;
      port = config.TEST_PORT;
    }
    else {
      host = config.HOST;
      port = config.PORT;
    }

    configure();

    runningInstance = app.listen(port, host, function() {
      //TODO guess what happened with this
      app.address = runningInstance.address;
      logger.OK('Express server listening at %s:%d', host, port);
      if(callback && typeof callback == 'function') { return callback(); }
    });
  };

  /** This has to be reviewed, but well... it works. */
  app.close = function(callback) {
    if(!runningInstance.close) {
      logger.error('Tried to close a server that\'s not up on %s:%s', host, port);
      throw new Error('Not running');
    }

    // Stops the server from accepting new connections
    runningInstance.close(function(err) {
      runningInstance = undefined;
      if(err) {
        logger.error('Tried to close a server that\'s not up on %s:%s', host, port);
        if(callback && typeof callback == 'function') { return callback(err); }
      }
      logger.OK('Express server closed at %s:%d', host, port);
      if(callback && typeof callback == 'function') { return callback() };
    });
  };

  return new Proxy(server, {
    /**
     * When calling any property, checks if it is part of the core-module functionality,
     * and if it is not, return the app equivalent
     */
     get: function(target, property, receiver) {
       return server[property] === undefined ? app[property] : server[property];
     }
   });
})();

module.exports = Server;
