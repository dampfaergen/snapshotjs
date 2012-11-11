var http = require('http');
var exec = require("child_process").exec;
var url = require("url");

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  //Get fragment
  var urlParsed = url.parse(req.url, true);
  var urlFragment = urlParsed.query.url_fragment;

  //Create url
  var full_url = "http://www.kobstaden.dk/#!" + urlFragment;
  
  console.log("Taking snapshot of " + full_url);

  //Make snapshot
  snapshot = exec("phantomjs phantomjs/snapshot.js '" + full_url + "'", function(error, stdOut, stdError){
    console.log("Returning answer");
    res.write(stdOut);
    res.end();
  });

}).listen(9090, '127.0.0.1'); //.listen(9090, '178.79.137.106');
