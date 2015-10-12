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
'use strict';

var Logger = (function _Logger() {
  var CoreModule = require('_/core-module'),
      config = require('_').config;

  var logger = new CoreModule(__dirname);

  var Color = {
    BLUE_FG: '\x1b[34m',
    GREEN_FG: '\x1b[32m',
    MAGENTA_FG: '\x1b[35m',
    RED_FG: '\x1b[31m',
    RESET:  '\x1b[0m',
    YELLOW_FG: '\x1b[33m'
  };

  function colorLogger(tag, color) {
    return function() {
      if(config.NODE_ENV != 'test') {
        var args = [].slice.call(arguments);
        console.log.apply(null, ['%s [%s] %s [%s] ' + args.shift(), color, tag, Color.RESET, Date(Date.now())].concat(args));
      }
    }
  }

  logger.close = function() {};
  logger.new = function() {
    return new _Logger();
  };

  logger.log = console.log;
  logger.info = colorLogger('i', Color.YELLOW_FG);
  logger.OK = colorLogger('✔', Color.GREEN_FG);
  logger.error = colorLogger('x', Color.RED_FG);
  logger.http = colorLogger('ǁ', Color.BLUE_FG);
  logger.stack = logger.error;

  logger.middleware = function(req, res, next) {
    var ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
    var url = req.originalUrl || req.url;

    req.on('end', function() {
      logger.http('%s - "%s %s" %d', ip, req.method, url, res.statusCode);
    });
    next();
  }

  logger.OK('Logger is configured');

  return logger;
})();

module.exports = Logger;
