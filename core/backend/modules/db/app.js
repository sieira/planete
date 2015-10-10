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
var App = (function() {
  var express = require('express'),
      app = express(),
      db = require('_').db;


  app.post('/status', function(req,res) {
    res.status(200).json(db.isConnected());
  });

  app.post('/register-admin-user', function(req,res) {
    db.registerAdminUser(req.body, function(err) {
      if(err) { res.status(401).send('Unauthorized'); }
      else { res.status(200).send(); };
    });
  });

  return app;
})();

module.exports = App;
