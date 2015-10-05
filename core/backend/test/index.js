'use strict'

/**
 * Dependencies
 */
var should = require('chai').should(),
    expect = require('chai').expect;

var core;

describe('\x1b[33mCore\x1b[0m', function() {
  it('Should init the core', function() {
    core = require('_');
    core.init(function(err) {
      expect(err).to.not.exist;
    })
  });

  it('Should close the core', function() {
    core.close(function(err) {
      expect(err).to.not.exist;
    })
  });
});
