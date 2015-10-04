'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    symlink: {
      options: {
        overwrite: true
      },
      explicit: {
        src: 'core/backend',
        dest: 'node_modules/_'
      }
    },

    auto_install: {
      local: {},
      options: {
        recursive: true,
        exclude: ['.git', 'node_modules', 'bower_components', 'sample_module']
      }
    },

    mochaTest: {
      test: {
        options: {
          quiet: false, // Optionally suppress output to standard out (defaults to false)
          clearRequireCache: true // Optionally clear the require cache before running tests (defaults to false)
        },
        src: ['**/test/**/*.js'],
        filter: function(path) {
          return [
            'node_modules',
            'bower_components',
            'sample_module'
          ].every(function(regexp) {
            return path.match(regexp) === null;
          });
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-auto-install');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.loadNpmTasks('grunt-mocha-test');


  grunt.registerTask('build', ['auto_install', 'symlink']);
  grunt.registerTask('test', ['mochaTest']);
};
