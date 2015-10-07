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

var Logger = (function _Logger() {
  var logger = {};

  var Color = {
    GREEN_FG: '\x1b[32m',
    MAGENTA_FG: '\x1b[35m',
    RED_FG: '\x1b[31m',
    RESET:  '\x1b[0m',
    YELLOW_FG: '\x1b[33m'
  };

  function colorLogger(tag, color) {
    return function() {
      var config = require('_').config;
      if(config.NODE_ENV != 'test') {
        var args = [].slice.call(arguments);
        console.log.apply(null, ['%s [%s] %s [%s] ' + args.shift(), color, tag, Color.RESET, Date(Date.now())].concat(args));
      }
    }
  }

  logger.init = function(callback) {
    logger.OK('Logger is configured');

    if(callback && typeof callback == 'function') { return callback(); }
  };
  logger.close = function() {};
  logger.new = function() {
    return new _Logger();
  };

  logger.log = console.log;
  logger.info = colorLogger('i', Color.YELLOW_FG);
  logger.OK = colorLogger('✔', Color.GREEN_FG);
  logger.error = colorLogger('x', Color.RED_FG);

  logger.middleware = function(req, res, next) {
    var ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;
    var url = req.originalUrl || req.url;


    logger.info('%s %s request from %s ', req.method, url, ip);
    next();
  }

  return logger;
})();

module.exports = Logger;
