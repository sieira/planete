'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    symlink: {
      options: {
        overwrite: true
      },
      explicit: {
        src: 'backend/core',
        dest: 'node_modules/_'
      }
    },

    auto_install: {
      local: {},
      options: {
        recursive: true,
        exclude: ['.git', 'node_modules', 'bower_components']
      }
    },

    mochaTest: {
      test: {
        options: {
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: true, // Optionally clear the require cache before running tests (defaults to false)
          exclude: 'node_modules'
        },
        src: ['**/test/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('build', ['auto_install', 'symlink']);
  grunt.registerTask('test', ['mochaTest']);
};
