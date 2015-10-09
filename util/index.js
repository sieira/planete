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
 * Run an async function, array of async functions, or all the provided async functions
 */
 function parallelRunner(tasks) {
   if(arguments.length > 1) tasks = Array.prototype.slice.call(arguments);
   tasks = [].concat(tasks);

   var n = tasks.length;

   return new Promise(function(resolve, reject) {
     tasks.forEach(function (task) {
       if(typeof task == 'function') {
         task(function(err) {
           if(err) { return reject(err); }
           if(--n <= 0) {
             return resolve();
           }
         });
       } else {
         return reject(Object.keys(task[0]) + ' is not a function');
       }
     });
   });
 }

/**
 * Receives : A generator of serial tasks
 *
 * Each element is an array of paralelisable tasks
 *
 * Resolves when all the functions have run, and rejects if any of them fails
 */
 function serialRunner(generator) {
   var next = generator.next(),
       tasks = next.value;

//       console.log('serial');
//       console.log(next);

   return new Promise(function(resolve,reject) {
     // Gets a single async function, or a list of async functions
     parallelRunner(next.value)
     .then(function() {
       if(!next.done) {
         serialRunner(generator)
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
