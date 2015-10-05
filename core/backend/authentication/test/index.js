'use strict';

var chai = require('chai'),
    should = chai.should(),
    expect = chai.expect;

chai.use(require('chai-passport-strategy'));

var authentication = require('_/authentication');

describe('\x1b[33mAuthentication\x1b[0m', function() {
  it('Init should not fail', function(done) {
    authentication.init(function(err) {
      expect(err).to.not.exist;
      done();
    })
  });

  describe('Handling a request with valid credential in header', function() {
    var user,
        info;

   before(function(done) {
     chai.passport.use(authentication.strategy)
     .success(function(u, i) {
       user = u;
       info = i;
       done();
     })
     .req(function(req) {
       req.headers.authorization = 'Bearer vF9dft4qmT';
     })
     .authenticate();
   });

   it('Should supply user', function() {
     expect(user).to.be.an.object;
     expect(user.id).to.equal('1234');
   });

   it('Should supply info', function() {
     expect(info).to.be.an.object;
     expect(info.scope).to.equal('read');
   });
 });


});
