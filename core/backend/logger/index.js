'use strict';

var Logger = (function () {
  var logger = {};

  var Color = {
    GREEN_FG: '\x1b[32m',
    RED_FG: '\x1b[31m',
    RESET:  '\x1b[0m',
    YELLOW_FG: '\x1b[33m'
  };

    logger.init = function(callback) {
      console.log.apply(this, ['%s [✔] %s [%s]: ' + 'Logger is configured', Color.GREEN_FG, Color.RESET, Date(Date.now())]);

      if(callback && typeof callback == 'function') { return callback(); }
    };
    logger.close = function() {};
    logger.log = console.log;
    logger.info = function() {
      var args = [].slice.call(arguments);

      console.log.apply(this, ['%s [i] %s [%s]: ' + args.shift(), Color.YELLOW_FG, Color.RESET, Date(Date.now())].concat(args));
    };
    logger.OK = function() {
      var args = [].slice.call(arguments);

      console.log.apply(this, ['%s [✔] %s [%s]: ' + args.shift(), Color.GREEN_FG, Color.RESET, Date(Date.now())].concat(args));
    };
    logger.error = function() {
      var args = [].slice.call(arguments);

      console.error.apply(this, ['%s [x] %s [%s]: ' + args.shift(), Color.RED_FG, Color.RESET, Date(Date.now())].concat(args));
    };

  return logger;
})();

module.exports = Logger;
