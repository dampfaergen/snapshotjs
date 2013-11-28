var http = require('http');
var url = require("url");
//var exec = require("child_process").exec;
var spawn = require('child_process').spawn;

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
  }else if(escapedFragment){

    // Create url
    var fullUrl = "http://norsksans.appspot.com/?agent_is_snapshot=true#!" + escapedFragment;
    var fullUrlHuman = "http://www.norsksans.no/#!" + escapedFragment;

    console.log("Taking snapshot of " + fullUrl);

    // Make snapshot
    var args = ["phantomjs/snapshot.js", fullUrl];
    console.log("Arguments " + args);

    var phantomjs = spawn('phantomjs', args);
    var phantomData = "";
    phantomjs.stdout.on('data', function(chunk) {
      phantomData += chunk;
      console.log("Receiving data chunk");
    });

    // add an 'end' event listener to close the writeable stream
    phantomjs.stdout.on('end', function() {
        console.log("Finished receiving from phantom");
        // add base url
        var output = phantomData.replace('<head>', '<head><base href="http://www.kobstaden.dk">');

        // remove javascript
        output = output.replace(/<script.*?>[\s\S]*?<\/.*?script>/g,'');

        // add redirect
        if(redirectClient !== "false"){
          output = output.replace('<head>','<head><script type="text/javascript">window.location = "' + fullUrlHuman +'"</script>');
        }
        //console.log(output);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(output);
    });

    // when the spawn child process exits, check if there were any errors and close the writeable stream
    phantomjs.on('exit', function(code) {
        if (code !== 0) {
            console.log('Failed: ' + code);
        }
        //this.disconnect();
    });

  // do nothing
  }else{
    console.log("_escaped_fragment_ not set for: " + req.url);
    res.writeHead(404, {'Content-Type': 'text/html'});
    res.end("_escaped_fragment_ not set :( - Please visit kobstaden.dk");
  }

}).listen(8080, '0.0.0.0');
//}).listen(9090, '127.0.0.1');
