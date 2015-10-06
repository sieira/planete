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
      console.log.apply(null, ['%s [%s] %s [%s]: ' + args.shift(), color, tag, Color.RESET, Date(Date.now())].concat(args));
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
  logger.error = colorLogger('x', Color.RED);

  return logger;
})();

module.exports = Logger;
