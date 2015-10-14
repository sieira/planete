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

var Authentication = (function () {
  var CoreModule = require('_/core-module');

  var logger = require('_').logger,
      db = require('_').db,
      passport = require('passport'),
      BearerStrategy = require('passport-http-bearer').Strategy;

  var auth = new CoreModule(__dirname);

  var strategy = new BearerStrategy(function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  });

  passport.use(strategy);
  auth.middleware = passport.authenticate('bearer', { session: false });
  logger.OK('Authentication strategy registered');

  auth.login = function(ip, username, password, callback) {
    db.user.findOne({ username: username }, function (err, user) {
      if(err) { return callback(err); }
      if(!user) { return callback(new Error('Authentication failed')); } // No user with this username

      user.comparePassword(password, function(err, isMatch) {
        if(err) { return callback(err); }
        if(!isMatch) { // Password do not match
          user.loginFailure(ip);
          return callback(new Error('Authentication failed'));
        }

        new db.session({ user: user._id }).save(function(err, session) {
          if(err) callback(err);
          user.loginSuccess(ip);
          logger.info('Session created for user %s', session.user);
          callback(null, { userId: session.user, token: session.token });
        });
      });
    });
  };

  return auth;
})();

module.exports = Authentication;
