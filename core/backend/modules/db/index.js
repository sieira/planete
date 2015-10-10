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

var Db = (function () {
  var CoreModule = require('_/core-module'),
      fs = require('fs'),
      path = require('path'),
      core = require('_'),
      logger = core.logger,
      config = core.config,
      util = require('_/util'),
      mongoose = require('mongoose');

  var db =  new CoreModule(__dirname);

  db.connect = function (callback) {
    var db = config.NODE_ENV == 'test'? config.TEST_DB : config.DB,
        db_URL = 'mongodb://' + path.join(config.DB_HOST+':'+config.DB_PORT,db);

    mongoose.connect(db_URL, function(err) {
      if(err) {
        logger.error('Failed to connect database on ' + db_URL);
        if(callback && typeof callback == 'function') { return callback(err) }
      } else {
        logger.OK('Connected to database on ' + db_URL);
        if(callback && typeof callback == 'function') { return callback() }
      }
    });
  };

  db.isConnected = function() {
    return mongoose.connection.readyState == 1;
  };

  db.exposeModels = function(callback) {
    // Expose all the models as properties
    fs.readdir(__dirname + '/models', function(err, files) {
      files.forEach(function(filename) {
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
    });
  };

  db.close = function(callback) {
    mongoose.connection.close(function(err) {
      if(callback && typeof callback == 'function') {
        return err? callback(err) : callback() ;
      }
    });
  };

  db.registerAdminUser = function(data, callback) {
    db.user.count(function(err, count) {
      if(err) { return callback(err)}

      if(count == 0) {
        new db.user(data).save(function(err, data) {
          if(err) { if(callback && typeof callback == 'function') { return callback(err) } }
          else { if(callback && typeof callback == 'function') { return callback(); } }
        });
      } else {
        callback(new Error('Unauthorized'));
      }
    });
  };

  util.parallelRunner(db.connect, db.exposeModels);

  return db;
})();

module.exports = Db;
