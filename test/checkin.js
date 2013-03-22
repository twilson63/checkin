var request = require('request');
var expect = require('expect.js');
var app = require('../server');
app({ 
  port: 3000, 
  expire: 60, 
  alertUrl: 'http://localhost:8000/alert',
  allClear: 'http://localhost:8000/allclear'
});

describe('POST /myapp', function() {
  it('should checkin successfully', function(done) {
    request.post('http://localhost:3000/myapp', { json: true }, function(e,r, b) {
      expect(r.statusCode).to.be(200);
      expect(b.status).to.be("active");
      done();
    });
  });
  it('should checkin successfully2', function(done) {
    request.post('http://localhost:3000/myapp', { json: true }, function(e,r, b) {
      expect(r.statusCode).to.be(200);
      expect(b.status).to.be("active");
      done();
    });
  });
  it('should not be successful', function(done) {
    request.post('http://localhost:3000/my app', { json: true }, function(e,r, b) {
      expect(r.statusCode).to.be(500);
      expect(b.error).to.be('spaces not allowed in app name');
      done();
    });
  });
});