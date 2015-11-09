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

var Reflect = require('harmony-reflect');

var glob = require("glob"),
  //TODO, put this function in a more handy place
    util = require("./core/backend/util");

process.env.NODE_ENV = 'test';

var exclude = ['.git', 'node_modules','bower_components','sample-module'];
var files = glob.sync("**/test/**/*.js", {});

var cleanFiles = glob.sync("{node_modules/!(grunt*|glob*),!(node_modules)/**/node_modules/,**/bower_components}");

files = files.filter(function(path) {
  return exclude.every(function(regexp) {
    return path.match(regexp) === null;
  });
});

files = util.pathsort(files);


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: cleanFiles,

    symlink: {
      options: {
        overwrite: true
      },
      expanded: {
        files: [
          {
            src: 'core/backend',
            dest: 'node_modules/_'
          },
          {
            src: 'core/frontend',
            dest: 'node_modules/#'
          }
        ]
      }
    },

    auto_install: {
      local: {},
      options: {
        recursive: true,
        exclude: exclude
      }
    },

    mochaTest: {
      test: {
        options: {
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false)
        },
        src: files
      }
    }
  });

  grunt.registerTask('drop', 'drop the database', function() {
    var mongoose = require('mongoose');

    // async mode
    var done = this.async();

    mongoose.connection.on('open', function () {
      mongoose.connection.db.dropDatabase(function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('Successfully dropped db');
        }
        mongoose.connection.close(done);
      });
    });

    mongoose.connect('mongodb://admin:password@localhost:27017/planete');
  });

  grunt.registerTask('bootstrapCore', 'make the core global', function() {
    global.core = require('_');
  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-symlink');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('build', ['symlink', 'auto_install']);
  grunt.registerTask('test', ['bootstrapCore', 'mochaTest']);
  grunt.registerTask('rebuild', ['clean', 'build']);
};
