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

/*var oauth2orize = require('oauth2orize'),
    logger = require('_').logger,
*/
var Authorization = (function () {
  var server = { a: 'test'};
/*
  server.serializeClient(function(client, done) {
    var clientId = client._id || client;
    return done(null, clientId);
  });

  server.deserializeClient(function(id, done) {
    OAuthClient.findById(id, function(error, client) {
      if (error) {
        return done(error);
      }
      return done(null, client);
    });
  });

  server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, done) {
    var code = randomstring.generate(16);
    var userId = user._id || user;
    var clientId = client._id || client;
    var oauthAuthorizationCode = new OAuthAuthorizationCode({
      code: code,
      redirectUri: redirectUri,
      userId: userId,
      clientId: clientId
    });
    logger.debug('OAuth: grant authorizationcode: clientId', clientId, 'userId', userId, 'redirectUri', redirectUri);
    oauthAuthorizationCode.save(function(error, result) {
      if (error) {
        return done(error);
      }
      return done(null, code);
    });
}));
*/
  return server;
})();

module.exports = 'Authorization';
