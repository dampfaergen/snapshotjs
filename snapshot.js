var http = require('http');
var url = require("url");
var exec = require("child_process").exec;

var takeSnapshot = function(escapedFragment, redirectClient, callback){

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
    var output = stdOut.replace('<head>', '<head><base href="http://www.kobstaden.dk">');

    // remove javascript
    output = output.replace(/<script.*>.*<\/script>/g,'');

    // add redirect
    if(redirectClient !== "false"){
      output = output.replace('<head>','<head><script type="text/javascript">window.location = "' + full_url +'"</script>');
    }

    callback(output);
  });
};

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});

  //Get fragment
  var urlParsed = url.parse(req.url, true);
  var escapedFragment = urlParsed.query._escaped_fragment_;
  var redirectClient = urlParsed.query.redirect_client;


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
    takeSnapshot(escapedFragment, redirectClient, function(output){
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
