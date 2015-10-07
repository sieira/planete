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
 * Post-order sort of a list of paths
 */
function pathsort(paths, sep) {
  sep = sep || '/'

  return paths.map(function(el) {
    return el.split(sep)
  }).sort(levelSorter).map(function(el) {
    return el.join(sep)
  })
}

/**
 *
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

function currier() {
  var args = Array.prototype.slice.call(arguments);
  return function() {
    args.shift().apply(this, args);
  }
}

module.exports = {
  pathsort: pathsort,
  currier: currier
}
