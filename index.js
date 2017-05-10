var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var https = require("https");
var moment = require('moment-timezone');

// Create a new instance of express
var app = express();

var port = process.env.PORT || 8080;

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req,res) {
    var html = "Thank you for visiting us.  There is not much to see so please leave.";
    res.end(html);
});

// Route that receives a POST request to /sms
app.post('/lmgtfy', function (req, res) {
    var obj = req.client._httpMessage.req.body;
    var text = obj.text;
    console.log("Post");
    console.log(obj);
    // res.send(util.inspect(obj, {depth: null}));

    // {
    //     "text": "It's 80 degrees right now.",
    //     "attachments": [
    //         {
    //             "text":"Partly cloudy today and tomorrow"
    //         }
    //     ]
    // }

    var link = "https://www.google.com/#q=" + encodeURIComponent(text);

    res.writeHead(200, {"Content-Type": "application/json"});
    var attachments_arr = [{text: link}];
    var json = JSON.stringify({
        response_type: "in_channel",
        text: "Here's your link, lazy!",
        attachments: attachments_arr
    });
    res.end(json);
});

// Tell our app to listen on port 3000
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log('Server started on port', port);
});

setInterval(function() {
    moment.tz.setDefault('America/New_York');
    var day = moment().day();
    var hour = moment().hour();
    var minute = moment().minutes();
    if (day >= 1 && day <= 5) {
        if ((hour >= 23 && minute >=45 )  && (hour <= 24)) {
            console.log(moment().format(), "DEBUG : Making sure heroku is awake.");
            https.get("https://slack-lmgtfy.herokuapp.com");
        }
    }
}, 3000); // every 5 minutes (300000)
