'use strict';

var Logger = (function () {
  var Color = {
    GREEN_FG: '\x1b[32m',
    RED_FG: '\x1b[31m',
    RESET:  '\x1b[0m',
    YELLOW_FG: '\x1b[33m'
  };

  return {
    init: function() {},
    close: function() {},
    log: console.log,
    info: function() {
      var args = [].slice.call(arguments);

      console.log.apply(this, ['%s [i] %s [%s]: ' + args.shift(), Color.YELLOW_FG, Color.RESET, Date(Date.now())].concat(args));
    },
    OK: function() {
      var args = [].slice.call(arguments);

      console.log.apply(this, ['%s [✔] %s [%s]: ' + args.shift(), Color.GREEN_FG, Color.RESET, Date(Date.now())].concat(args));
    },
    error: function() {
      var args = [].slice.call(arguments);

      console.error.apply(this, ['%s [x] %s [%s]: ' + args.shift(), Color.RED_FG, Color.RESET, Date(Date.now())].concat(args));
    }
  };
})();

module.exports = Logger;
