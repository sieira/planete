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

/**
 * This module exports the entire core functionality as object attributes
 *
 * The returned object contains every module referenced by an attribute
 * with the same name than the directory it's contained into.
 *
 */
var Core = (function() {
  var fs = require('fs'),
      util = require('_/util'),
      CoreModule = require('_/core-module');

  var core = new CoreModule(__dirname);

  core.isInstalled = function(callback) {
    core.db.hasUsers(callback);
  }

  function moduleApps() {
    var tasks = [];

    core.dependencies.forEach(function(name) {
      if(core[name].app) {
        let task = util.currier(core.app, core.app.use, '/' + name, core[name].app);
        let message = util.currier(null, core.logger.info, 'Register ' + name + ' module apps');
        tasks.push([task, message]);
      }
    });

    return tasks;
  };

  core.init = function(callback) {
    util.parallelRunner(moduleApps())
    .then(function() {
      core.app.init(callback);
    })
    .catch(callback);
  };

 /**
  * Gracefully close the core
  */
  core.close = function(callback) {
    return this.app.close(callback);
  }

  return core;
})();

module.exports = Core;
