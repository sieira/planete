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

var fs = require('fs'),
    path = require('path');

var Frontend = (function () {
  function scriptsInjector(modulePath) {
    var styles = [],
        moduleScripts = [],
        angularInjections = [];

    if(fs.existsSync(path.join(modulePath,'js'))) {
      fs.readdirSync(path.join(modulePath,'js')).forEach(function(filename) {
        moduleScripts.push(path.join(path.relative(__dirname, modulePath), 'js', filename));
      });
    };

    if(fs.existsSync(path.join(modulePath,'css'))) {
      fs.readdirSync(path.join(modulePath,'css')).forEach(function(filename) {
        styles.push(path.join(path.relative(__dirname, modulePath), 'css', filename));
      });
    }

    angularInjections.push('ui.bootstrap', 'oc.lazyLoad', 'auth');

    return { styles: styles, scripts: moduleScripts, angularInjections: angularInjections };
  };

  return {
    scriptsInjector: scriptsInjector,
    registerRoutes: function(app, server) {
      app.use(server.static(__dirname));
      app.set('views', path.join(__dirname,'views'));
      app.set('view engine', 'jade');
      app.use(server.static(path.join(__dirname, 'bower_components')));

      fs.readdirSync(__dirname + '/modules/').forEach(function(filename) {
        var stat = fs.statSync(__dirname + '/modules/' + filename);
        if (!stat.isDirectory()) { return; }

        return require('./modules/' + filename)(app, scriptsInjector);
      });

      require('./routes')(app);
    }
  };
})();

module.exports = Frontend;
