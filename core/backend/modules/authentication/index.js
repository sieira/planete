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
      q = require('q'),
      BearerStrategy = require('passport-http-bearer').Strategy;

  var auth = new CoreModule(__dirname);

  var strategy = new BearerStrategy(function(token, done) {
    db.session.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  });

  passport.use(strategy);
  auth.middleware = passport.authenticate('bearer', { session: false });
  logger.OK('Authentication strategy registered');

  auth.login = function(ip, username, password) {
    var deferred = q.defer();

    q(db.user.findOne({ username: username }).exec())
    .then(function (user) {
      if(!user) { throw new Error('Authentication failed'); } // No user with this username

      user.comparePassword(password, function(err, isMatch) {
        if(err) { throw err; }
        if(!isMatch) { // Password do not match
          user.loginFailure(ip);
          deferred.reject(new Error('Authentication failed'));
          return;
        }

        new db.session({ user: user._id }).save(function(err, session) {
          if(err) { throw err; }
          user.loginSuccess(ip);
          logger.info('Session created for user %s', session.user);
          deferred.resolve({ userId: session.user, token: session.token });
        });
      });
    })
    .catch(function(err) {
      deferred.reject(err);
     });

      return deferred.promise;
  };

  auth.logout = function(userid, token, callback) {
    q(db.session.remove({ user: userid, token: token }).exec())
    .then(function() {
      logger.info('User %s logged out from session with token %s', userid, token);
      callback();
    })
    .catch(callback);
  };

  return auth;
})();

module.exports = Authentication;
