// # CheckIn
var EVERY_5_MINUTES = 1000 * 60 * 5;

var restify = require('restify');
var request = require('request');
var bunyan = require('bunyan');
var moment = require('moment');
var _ = require('underscore');

var app = module.exports = function(config) {
  var apps = [];

  var server = restify.createServer({ name: 'CheckIn' });
  server.use(restify.bodyParser());
  // Add Logging
  if (config.debug) {
    server.on('after', restify.auditLogger({
      log: bunyan.createLogger({
        name: 'audit',
        stream: process.stdout
      })
    }));
  }

  //# Api

  // List Apps in json
  server.get('/', function(req, res, next) {
    var results = _(apps).where({status: 'active'});
    res.send(results);
    return next();
  });

  // get app info
  server.get('/', function(req, res, next) {
    // do not allow spaces for appname
    if (req.params.app.indexOf(' ') > -1) {
      res.send(500, { error: 'spaces not allowed in app name'});
      return next();
    }
    // find app in array
    var item = _(apps).findWhere({name: req.params.app});
    if (!item) { 
      res.send(404);
      return next();
    }
    res.send(item);
    return next();
  });

  // Check In Application
  server.post('/:app', function(req, res, next) {
    // do not allow spaces for appname
    if (req.params.app.indexOf(' ') > -1) {
      res.send(500, { error: 'spaces not allowed in app name'});
      return next();
    }
    // find app in array
    var item = _(apps).findWhere({name: req.params.app});
    if (!item) {
      item = { name: req.params.app }
      apps.push(item);
    }
    // notify allclear url
    if (item.status && item.status === 'down') {
      // notify allclear app is back up and running....
      request.post(config.resolvedUrl, { json: item }, function(e,r,b){
        console.log('resolved app ' + item.name);
      });
    }
    item.info = req.params;
    item.update = new Date();
    item.status = 'active';
    if (config.debug) { console.log(apps) };
    // send response
    res.send(item);
    return next();
  });

  // Remove Application
  server.del('/:app', function(req, res, next) {
    item = _(apps).findWhere({name: req.params.app});
    item.status = 'deleted';
    res.send(200);
  });

  //## Timer Check
  server.listen(config.port || 3000, function() {
    console.log('~ CheckIn ~');
    console.log('Listening on %s', config.port);
  });

  // check if any apps have not dinged
  setInterval(function(){
    //console.log('checking for straglers...')
    var checkpoint = moment().subtract('minutes', 15);
    console.log('checking');
    _(apps).each(function(item) {
      if(checkpoint.isAfter(item.update) && item.status === 'active') {
          app.state = 'down';
          if (config.alertUrl) {
            request.post(config.alertUrl, {json: item}, function(e, r, b) {
              console.log('notfied alert url');
            });
          }
          console.log('app is down');
          // post 2 alertURL
      }
    });
  }, (EVERY_5_MINUTES));

};

if (!module.parent) {
  app({ 
    port: 3000, 
    expire: 60, 
    alertUrl: 'http://localhost:8000/alert',
    resolvedUrl: 'http://localhost:8000/allclear'
  });
}


