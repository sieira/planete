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
 */
var Core = (function() {
  var core = {
    dependencies: []
  };

  /**
   * Register Planete Modules as core object properties
   */
  fs.readdirSync(__dirname).forEach(function(filename) {
    var stat = fs.statSync(__dirname + '/' + filename);

    if (!stat.isDirectory()) { return; } // Ignore files

    var isPlaneteModule = fs.readdirSync(__dirname + '/' + filename).some(function(name) {
      return name == 'planete.json'; // Ignore directories that do not contain a 'planete.json' file
    });

    if(isPlaneteModule) {
/*      let mod = require('./' + filename);

      if(!(mod instanceof CoreModule)) {
        throw new Error('Module '+ filename + ' contains a planete.json file, but does not extend CoreModule prototype');
      }*/

      core.dependencies.push(filename);

      Object.defineProperty(core, filename, { // Define property
        get: function() {
          return require('./' + filename);
        }
      });
    }
  });

  var initChain = (function* () {
    let ret = [];
    let done = [];
    let toGo = core.dependencies.slice();

    do {
      ret = [];

      toGo.forEach(function(dependency, index) {
        let dependenciesMet = core[dependency].dependencies.every(x => done.indexOf(x) != -1);

        if(dependenciesMet) {
          ret.push(core[dependency].init);
          done.push(dependency);
          toGo.splice(index,1);
        }
      });

      if(!ret.length) throw new Error('Dependencies unmet for modules [' + toGo + ']');

      yield ret;
    } while (toGo.length > 0);

    return [];
  })();

  // TODO check if it really is (on the database)
  core.isInstalled = false;

  core.init = function(callback) {
    serialRunner(initChain)
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
