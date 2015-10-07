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
'use strict';

var fs = require('fs'),
    logger = require('_').logger;

var Db = (function () {
  var db = {};

  db.init = function(callback) {
    // Expose all the models as properties
    fs.readdirSync(__dirname + '/models').forEach(function(filename) {
      var stat = fs.statSync(__dirname + '/models/' + filename);
      //TODO make this recursive
      if (stat.isDirectory()) { return; }
      var name = filename.substring(0, filename.lastIndexOf('.'));

      //TODO this probably shouldn't be configurable
      Object.defineProperty(db, name, {
        get: function() {
          return require('./models/' + name);
        },
        configurable: true
      });
    });
    logger.OK('Database models exposed');

    if(callback && typeof callback == 'function') { return callback(); }
  };

  db.close = function(callback) {
    if(callback && typeof callback == 'function') {
      return error? callback(error) : callback() ;
    }
  };

  return db;
})();

module.exports = Db;
