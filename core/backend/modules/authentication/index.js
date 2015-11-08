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

let Authentication = (() => {
  let CoreModule = require('_/core-module');

  let logger = core.logger,
      db = core.db,
      passport = require('passport'),
      BearerStrategy = require('passport-http-bearer').Strategy;

  let auth = new CoreModule(__dirname);

  let strategy = new BearerStrategy((token, done) => {
    db.session.findOne({ token: token }, (err, user) => {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  });

  passport.use(strategy);
  auth.middleware = passport.authenticate('bearer', { session: false });
  logger.OK('Authentication strategy registered');

  auth.login = (ip, username, password) =>
    new Promise((resolve, reject) =>
      db.user.findOne({ username: username }).exec()
      .then((user) => {
        if(!user) { throw new Error('Authentication failed'); } // No user with this username

        user.comparePassword(password, (err, isMatch) => {
          if(err) { throw err; }

          if(!isMatch) { // Password do not match
            user.loginFailure(ip);
            return reject(new Error('Authentication failed'));
          }

          new db.session({ user: user._id }).save((err, session) => {
            if(err) { throw err; }

            user.loginSuccess(ip);
            logger.info('Session created for user %s', session.user);
            resolve({ userId: session.user, token: session.token });
          });
        });
      })
      .catch(reject));

  auth.logout = (userid, token) =>
    new Promise((resolve,reject) =>
      db.session.remove({ user: userid, token: token }).exec()
      .then(() => {
        logger.info('User %s logged out from session with token %s', userid, token);
        resolve();
      })
      .catch(reject));

  return auth;
})();

module.exports = Authentication;
