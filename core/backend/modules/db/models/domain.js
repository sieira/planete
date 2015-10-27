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
    Schema = mongoose.Schema,
    q = require('q');

var DomainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subDomains: {type: [Schema.Types.ObjectId], ref: 'Domain'},
  createdAt: { type: Date, default: Date.now }
});

var DomainModel = mongoose.model('Domain', DomainSchema);

// Insert the default domain on the database, retrying any unsuccessful insert until none of the domains left can be inserted
DomainModel.init = function () {
  var defaultDomains = require('./default-domains.json').domains;
  let errors = 0;

  function _init(array) {
    let deferred = q.defer();

    if(array.length && array.length > errors) {
      let domain = array.shift();

      new DomainModel(domain).save(function(err, elem) {
        if(err) {
          logger.stack(err);
          array.push(role);
          errors++;
        }
        else {
          errors = 0;
        }
        _init(array)
        .then(deferred.resolve, deferred.reject);
      });
    } else {
      array.length? deferred.reject(new Error('Could not insert default domains')) : deferred.resolve();
    };

    return deferred.promise;
  }

  let deferred = q.defer();
  _init(defaultDomains.slice())
  .then(deferred.resolve)
  .catch(deferred.reject);

  return deferred.promise;
}

module.exports = DomainModel;
