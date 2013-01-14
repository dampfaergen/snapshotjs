var http = require('http');
var url = require("url");
var exec = require("child_process").exec;

var takeSnapshot = function(urlFragment, callback){

  if(!urlFragment){
    urlFragment = "";
  }

  //Create url
  var full_url = "http://www.kobstaden.dk/#!" + urlFragment;
  
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
  var urlFragment = urlParsed.query.url_fragment;
  

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
  }else if(urlParsed.query.url_fragment){
    console.log("Taking screenshot");
    takeSnapshot(urlFragment, function(output){
      res.write(output);
      res.end();
    });

  // do nothing
  }else{
    console.log("Doing nothing with: " + urlParsed.path);
    res.end("Doing nothing with: " + urlParsed.path);
  }

}).listen(9090, '127.0.0.1'); //.listen(9090, '178.79.137.106');
