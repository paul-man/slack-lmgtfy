var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');

// Create a new instance of express
var app = express();

var port = process.env.PORT || 8080;

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Route that receives a POST request to /sms
app.post('/lmgtfy', function (req, res) {
    var obj = req.client._httpMessage.req.body;
    res.set('Content-Type', 'text/plain');
    console.log("Post");
    console.log(obj);
    console.log(util.inspect(obj, {depth: null}));
    // res.send(util.inspect(obj, {depth: null}));
    //
    var keys = Object.keys(obj);
    console.log('obj contains ' + keys.length + ' keys: '+  keys);

    res.send(util.inspect(obj, {depth: null}));
});

// Tell our app to listen on port 3000
app.listen(port, function (err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port', port);
});
