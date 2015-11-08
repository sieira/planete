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

let App = (() => {
  let express = require('express'),
      app = express(),
      auth = require('.');


  app.post('/login', (req,res) => {
    let ip = req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined;

    auth.login(ip, req.body.username, req.body.password)
    .then((user) => res.status(201).json(user))
    .catch(() => res.status(401).send());
  });

  app.post('/logout', (req,res) =>
    auth.logout(req.body.userId, req.body.token)
    .then(() => res.status(204).send())
    .catch((err) => res.status(401).send()));

  return app;
})();

module.exports = App;
