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
    path = require('path');

var Frontend = (function () {
  function scriptsInjector(modulePath) {
    var styles = [],
        moduleScripts = [],
        angularInjections = [];

    fs.readdirSync(path.join(modulePath,'js')).forEach(function(filename) {
      moduleScripts.push(path.join(path.relative(__dirname, modulePath), 'js', filename));
    });

    fs.readdirSync(path.join(modulePath,'css')).forEach(function(filename) {
      styles.push(path.join(path.relative(__dirname, modulePath), 'css', filename));
    });

    //TODO make the module control its own dependencies
    // angularInjections.push('angularmodule');

    return { styles: styles, scripts: moduleScripts, angularInjections: angularInjections };
  };

  return {
    registerRoutes: function(app, server) {
      app.use(server.static(__dirname));
      app.set('views', path.join(__dirname,'views'));
      app.set('view engine', 'jade');
      app.use(server.static(path.join(__dirname, 'bower_components')));

      fs.readdirSync(__dirname).forEach(function(filename) {
        // Ignore the non-module dirs
        if(['routes', 'views', 'js', 'css', 'bower_components', 'node_modules'].some(function(element) {
          return element === filename;
        })) return;

        var stat = fs.statSync(__dirname + '/' + filename);
        if (!stat.isDirectory()) { return; }

        return require('./' + filename)(app, scriptsInjector);
      });

      require('./routes')(app);
    },
    init: function(callback) {
      if(callback && typeof callback == 'function') { return callback(); }
    },
    close: function(callback) {
      if(callback && typeof callback == 'function') { return callback(); }
    }
  };
})();

module.exports = Frontend;
