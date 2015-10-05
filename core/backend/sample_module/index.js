'use strict';

var Module = (function () {
  return {
    init: function(callback) {
      if(callback && typeof callback == 'function') {
        return error? callback(error) : callback() ;
      }
    },
    close: function(callback) {
      if(callback && typeof callback == 'function') {
        return error? callback(error) : callback() ;
      }
    },
  };
})();

module.exports = Module;
