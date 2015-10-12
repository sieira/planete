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
    front = require('#'),
    path = require('path'),
    auth = core.authentication;

var Routes = function (server) {
  var rootDir = __dirname.slice(0, __dirname.lastIndexOf('/')),
      viewsdir = path.normalize(path.join(rootDir, '/views'));

  server.get('/', function (req, res) {
      res.render(path.join(viewsdir,'index'), front.scriptsInjector(rootDir));
  });
};

module.exports = Routes;
