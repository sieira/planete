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
 * Parallell run a list of async tasks
 *
 * Input: Either an array of Parallel tasks, or a series of parallel tasks
 * as arguments.
 *
 *   async, async, ...
 * or
 *   [async, async, async]
 *
 * An async task can be a list of serial async tasks
 *
 * async, [async, async], ...
 *
 * Those will be serially run
 */
function parallelRunner(tasks) {
  if(arguments.length > 1) tasks = Array.prototype.slice.call(arguments);
  var n = tasks.length;

  var taskIterator = tasks.entries();

  return new Promise(function(resolve, reject) {
    for(let task of taskIterator) {
      serialRunner([].concat(task[1]).entries())
      .then(function() {
        if(--n <= 0) { return resolve(); }
      })
      .catch(function(err) {
        return reject(err);
      });
    }
  });
}

/**
 * Receives : A generator of serial tasks
 *
 * Each element should be a function, or a valid input for the parallelRunner
 *
 * Resolves when all the functions have run, and rejects if any of them fails
 */
 function serialRunner(generator) {
   var next = generator.next(),
       tasks = [].concat(next.value[1]);

   return new Promise(function(resolve,reject) {
     if(tasks.length > 1) {
       parallelRunner(tasks)
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
     } else {
       next.value[1](resolve, reject);
     }
   });
 }

function currier(that, fn) {
  var args = [].slice.call(arguments, 2);

  return function(callback) {
    let ret = fn.apply(that, args);
    if(callback && typeof callback == 'function') { callback(); }
    return ret;
  }
}

module.exports = {
  pathsort: pathsort,
  serialRunner: serialRunner,
  parallelRunner: parallelRunner,
  currier: currier
};
