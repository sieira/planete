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
    extend = require('mongoose-extend'),
    q = require('q'),
    Schema = mongoose.Schema;

/**
 * Base class for content
 */
var ContentSchema = new Schema({
  URI: {type: String, trim: true, unique: true, required: true },
  auth: {type: [Schema.Types.ObjectId], ref: 'Role'},
  timestamps: {
    creation: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now}
  }
}, {collection: 'content', discriminatorKey : '_type'}); // The plural form of content is content


/**
 * Pages are a content containing a body and a title
 */
var PageSchema = ContentSchema.extend({
  title: { type: String, trim: true },
  format: { type: String, trim: true, required: true, validate: /^(md|html)$/, default: 'html' },
  body: { type: String, trim: true, required: true }
});

/**
 * Articles are pages with a reference to its author and a list of tags
 * articles may have a summary
 */
var ArticleSchema = PageSchema.extend({
  //author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  summary: { type: String },
  tags: { type: [String] }
});

/**
 * Views create pages from one or several contentsets
 */
var ViewSchema = PageSchema.extend({
  name: {type: String, trim: true, unique: true, required: true },
  contentSets: { type: [Schema.Types.ObjectId], ref: 'ContentSet' }
});

function doesItExist(type, callback) {
  ContentModel.distinct('_type').exec()
  .then((contentTypes) =>
    callback(contentTypes.some((validType) => validType.toUpperCase() === type.toUpperCase()))
  , logger.stack);
}

/**
 * Content sets are groups of content intended to be displayed by views
 */
var ContentSetSchema = ContentSchema.extend({
  name: { type: String, trim: true, unique: true, required: true },
  description: { type: String },
  content: [{
    source: { type: String, validate: doesItExist },
    filter: {type: String, trim: true },
    order: {type: String, trim: true }
  }]
});

var WidgetSchema = ContentSchema.extend({

});

ContentSchema.pre('update', function(next) {
  this.timestamps.lastModified = Date.now();
  next();
});

var ContentModel = mongoose.model('Content', ContentSchema);
var PageModel = mongoose.model('Page', PageSchema);
var ArticleModel = mongoose.model('Article', ArticleSchema);
var ContentSetModel = mongoose.model('ContentSet', ContentSetSchema);
var ViewModel = mongoose.model('View', ViewSchema);

// Insert the default content on the database
ContentModel.init = function () {
  var defaultContent = require('./defaults/content.json').content;
  var errors = 0;

  function _init(array, Model) {
    let deferred = q.defer();

    if(array.length && array.length > errors) {
      let content = array.shift();
      new Model(content).save(function(err, elem) {
        if(err) {
          logger.stack(err);
          array.push(content);
          errors++;
        }
        else {
          errors = 0;
        }
        _init(array, Model)
        .then(deferred.resolve, deferred.reject);
      });
    } else {
      array.length? deferred.reject(new Error('Could not insert contents')) : deferred.resolve();
    };

    return deferred.promise;
  }

  let deferred = q.defer();
  _init(defaultContent.pages.slice(), PageModel)
  .then(() => _init(defaultContent.articles.slice(), ArticleModel))
  .then(() => _init(defaultContent.contentsets.slice(), ContentSetModel))
  .then(() => _init(defaultContent.views.slice(), ViewModel))
  .then(deferred.resolve)
  .catch(deferred.reject);

  return deferred.promise;
};

module.exports = {
    Content: ContentModel,
    Page: PageModel,
    Article: ArticleModel,
    View: ViewModel,
    ContentSet: ContentSetModel,
    Widget: mongoose.model('Widget', WidgetSchema),
}
