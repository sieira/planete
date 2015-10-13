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
      db = require('_').db;


  app.post('/status', function(req,res) {
    res.status(200).json(db.isConnected());
  });

  app.post('/register-root-user', function(req,res) {
    db.registerRootUser(req.body, function(err) {
      if(err) { db.isConnected() ? res.status(401).send('Unauthorized') :  res.status(503).send('Not connected'); }
      else { res.status(200).send(); };
    });
  });

  return app;
})();

module.exports = App;
