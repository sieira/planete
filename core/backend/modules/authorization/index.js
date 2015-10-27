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
  var CoreModule = require('_/core-module'),
      q = require('q'),
      core = require('_'),
      db = core.db,
      logger = core.logger,
      authenticationMW = core.authentication.middleware;


  var auth = new CoreModule(__dirname);

  // Generates a middleware responding to the restrictions added to the request,
  // and forcing authentication when the contents are not public.
  auth.middleware = function(restrict) {
    restrict = [].concat(restrict);

    return function(req, res, next) {
      authenticationMW(req, res, function() {

        // get the user from the request
        q(db.session.findOne({ token: req.headers.authorization.slice('Bearer '.length) }).exec())
        .then(function (session) {
          return session.getUserRoles();
        })
        .then(function(user) {
          // check if the user has any of the given "restrict" roles
          restrict.forEach(function (restriction) {
            if(user.roles.some(function (role) {
              //TODO check also the domain
              return role.role.name === restriction;
            })) {
              next();
            } else {
              // send the response as is, 403 if not
              res.status(403).send();
            }
          });
        })
        .catch(logger.stack);
      });
    }
  };

  return auth;
})();

module.exports = Authorization;
