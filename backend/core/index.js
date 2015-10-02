'use strict';

var fs = require('fs');

/**
 * This singleton exports the entire core functionallity as object attributes
 *
 * The returned object contains every module referenced by an attribute
 * with the same name than the directory it's contained into.
 *
 * This script declares as well an init method, that is supposed sequentially
 * init all the modules.
 *
 * Please, note that since there exist interdependencies among the modules,
 * they should be loaded in a particular order, and therefore this cannot be
 * automatically done.
 */
var Core = (function() {
  var instance;

  function createInstance() {
    var core = {};

    fs.readdirSync(__dirname).forEach(function(filename) {
      var stat = fs.statSync(__dirname + '/' + filename);
      if (!stat.isDirectory()) { return; }

      Object.defineProperty(core, filename, {
        get: function() {
          return require('./' + filename);
        }
      });
    });

    core.init = function(callback) {
      this.config.init();
      this.webserver.init();
      // Example: exports.db.mongo.init();
      if (callback) {
        callback();
      }
    };

    return core;
  }

  if(!instance) {
    instance = createInstance();
  }

  return instance;
})();

module.exports = Core;
