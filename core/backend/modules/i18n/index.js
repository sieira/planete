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

var I18n = (function () {
  var CoreModule = require('_/core-module');

  var i18n =  new CoreModule(__dirname);

  i18n.__ = function(string) {
    return string;
  },

  i18n.close= function(callback) {
    if(callback && typeof callback == 'function') { callback(); }
  };

  return i18n;
})();

module.exports = I18n;
