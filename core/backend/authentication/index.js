'use strict';

var passport = require('passport'),
    logger = require('_').logger,
    User = require('_').db.User,
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
