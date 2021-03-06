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

var Db = (function () {
  var CoreModule = require('_/core-module'),
      fs = require('fs'),
      path = require('path'),
      logger = core.logger,
      config = core.config,
      util = require('_/util'),
      q = require('q'),
      mongoose = require('mongoose');

  var db =  new CoreModule(__dirname);

  function exposeModels(callback) {
    //Use ES6 promises
    mongoose.Promise = global.Promise;
    
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

  db.connect = function (callback) {
    var db = config.NODE_ENV == 'test'? config.TEST_DB : config.DB,
        db_URL = 'mongodb://' + config.DB_USER + ':' + config.DB_PASSWORD + '@' +  path.join(config.DB_HOST+':'+config.DB_PORT,db);

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

  db.isAuthorizedToInstall = function() {
    var deferred = q.defer();

    q(db.role.count().exec()) // Check read permission on roles
    .then(q(db.user.count().exec())) // Check read permission on users
    .then(q(db.user.count().exec())) // TODO Check write permission on users
    .then(q(db.user.count().exec())) // TODO Check write permission on roles
    .then(function() { deferred.resolve(true); })
    .catch(function(err) {
      logger.error(err);
      deferred.resolve(false);
    });

    return deferred.promise;
  };

  db.close = function(callback) {
    mongoose.connection.close(function(err) {
      if(callback && typeof callback == 'function') {
        return err? callback(err) : callback() ;
      }
    });
  };

  db.hasUsers = function(callback) {
    db.user.count(function(err,count) {
      if(callback && typeof callback == 'function') {
        if(err) { return callback(err); }
        else { return callback(null, count > 0); }
      }
    });
  };

  db.registerRootUser = function(user) {
    var deferred = q.defer();
    var roleId;
    var domainId;

    q(db.user.count().exec())
    .then(function(count) {
      if(!count) {
        return db.domain.init()
               .then(db.role.init)
               .catch(logger.stack);
      } else { throw new Error('There are already users !'); }
    })
    .then(function () {
      return q(db.role.findOne({ name: 'Root' }).exec());
    })
    .then(function (role) {
      roleId = role;
      return q(db.domain.findOne({ path: '/' }).exec());
    })
    .then(function (domain) {
      domainId = domain;
      user.roles = [{ role: roleId, domain: domainId}];
      return new db.user(user).save();
    })
    .then(deferred.resolve)
    .catch(deferred.reject);

    return deferred.promise;
  };

  db.registerDefaultContent = function() {
    var deferred = q.defer();

    q(db.content.Content.count().exec())
    .then(function(count) {
      if(!count) {
        return db.content.Content.init();
      } else { throw new Error('There is already some content !'); }
    })
    .then(deferred.resolve)
    .catch(deferred.reject);

    return deferred.promise;
  };

  util.parallelRunner(db.connect, exposeModels);

  return db;
})();

module.exports = Db;
