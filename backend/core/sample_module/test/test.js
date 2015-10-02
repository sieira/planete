/**
 * This sample file uses mocha and chai.
 *
 * You are adviced to use them for consistance, but
 * you can do whatever you want here indeed.
 * As long as it is a .js file, it will be run by grunt as part of the tests
 *
 */
var should = require('chai').should(),
    expect = require('chai').expect;

// The highest level describe should be the module name.
// This thing -> \x1b[0m will print the name yellow
describe('\x1b[33mSample module\x1b[0m', function() {
  it('Should fail trying to kill an uninitialised server', function() {
    should.fail(0,1,'Test not implemented');
  });
});
