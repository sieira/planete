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

var mongoose = require('mongoose'),
    q = require('q');

var RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

var RoleModel = mongoose.model('Role', RoleSchema);

RoleModel.init = function () {
  let deferred = q.defer();

  RoleModel.update({ name: 'Root' },  { upsert: true }, function (err) {
    if(err) { deferred.reject(err); }
    else { deferred.resolve(); }
  });

  return deferred.promise;
}

module.exports = RoleModel;
