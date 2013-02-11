require('nodetime').profile({
    accountKey: '518c64ed5487c562d52d52024856585eca4e59b5', 
    appName: 'Snapshot nodejs Server'
});
var http = require('http');
var url = require("url");
var exec = require("child_process").exec;

var takeSnapshot = function(escapedFragment, callback){

  if(!escapedFragment){
    escapedFragment = "";
  }

  //Create url
  var full_url = "http://www.kobstaden.dk/#!" + escapedFragment;

  console.log("Taking snapshot of " + full_url);

  //Make snapshot
  var command = "phantomjs phantomjs/snapshot.js '" + full_url + "'";
  console.log("Command " + command);
  var snapshot = exec(command, function(error, stdOut, stdError){
    console.log("Returning answer");
    console.log(stdOut);

    // add base url
    stripBase = stdOut.replace('<head>', '<head><base href="http://www.kobstaden.dk">');

    // remove javascript
    var stripJavascript = stripBase.replace(/<script.*>.*<\/script>/g,'');

    callback(stripJavascript);
  });
};

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  //Get fragment
  var urlParsed = url.parse(req.url, true);
  var escapedFragment = urlParsed.query._escaped_fragment_;


  // deploy new version
  if(urlParsed.query.deploy){
    console.log("Deploying app");
    exec("git pull origin master", function(error, stdOut, stdError){
      console.log(stdOut);
      res.write("Deployed!");
      res.write(stdError);
      res.write(stdOut);
      res.end();
    });

  // take snapshot
  }else if(urlParsed.query._escaped_fragment_){
    console.log("Taking screenshot");
    takeSnapshot(escapedFragment, function(output){
      res.write(output);
      res.end();
    });

  // do nothing
  }else{
    console.log("Doing nothing with: " + urlParsed.path);
    res.end("Doing nothing with: " + urlParsed.path);
  }

}).listen(9090, '0.0.0.0');
//}).listen(9090, '127.0.0.1');
