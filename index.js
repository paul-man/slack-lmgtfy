var express = require('express');
var bodyParser = require('body-parser');

// Create a new instance of express
var app = express();

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));

// Route that receives a POST request to /sms
app.post('/lmgtfy', function (req, res) {
  console.log("Post");
  res.set('Content-Type', 'text/plain');
  res.send(`You sent: ${req} to Express`);
})

// Tell our app to listen on port 3000
app.listen(3000, function (err) {
  if (err) {
    throw err;
  }

  console.log('Server started on port 3000');
});
