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

var Authorization = (function () {
  var CoreModule = require('_/core-module');
  
  var auth = new CoreModule(__dirname);

  // Generates a middleware authorizating only the given roles
  auth.middleware = function(roles) {
    // TODO
    // get the user from the request
    // check if the user has ANY of the given roles
    // return the function if he does, 403 if not
    return function(req, res, next) {
      // check if the user passes ALL of the restrictions
      // OR any of the allows
      req.on('end', function() {
        res.status(403).send();
      });
    }
  };

  /*
   * Takes a request, and add restrictions to it
   */
  auth.restrict = function(req, roles) {
    req.restrictTo.concat([].concat(roles));
  };

  /*
   * Takes a request, and add restrictions to it
   */
  auth.allow = function(req, roles) {
    req.allowTo.concat([].concat(roles));
  };

  return auth;
})();

module.exports = 'Authorization';
