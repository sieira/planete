'use strict'

/**
 * Dependencies
 */
var should = require('chai').should(),
    expect = require('chai').expect;

var logger = require('_/logger');

describe('\x1b[33mLogger\x1b[0m', function() {
  it('Should generate new instances', function() {
    logger.new().should.not.equal(logger);
  });
});
