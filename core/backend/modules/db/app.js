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
var App = (function() {
  var express = require('express'),
      app = express(),
      db = require('_').db
      logger = require('_').logger;


  app.post('/status', function(req, res) {
    res.status(200).json(db.isConnected());
  });

  app.post('/register-root-user', function(req, res) {
    db.registerRootUser(req.body)
    .then(res.status(200).json)
    .catch(function(err) {
      logger.error(err);
      if(err) { db.isConnected() ? res.status(401).send('Unauthorized') :  res.status(503).send('Not connected'); };
    });
  });

//TODO authorization
  app.post('/register-user', function(req, res) {
    new db.user(req.body).save(function(err) {
      if(err) {
        logger.stack('Error registering user: %s', err);
        db.isConnected() ? res.status(401).send('Unauthorized') :  res.status(503).send('Not connected'); }
      else { res.status(200).send(); };
    });
  });

//TODO authorization
  app.post('/get-users', function(req, res) {
    db.user.find(function(err, data) {
      if(err) {
        logger.stack('Error registering user: %s', err);
        db.isConnected() ? res.status(401).send('Unauthorized') :  res.status(503).send('Not connected'); }
      else { res.status(200).send(data); };
    });
  });

  app.delete('/user/:userId', function(req, res) {
    logger.info('Deleting user: %s', req.params);
    db.user.remove({ _id: req.params.userId}, function (err) {
      if(err) {
        logger.stack('Error deleting user: %s', err);
        db.isConnected() ? res.status(401).send('Unauthorized') :  res.status(503).send('Not connected'); }
      else { res.status(204).send(); };
    })
  });

  return app;
})();

module.exports = App;
