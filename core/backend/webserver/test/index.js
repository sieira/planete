'use strict';

/**
 * Dependencies
 */
var should = require('chai').should(),
    expect = require('chai').expect,
    http = require('http'),
    config = require('_').config,
    request = require('supertest');

var server = require('_/webserver');

describe('\x1b[33mWeb Server\x1b[0m', function() {
  it('Requesting an uninitialised server should return 404', function(done) {
    request(server)
    .get('/')
    .expect(404, done);
  });

  it('Should fail trying to close an uninitialised server', function() {
    expect(server.close).to.throw(Error);
  });

  it('Creating the server should not fail', function(done) {
    server.init(function(err) {
      expect(err).to.not.exist;

      http.request({
          host: config.TEST_HOST,
          port: config.TEST_PORT,
        }, function (res) {
          expect(res).to.exist;
          done();
        }).end();
    });
  });

  it('Requesting / should return 200', function(done) {
    request(server)
    .get('/')
    .expect(200, done);
  });

  it('Requesting an unexistant URL should return 404', function(done) {
    request(server)
    .get('/foo/bar')
    .expect(404, done);
  });

  it('Should close the server', function() {
    server.close(function(err) {
      expect(err).to.not.exist;

      /** This doesn't work with async functions
      expect(
      http.request({
            host: config.TEST_HOST,
            port: config.TEST_PORT,
          }).end).to.throw(Error);**/
    });
  });

  it('Should fail closing a closed server', function() {
    expect(server.close).to.throw(Error);
  });

});
