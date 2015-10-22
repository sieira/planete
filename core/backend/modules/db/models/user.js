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

var bcrypt = require('bcrypt-nodejs'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    util = require('_/util');

var UserSchema = new mongoose.Schema({
  username: {type: String, trim: true, unique: true, required: true },
  firstname: {type: String, trim: true},
  lastname: {type: String, trim: true},
  password: {type: String},
  roles: {type: [Schema.Types.ObjectId], ref: 'Role', required: true},
  timestamps: {
    creation: {type: Date, default: Date.now}
  },
  login: {
    failures: [{
      date: { type: [Date] },
      ip: { type: [Number]}
    }],
    successes: [{
      date: { type: [Date] },
      ip: { type: [Number]}
    }]
  }
});

UserSchema.pre('save', function(next) {
  var user = this;
  var SALT_FACTOR = 5;

  if (!user.isModified('password')) { return next(); }

  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) { return next(err); }

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods = {
  comparePassword: function(candidatePassword, callback) {
    if (!candidatePassword) {
      return callback(new Error('Cannot compare with null password'));
    }
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  },

  loginFailure: function(ip, callback) {
    this.login.failures.push({ date: new Date(), ip: util.iPStringToInt(ip) });
    this.save(callback);
  },

  loginSuccess: function(ip, callback) {
    this.login.successes.push({ date: new Date(), ip: util.iPStringToInt(ip) });
    this.save(callback);
  },

  resetLoginFailure: function(callback) {
    this.login.failures = [];
    this.save(callback);
  }
};

module.exports = mongoose.model('User', UserSchema);
