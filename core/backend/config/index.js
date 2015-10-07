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
    FRONTEND_PATH: require.resolve('#').substring(0, require.resolve('#').lastIndexOf('/')),
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
