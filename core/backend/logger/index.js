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
      var args = [].slice.call(arguments);
      console.log.apply(null, ['%s [%s] %s [%s] ' + args.shift(), color, tag, Color.RESET, Date(Date.now())].concat(args));
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
