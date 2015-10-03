'use strict';

var fs = require('fs');

/**
 * This singleton exports the entire core functionality as object attributes
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

    /**
     * Init order is important, so please, comment why you decided to load your module
     * on this precise step, and not before or after
     */
    core.init = function(callback) {
      // Loads the config file before anything else, so defaults are overriden
      this.config.init();
      // Load the logger so output start going to the proper place
      this.logger.init();
      // Start the webserver, so the rest of the modules can register it's routings
      this.webserver.init();

      if (callback) {
        callback();
      }
    };

    /**
     * Gracefully close the core
     */
    core.close = function(callback) {
      return this.webserver.close(callback);
    }

    return core;
  }

  if(!instance) {
    instance = createInstance();
  }

  return instance;
})();

module.exports = Core;
