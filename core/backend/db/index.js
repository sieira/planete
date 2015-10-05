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

      Object.defineProperty(db, name, {
        get: function() {
          console.log('require '+ './models/' + name);
          return require('./models/' + name);
        }
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
