'use strict';

var fs = require('fs');

/**
 * Reads the dotenv file and exposes all it's variables
 * if the file doesn't exist, it will return an objects without properties
 *
 */
var Config = (function () {

  return {
    init: function() {
      var envs = require('dotenv').parse(fs.readFileSync('.env'));

      for(var env in envs) {
        Object.defineProperty(this, env, {  value : envs[env],
                                            writable : false,
                                            enumerable : false,
                                            configurable : false });
      };
    },
    close: function() {},
  };
})();

module.exports = Config;
