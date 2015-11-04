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

var logger = core.logger;
var fs = require('fs'),
    path = require('path'),
    express = require('express');

function CoreModule(dir) {
  var self = this;
  /**
   * The dir argument is the path where the modules and app
   * will be seeked, usually, it should be the self.dir of
   * the module.
   */
  this.dir = dir;
  this.name = dir.substring(dir.lastIndexOf("/"));

  let routesDir = path.join(this.dir, 'routes'),
      viewsDir = path.join(this.dir, 'views'),
      modulesDir = path.join(this.dir, 'modules');


  if(fs.existsSync(routesDir)) {   // Register routes if the directory exist
    this.routes = require(routesDir);
  } else {   // Create a new one if it doesn't
    this.routes = express.Router();
  }

  // Register the static path to the bower_components and css dirs
  this.routes.use(express.static(this.dir));
  this.routes.use(express.static(path.join(this.dir, 'bower_components')));
  this.routes.use(express.static(path.join(this.dir, 'css')));

  if(fs.existsSync(modulesDir)) { // Make the router use its modules routers
    fs.readdirSync(modulesDir).forEach(function(filename) {
      var stat = fs.statSync(path.join(modulesDir, filename));
      if (!stat.isDirectory()) { return; } // Ignore files

      let mod = require(path.join(modulesDir,filename));

      if(mod instanceof CoreModule) {
        logger.info('Registered frontend module %s/%s routes', this.name, filename);
        this.routes.use(path.join('/' + filename), mod.routes);
      } else {
        logger.error('Module %s is not a core module', filename);
      }
    }, this);
  };

  // Register the route to the index file
  this.routes.get('/', function (req, res) {
    res.render(path.join(viewsDir,'index.jade'), self.scriptsInjector(self.dir), function(err, html) {
      if(err) {
        res.status(404).send(); // File doesn't exist
      } else {
        res.send(html);
      }
    });
  });

  // Render and get any view with its file name
  this.routes.get('/:pageName', function (req, res) {
    res.render(path.join(viewsDir, req.params.pageName + '.jade'), self.scriptsInjector(self.dir), function(err, html) {
      if(err) {
        res.status(404).send(); // File doesn't exist
      } else {
        res.send(html);
      }
    });
  });

  //TODO remove this
  this.scriptsInjector = function(modulePath) {
    var styles = [],
        moduleScripts = [],
        angularInjections = [];

    if(fs.existsSync(path.join(modulePath,'js'))) {
      fs.readdirSync(path.join(modulePath,'js')).forEach(function(filename) {
        moduleScripts.push(path.join(path.relative(require.resolve('#'), modulePath), 'js', filename));
      });
    };

    if(fs.existsSync(path.join(modulePath,'css'))) {
      fs.readdirSync(path.join(modulePath,'css')).forEach(function(filename) {
        styles.push(path.join(path.relative(require.resolve('#'), modulePath), 'css', filename));
      });
    }

    // Externals
    angularInjections.push('ui.bootstrap', 'oc.lazyLoad', 'ngRoute', 'ngSanitize');
    // Planète's
    angularInjections.push('auth');

    return { styles: styles, scripts: moduleScripts, angularInjections: angularInjections };
  };
}

module.exports = CoreModule;
