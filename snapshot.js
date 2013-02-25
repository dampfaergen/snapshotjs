var http = require('http');
var url = require("url");
var exec = require("child_process").exec;

var takeSnapshot = function(escapedFragment, redirectClient, callback){

  if(!escapedFragment){
    escapedFragment = "";
  }

  // Create url
  var full_url = "http://www.kobstaden.dk/#!" + escapedFragment;

  console.log("Taking snapshot of " + full_url);

  // Make snapshot
  var command = "phantomjs phantomjs/snapshot.js '" + full_url + "'";
  console.log("Command " + command);
  var snapshot = exec(command, function(error, stdOut, stdError){
    console.log("Returning answer");

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
  //Get fragment
  var urlParsed = url.parse(req.url, true);
  var escapedFragment = urlParsed.query._escaped_fragment_;
  var redirectClient = urlParsed.query._redirect_client_;


  // deploy new version
  if(urlParsed.query.deploy){
    res.writeHead(200, {'Content-Type': 'text/html'});
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
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(output);
    });

  // do nothing
  }else{
    console.log("_escaped_fragment_ not set");
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("_escaped_fragment_ not set :( - Please visit kobstaden.dk");
  }

}).listen(9090, '0.0.0.0');
//}).listen(9090, '127.0.0.1');
