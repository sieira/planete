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
      content = require('.'),
      core = require('_'),
      db = core.db,
      logger = core.logger;

  /**
   * Seek the content in the database, the initial / is trimmed
   */
  app.get('*', function(req,res) {
    content.getDocument(req.url.substring(1))
    .then(function (content) {
      if(!content) { return res.status(404).send(); }
      res.status(200).send({ format: content.format, body: content.body });
    })
    .catch(function(err) {
      logger.stack(err);
      res.status(500).send();
    });
  });

  return app;
})();

module.exports = App;
