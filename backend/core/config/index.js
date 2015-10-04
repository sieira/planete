'use strict';

var fs = require('fs');

/**
 * Reads the dotenv file and exposes all it's variables
 * if the file doesn't exist, it will return an objects without properties
 *
 */
var Config = (function () {
  var instance;

  /**
   * Following function is (slightly modified), extracted from motdotla/dotenv package in
   * https://github.com/motdotla/dotenv
   */
  function parse(file) {
    var src = fs.readFileSync(file),
        obj = {};

    // convert Buffers before splitting into lines and processing
    src.toString().split('\n').forEach(function (line) {
      // matching "KEY' and 'VAL' in 'KEY=VAL'
      var keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
      // matched?
      if (keyValueArr != null) {
        var key = keyValueArr[1];

        // default undefined or missing values to empty string
        var value = keyValueArr[2] ? keyValueArr[2] : '';

        // expand newlines in quoted values
        var len = value ? value.length : 0;
        if (len > 0 && value.charAt(0) === '\"' && value.charAt(len - 1) === '\"') {
          value = value.replace(/\\n/gm, '\n');
        }

        // remove any surrounding quotes and extra spaces
        value = value.replace(/(^['"]|['"]$)/g, '').trim();

        // is this value a variable?
        if (value.charAt(0) === '$') {
          var possibleVar = value.substring(1);
          value = obj[possibleVar] || process.env[possibleVar] || '';
        }
        // varaible can be escaped with a \$
        if (value.substring(0, 2) === '\\$') {
          value = value.substring(1);
        }

        obj[key] = value;
      }
    })

    return obj
  }

  function createInstance() {
    return {
      // Default values,
      NODE_ENV: 'development',
      HOST: 'localhost',
      PORT: 8080,
      TEST_HOST: 'localhost',
      TEST_PORT: 8080,
      init: function(callback) {
        try {
          var envs = parse('.env');
        } catch(err) {
          if(callback && typeof callback == 'function') { return callback(error); }
        }

        for(var env in envs) {
          Object.defineProperty(this, env, {  value : envs[env],
                                              writable : false,
                                              enumerable : false,
                                              configurable : false });
        };
        if(callback && typeof callback == 'function') { return callback(); }
      },
      close: function() {},
    };
  };

  if(!instance) {
    instance = createInstance();
  }

  return instance;
})();

module.exports = Config;
