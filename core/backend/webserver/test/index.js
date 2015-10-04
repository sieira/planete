'use strict';

/**
 * Dependencies
 */
var should = require('chai').should(),
    expect = require('chai').expect,
    request = require('supertest');

var server = require('_/webserver');

describe('\x1b[33mWeb Server\x1b[0m', function() {
  it('Requesting a closed server should return 404', function(done) {
    request(server)
    .get('/')
    .expect(404, done);
  });

  it('Should fail trying to close an uninitialised server', function(done) {
    server.close(function(err) {
      expect(err).to.exist;
      done();
    });
  });

  it('Creating the server should not fail', function(done) {
    server.init(function(err) {
      expect(err).to.not.exist;
      done();
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

  it('Should close the server', function(done) {
    server.once('close', function() {
      request(server)
      .get('/')
      .expect(404, done);
      done();
    });

    server.close(function(err) {
      expect(err).to.not.exist;
    });
  });

  it('Should fail closing a closed server', function(done) {
    server.once('close', function() {
      request(server)
      .get('/')
      .expect(404, done);
      done();
    });

    server.close(function(err) {
      expect(err).to.exist;
    });
  });

});
