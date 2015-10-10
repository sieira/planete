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
    util = require('_/util'),
    app = require('./app');

/**
 * This module exports the entire core functionality as object attributes
 *
 * The returned object contains every module referenced by an attribute
 * with the same name than the directory it's contained into.
 *
 */
var Core = (function() {
  var core = {
    dependencies: [],
    webserver: {}
  };

  /**
   * Register Planete Modules as core object properties
   */
  fs.readdirSync(__dirname + '/modules/').forEach(function(filename) {
    var stat = fs.statSync(__dirname + '/modules/' + filename);

    if (!stat.isDirectory()) { return; } // Ignore files


    //TODO it would be approrpriate to register apps and middleware here
    core.dependencies.push(filename);

    Object.defineProperty(core, filename, { // Define property
      get: function() {
        let mod = require('_/modules/' + filename);
        //TODO check if it is a planete module
        if(!Object.keys(mod).length) throw new Error('Error loading module ' + filename + ' this can be caused by a circular dependency, or the module returning an empty object');
        return  mod;
      }
    });
  });

  // TODO check if it really is (on the database)
  core.isInstalled = false;

  function moduleApps() {
    var tasks = [];

    core.dependencies.forEach(function(name) {
      if(core[name].app) {
        let task = util.currier(core.webserver, core.webserver.use, '/' + name, core[name].app);
        let message = util.currier(null, core.logger.info, 'Register ' + name + ' module apps');
        tasks.push([task, message]);
      }
    });

    return tasks;
  };

  core.init = function(callback) {
    core.webserver = app();
    util.parallelRunner(moduleApps())
    .then(function() {
      core.webserver.init(core.webserver.get('port'), core.webserver.get('host'), function() {
        core.logger.OK('Express server listening at %s:%d', core.webserver.get('host'), core.webserver.get('port'));
        if(callback && typeof callback == 'function') { return callback(); }
      });
    })
    .catch(core.logger.error);
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
