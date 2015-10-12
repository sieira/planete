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
    along with along with planète.  If not, see <http://www.gnu.org/licenses/>.  If not, see <http://www.gnu.org/licenses/>
**/
'use strict';

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
  var CoreModule = require('_/core-module'),
      fs = require('fs');

  var config = new CoreModule(__dirname);

  // Default values,
  config.NODE_ENV = 'development',
  config.HOST = 'localhost',
  config.PORT = 8080,
  config.TEST_HOST = 'localhost',
  config.TEST_PORT = 8080;

  require('dotenv').load();
  console.log('Configuration loaded');

  config.close = function(callback) {
    if(callback && typeof callback == 'function') { return callback(); }
  };

var proxy = new Proxy(config, {
  /**
   * When calling any property, checks if it exists on the environment
   * and return the default value (which may as well not exist) when it doesn't.
   */
   get: function(target, property, receiver) {
     return process.env[property] === undefined ? target[property] : process.env[property];
   }
 });
 return proxy;
})();

module.exports = Config;
