'use strict';

var Module = (function () {
  return {
    init: function(callback) {
      return callback ? error ? callback(error) : callback() : undefined;
    },
    close: function(callback) {
      return callback ? error ? callback(error) : callback() : undefined;
    },
  };
})();

module.exports = Module;
