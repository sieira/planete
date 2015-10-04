'use strict';

var should = require('chai').should(),
    expect = require('chai').expect;

var config = require('_/config');

describe('\x1b[33mConfig\x1b[0m', function() {
  it('Default variables should exist', function() {
    expect(config.NODE_ENV).to.exist;
    expect(config.HOST).to.exist;
    expect(config.PORT).to.exist;
    expect(config.TEST_HOST).to.exist;
    expect(config.TEST_PORT).to.exist;
  });

  it('Loading variables should not fail', function() {
    config.init(function(err) {
      expect(err).to.not.exist;
    });
  });

  /**
   * Check if needed envs (without a default value) exist. This doesn't guarantee
   * that every env needed is registered, so each module should test
   * it those they use are actually there.
   */
  it('Non-default variables should be registered', function() {
    expect(config.DB_HOST).to.exist;
    expect(config.DB_PORT).to.exist;
    expect(config.DB_URL).to.exist;
    expect(config.DB_USER).to.exist;
    expect(config.DB_PASSWORD).to.exist;
    expect(config.DB).to.exist;
    expect(config.TEST_DB).to.exist;
    expect(config.LOG_DIR).to.exist;
  });
});
