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

/**
 * Sort a list of paths
 */
function pathsort(paths, sep, algorithm) {
  sep = sep || '/'

  return paths.map(function(el) {
    return el.split(sep)
  }).sort(algorithm || levelSorter).map(function(el) {
    return el.join(sep)
  })
}

/**
 * Level-order sort of a list of paths
 */
function levelSorter(a, b) {
  var l = Math.max(a.length, b.length)
  for (var i = 0; i < l; i += 1) {
    if (!(i in a)) return +1
    if (!(i in b)) return -1

    if (a.length < b.length) return +1
    if (a.length > b.length) return -1
  }
}

/**
 * Post-order sort of a list of paths
 */
function postSorter(a, b) {
  var l = Math.max(a.length, b.length)
  for (var i = 0; i < l; i += 1) {
    if (!(i in a)) return +1
    if (!(i in b)) return -1

    if (a[i].toUpperCase() > b[i].toUpperCase()) return -1
    if (a[i].toUpperCase() < b[i].toUpperCase()) return +1

    if (a.length < b.length) return +1
    if (a.length > b.length) return -1
  }
}

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
     parallelRunner.apply(null, paralelTasks)
     .then(function() {
       if(tasks.length) {
         serialRunner.apply(null, tasks)
         .then(resolve)
         .catch(reject);
       } else {
         resolve();
       }
     })
     .catch(reject);
   });
 }

function currier() {
  var args = Array.prototype.slice.call(arguments);
  return function() {
    args.shift().apply(this, args);
  }
}

module.exports = {
  pathsort: pathsort,
  serialRunner: serialRunner,
  parallelRunner: parallelRunner,
  currier: currier
};
