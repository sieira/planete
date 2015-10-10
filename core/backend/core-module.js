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

var fs = require('fs');

function CoreModule(dir) {
  /**
   * The dir argument is the path where the modules and app
   * will be seeked, usually, it should be the __dirname of
   * the module.
   */
  this.dir = dir;
  this.dependencies = [];

  /**
   * Register SubModules as object properties,
   * and add their names to the dependecy list
   */
  let modulesDir = this.dir + '/modules/';

  if(fs.existsSync(modulesDir)) {
    fs.readdirSync(modulesDir).forEach(function(filename) {
      var stat = fs.statSync(modulesDir + filename);
      if (!stat.isDirectory()) { return; } // Ignore files
      this.dependencies.push(filename);

      Object.defineProperty(this, filename, { // Define property
        get: function() {
          let mod = require('_/modules/' + filename);
          if(!Object.keys(mod).length) throw new Error('Error loading module ' + filename + ' of '+ dir +' this can be caused by a circular dependency, or the module returning an empty object');
          return  mod;
        }
      });
    }, this);
  };

  /**
   * Register the app as a property, but don't require it yet
   * to avoid a circular dependencies when requiring the module
   */
  if(fs.existsSync(this.dir + '/app.js')) {
    Object.defineProperty(this, 'app', { // Define property
      get: function() {
        let mod =  require(this.dir + '/app');
        if(!Object.keys(mod).length) throw new Error('Error loading app of ' + dir);
        return  mod;
      }
    });
  }
}

module.exports = CoreModule;
