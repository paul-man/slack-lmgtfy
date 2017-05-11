var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var https = require("https");
var moment = require('moment-timezone');
var config = require('./config'); // get our config file
var RtmClient = require('@slack/client').RtmClient;

var bot_token = config.slack_bot_token || '';

var morning = moment("08:30:00", 'HH:mm A');
var night = moment("24:00:00", 'HH:mm A');

var sloken = config.sloken;

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
    var token = obj.token;
    var text = obj.text;
    console.log("Post ::", moment().format());
    console.log(obj);
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

app.post('/youtube', function (req, res) {
    var obj = req.client._httpMessage.req.body;
    var text = obj.text;
    console.log("Post ::", moment().format());
    console.log(obj);
    var link = "https://www.youtube.com/results?search_query=" + encodeURIComponent(text);

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

var rtm = new RtmClient(bot_token);
rtm.start();

rtm.on(RTM_EVENTS.MESSAGE, function handleRtmMessage(message) {
  var channel = "#general"; //could also be a channel, group, DM, or user ID (C1234), or a username (@don)
  rtm.sendMessage("Hello <@" + message.user + ">!", message.channel);
});

setInterval(function() {
    var now = moment.tz.setDefault('America/New_York');
    var day = now().day();
    if (day >= 1 && day <= 5) {
        if (now().isAfter(morning) && now().isBefore(night)) {
            console.log("DEBUG : Making sure heroku app is awake::", now().format());
            https.get("https://slack-lmgtfy.herokuapp.com");
        }
    }
}, 1500000); // every 5 minutes (300000)


// Response format
// {
//     "text": "It's 80 degrees right now.",
//     "attachments": [
//         {
//             "text":"Partly cloudy today and tomorrow"
//         }
//     ]
// }
