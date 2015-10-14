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
    moment = require('moment'),
    crypto = require('crypto');

var SessionSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expireAt: { type: Date, default: moment().add(30,'seconds') }
});

var SessionModel = mongoose.model('SessionModel', SessionSchema);

SessionSchema.pre('validate', function(next) {
  this.token = crypto.randomBytes(16).toString('base64');
  next();
});

SessionSchema.pre('save', function(next) {
  var self = this;
  SessionModel.find({ user : self.user }, function (err, docs) {
    if (!docs.length){
      next();
    } else {
      console.info('Extending token validity for %s user', self.user);
      SessionModel.update({ user : self.user}, { expireAt: moment().add(30,'seconds') })
    }
  });
});

module.exports = SessionModel;
