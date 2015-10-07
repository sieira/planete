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

var passport = require('passport'),
    logger = require('_').logger,
    User = require('_').db.user,
    BearerStrategy = require('passport-http-bearer').Strategy;

var Authentication = (function () {
  var strategy = new BearerStrategy(
    function(token, done) {
      User.findOne({ token: token }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user, { scope: 'all' });
      });
    }
  );

  return {
    strategy: strategy,
    middleware: passport.authenticate('bearer', { session: false }),
    init: function(callback) {
      passport.use(strategy);
      logger.OK('Authentication strategy registered');
      if(callback && typeof callback == 'function') {
        return callback() ;
      }
    },
    close: function(callback) {
      if(callback && typeof callback == 'function') {
        return error? callback(error) : callback() ;
      }
    },
  };
})();

module.exports = Authentication;
