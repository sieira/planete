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
    extend = require('mongoose-schema-extend'),
    q = require('q'),
    Schema = mongoose.Schema;

var ContentSchema = new Schema({
  URI: {type: String, trim: true, unique: true, required: true },
  format: {type: String, trim: true, required: true, validate: /^(md|html)$/, default: 'html' },
  body: {type: String, trim: true},
  auth: {type: [Schema.Types.ObjectId], ref: 'User'},
  timestamps: {
    creation: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  }
}, {collection: 'content'});


var PageSchema = ContentSchema.extend({

});

var ArticleSchema = ContentSchema.extend({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tags: { type: [String] }
});

var WidgetSchema = ContentSchema.extend({

});

ContentSchema.pre('update', function(next) {
  this.timestamps.lastModified = Date.now();
  next();
});

var ContentModel = mongoose.model('Content', ContentSchema);

// Insert the default content on the database
ContentModel.init = function () {
  var defaultContent = require('./defaults/content.json').content;
  var errors = 0;

  function _init(array) {
    let deferred = q.defer();

    if(array.length && array.length > errors) {
      let content = array.shift();

      new ContentModel(content).save(function(err, elem) {
        if(err) {
          logger.stack(err);
          array.push(content);
          errors++;
        }
        else {
          errors = 0;
        }
        _init(array)
        .then(deferred.resolve, deferred.reject);
      });
    } else {
      array.length? deferred.reject(new Error('Could not insert contents')) : deferred.resolve();
    };

    return deferred.promise;
  }

  let deferred = q.defer();
  _init(defaultContent.slice())
  .then(deferred.resolve)
  .catch(deferred.reject);

  return deferred.promise;
};

module.exports = {
    Content: ContentModel,
    Page: mongoose.model('Page', PageSchema),
    Article: mongoose.model('Article', ArticleSchema),
    Widget: mongoose.model('Widget', WidgetSchema),
}
