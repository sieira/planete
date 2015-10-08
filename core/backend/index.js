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
    serialRunner = require('../../util').serialRunner,
    parallelRunner = require('../../util').parallelRunner;

/**
 * This module exports the entire core functionality as object attributes
 *
 * The returned object contains every module referenced by an attribute
 * with the same name than the directory it's contained into.
 *
 *
 * Please, note that since there exist interdependencies among the modules,
 * they should be loaded in a particular order, and this is not still automathised
 */
var Core = (function() {
  var core = {};

  fs.readdirSync(__dirname).forEach(function(filename) {
    // Ignore the test and the sample_module dirs
    if(['test', 'sample_module', 'node_modules'].some(function(element) {
      return element === filename;
    })) { return; }

    var stat = fs.statSync(__dirname + '/' + filename);
    if (!stat.isDirectory()) { return; }

    Object.defineProperty(core, filename, {
      get: function() {
        return require('./' + filename);
      }
    });
  });

  // TODO check if it really is (on the database)
  core.isInstalled = (function() { return false; })();

  core.init = function(callback) {
    serialRunner(
      core.config.init,     // Loads the config file before anything else, so defaults are overriden
      core.i18n.init,
      core.logger.init,     // Load the logger so output start going to the proper place
      [core.webserver.init, // Start the webserver, so the rest of the modules can register it's routings
      core.db.init],        // Expose all the database models before the authentication system inits
      core.authentication.init
    )
    .then(function() {
      if(callback && typeof callback == 'function') { return callback(); }
    })
    .catch(function(err) {
      if(callback && typeof callback == 'function') { return callback(err); }
      else { throw err; }
    });
  };

 /**
  * Gracefully close the core
  */
  core.close = function(callback) {
    return this.webserver.close(callback);
  }

  return core;
})();

module.exports = Core;
