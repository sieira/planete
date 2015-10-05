'use strict';

var fs = require('fs'),
    Reflect = require('harmony-reflect'),
    logger = require('_').logger;

/**
 * Welcome to ES6 Proxies :-)
 *
 * Puts the dotenv content in process.env, and proxies it, so when
 * there is no value on the process.env returns a default value.
 *
 * Aldough deploy-dependent configuration will stay out-of-the box
 * in envs, o in the .env file, this singleton will unify machine and
 * application configuration so there is no difference from the code's
 * point of view.
 *
 */
var Config = (function () {
  var config = {
    // Default values,
    NODE_ENV: 'development',
    HOST: 'localhost',
    PORT: 8080,
    TEST_HOST: 'localhost',
    TEST_PORT: 8080,
    init: function(callback) {
      require('dotenv').load();
      logger.OK('Configuration loaded');
      if(callback && typeof callback == 'function') { return callback(); }
    },
    close: function(callback) {
      if(callback && typeof callback == 'function') { return callback(); }
    },
  };

  return new Proxy(config, {
    /**
     * When calling any property, checks if it exists on the environment
     * and return the default value (which may as well not exist) when it doesn't.
     */
     get: function(target, property, receiver) {
       return process.env[property] === undefined ? target[property] : process.env[property];
     }
   });

   return config;
})();

module.exports = Config;
