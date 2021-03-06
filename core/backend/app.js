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
    along with along with planète.  If not, see <http://www.gnu.org/licenses/>.  If not, see <http://www.gnu.org/licenses/>
**/
var express = require('express'),
    bodyParser = require('body-parser');

var App = (function() {
  var logger = core.logger,
      config = core.config,
      i18n = core.i18n;

  var app = express(),
      runningInstance = {},
      frontend = require('#');

  var host, port;
  if(config.NODE_ENV === 'test') {
    host = config.TEST_HOST;
    port = config.TEST_PORT;
  }
  else {
    host = config.HOST;
    port = config.PORT;
  }

  app.set('host', host);
  app.set('port', port);

  app.locals.__ = i18n.__;
  app.use(logger.middleware);

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // Attach frontend routes
  var error;

  try {
    app.use('/', frontend.routes);
  } catch (err) {
    error = err;
    logger.error('Error registering frontend routes: ' + err);
    logger.stack(err.stack);
  }

  if(!error) { logger.OK('Frontend routes registered'); }

  app.init = function(callback) {
    runningInstance = app.listen(port, host, function() {
      logger.OK('Express server listening at %s:%d', host, port);
      if(callback && typeof callback == 'function') { return callback(); }
    });
  }

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

  return app;
})();

module.exports = App;
