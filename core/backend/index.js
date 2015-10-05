'use strict';

var fs = require('fs');

/**
 * This module exports the entire core functionality as object attributes
 *
 * The returned object contains every module referenced by an attribute
 * with the same name than the directory it's contained into.
 *
 *
 * Please, note that since there exist interdependencies among the modules,
 * they should be loaded in a particular order, and this is not still automathised
 */
var Core = (function() {
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
  * Run a single async function, or an array of async functions,
  * and resolve the promise when all of them have ended
  */
  function parallelRunner() {
    var tasks = arguments,
    n = arguments.length;

    return new Promise(function(resolve, reject) {
      for(var task in tasks) {
        if(typeof tasks[task] == 'function') {
          tasks[task](function(err) {
            if(err) { return reject(err); }
            if(--n <= 0) {
              return resolve();
            }
          });
        } else {
          return reject(Object.keys(tasks[task][0]) + ' is not a function');
        }
      }
    });
  }

 /**
  * Receives : ([async] | async)*
  * Async function, array of async functions, an arguments list of both async functions and arrays of async functions
  * and sequentially run each term of the list.
  *
  * Resolves when all the functions have run, and rejects if any of them fails
  */
  function serialRunner() {
    var tasks = Array.prototype.slice.call(arguments);

    return new Promise(function(resolve,reject) {
      // Gets a single async function, or a list of async functions
      var paralelTasks = [].concat(tasks.shift());
      parallelRunner.apply(this, paralelTasks)
      .then(function() {
        if(tasks.length) {
          serialRunner.apply(this,tasks).then(resolve);
        } else {
          resolve();
        }
      })
      .catch(reject);
    });
  }

  core.init = function(callback) {
    serialRunner(
      core.config.init,   // Loads the config file before anything else, so defaults are overriden
      core.logger.init,   // Load the logger so output start going to the proper place
      core.webserver.init // Start the webserver, so the rest of the modules can register it's routings
    )
    .then(function() {
      if(callback && typeof callback == 'function') { return callback(); }
    })
    .catch(this.logger.error);
  };

 /**
  * Gracefully close the core
  */
  core.close = function(callback) {
    return this.webserver.close(callback);
  }

  return core;
})();

module.exports = Core;
