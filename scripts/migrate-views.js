var http = require('http');
var config = require("../config");
var sys = require('sys');
var request = require('request');

var h = {accept:'application/json', 'content-type':'application/json'};
var couch_loc = "http://" + config.opt.couch_user + ":" + config.opt.couch_pass + "@" + config.opt.couch_host + ":" + config.opt.couch_port + "/" + config.opt.couch_prefix + "_";
var all_view_uri = couch_loc + 'apps' + '/_design/nodeapps'
var design_document = {"language": "javascript","views": {"all": {"map": "function(doc) { emit(doc.username, doc);}"}}}

request({uri:all_view_uri, method:'GET', headers:h}, function (err, response, body) {

  if (response.statusCode == 404) {
    request({uri:all_view_uri, method:'PUT', headers:h, body:JSON.stringify(design_document)}, function (err, response, body){
      if (response.statusCode == 201) {
        console.log("all view created");
      } else {
        console.log(sys.inspect(body));
        console.log(sys.inspect(err));
      }
    });
  } else {
    doc = JSON.parse(body);
    design_document._rev = doc._rev;
    request({uri:all_view_uri + '?rev=' + doc._rev, method:'PUT', headers:h, body:JSON.stringify(design_document)}, function (err, response, body){
      if (response.statusCode == 201) {
        console.log("all view updated");
      } else {
        console.log(sys.inspect(body));
        console.log(sys.inspect(err));
      }
    });
  }
});