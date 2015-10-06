'use strict';

var glob = require("glob"),
    util = require("./util");

process.env.NODE_ENV = 'test';

var exclude = ['.git', 'node_modules','bower_components','sample_module'];
var files = glob.sync("**/test/**/*.js", {});

files = files.filter(function(path) {
  return exclude.every(function(regexp) {
    return path.match(regexp) === null;
  });
});

files = util.pathsort(files);


module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

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

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('build', ['auto_install', 'symlink']);
  grunt.registerTask('test', ['mochaTest']);
};
