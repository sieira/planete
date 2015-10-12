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

var core = require('_'),
    path = require('path');


var Setup = function (server, scriptsInjector) {
  var viewsdir = path.normalize(path.join(__dirname, '/views'));

  server.get('/', function(req, res, next) {
    core.isInstalled(function(err, itIs) {
      if(itIs) { next(); }
      else { res.render(path.join(viewsdir,'index'), scriptsInjector(__dirname)); }
    });
  });
};

module.exports = Setup;
