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
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>
**/
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
