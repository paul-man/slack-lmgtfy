var express = require("express");
var http = require('http');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/lmgtfy', function(req, res) {
    // var query = querystring.stringify({q: request.query.text});
    // response.send("https://www.google.com/\#" + query);
    console.log("request:");
    // response.render('pages/index');
});
app.post('/lmgtfy', function(req, res) {
  console.log("request:");
});

app.set('port', (process.env.PORT || 5000));

server = http.createServer(app);
