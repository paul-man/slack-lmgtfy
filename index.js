var express = require('express');
var bodyParser = require('body-parser');
var util = require('util');
var https = require("https");
var moment = require('moment-timezone');
var config = require('./config'); // get config file
var request = require('request');
var googleStocks = require('google-stocks');

var red = "#FF0000";
var green = "#00FF00";

moment.tz.setDefault('America/New_York');

var morning = moment("08:30:00", 'HH:mm A');
var night = moment("24:00:00", 'HH:mm A');

var sloken = config.sloken;

// Create a new instance of express
var app = express();

var port = process.env.PORT || 8080;

// Tell express to use the body-parser middleware and to not parse extended bodies
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', function (req, res) {
    var html = "Thank you for visiting us.  There is not much to see so please leave.";
    console.log("GET ::", moment().format());
    res.end(html);
});

app.post('/google', function (req, res) {
    console.log("POST ::", moment().format());
    var obj = req.client._httpMessage.req.body;
    var token = obj.token;
    var text = obj.text;
    console.log(obj);
    var link = "https://www.google.com/#q=" + encodeURIComponent(text);

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var attachments_arr = [{
        text: link,
        color: "#34A853"
    }];
    var json = JSON.stringify({
        response_type: "in_channel",
        text: "Here's your link, lazy!",
        attachments: attachments_arr
    });
    res.end(json);
});

app.post('/youtube', function (req, res) {
    console.log("POST ::", moment().format());
    var obj = req.client._httpMessage.req.body;
    var text = obj.text;
    console.log(obj);
    var link = "https://www.youtube.com/results?search_query=" + encodeURIComponent(text);

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var attachments_arr = [{
        text: link,
        color: "#CC181E"
    }];
    var json = JSON.stringify({
        response_type: "in_channel",
        text: "Here's your link, lazy!",
        attachments: attachments_arr
    });
    res.end(json);
});

app.post('/stackoverflow', function (req, res) {
    console.log("POST ::", moment().format());
    var obj = req.client._httpMessage.req.body;
    var text = obj.text;
    console.log(obj);
    var link = "https://stackoverflow.com/search?tab=votes&q=" + encodeURIComponent(text);

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var attachments_arr = [{
        text: link,
        color: "#F48024"
    }];
    var json = JSON.stringify({
        response_type: "in_channel",
        text: "Here's your link, lazy!",
        attachments: attachments_arr
    });
    res.end(json);
});

app.post('/stock', function (req, res) {
    console.log("POST ::", moment().format());
    var obj = req.client._httpMessage.req.body;
    var ticker = obj.text;
    // console.log(obj);
    var price;
    var change;
    var change_percent;
    var exchange;
    var trade_time;
    var color_val;
    var ticker_val;
    res.writeHead(200, {
        "Content-Type": "application/json"
    });


    googleStocks([ticker], function (error, data) {
        if (!error && response.statusCode == 200) {
            data = data.replace(/\//g, "");
            data = JSON.parse(data)[0];
            console.log(data);
            price = data.l;
            change = data.c;
            change_percent = data.cp;
            exchange = data.e;
            trade_time = data.lt;
            ticker_val = data.t;
            // console.log(price, change, change_percent, exchange, trade_time);
            // res.end(JSON.stringify(data));
            console.log(price, change);
            console.log(price, change);
            if (change.charAt(0) == '+') {
                color_val = green;
            } else {
                color_val = red;
            }

            var attachments_arr = [{
                text: "$" + price + " " + change + " (" + change_percent + "%)",
                color: color_val
            }];
            var ticker_link = "<https://www.google.com/finance?q=" + ticker_val + "|" + ticker_val + ">";
            var json = JSON.stringify({
                response_type: "in_channel",
                text: ticker_link + " traded on " + exchange + " @ " + trade_time,
                attachments: attachments_arr
            });
            res.end(json);
        } else {
            var attachments_arr = [{
                text: "https://www.youtube.com/watch?v=OGp9P6QvMjY",
                color: red
            }];
            var json = JSON.stringify({
                response_type: "in_channel",
                text: "No such ticker.  See link for explanation.",
                attachments: attachments_arr
            });
            res.end(json);
        }

    });
});

app.post('/test', function (req, res) {
    console.log("POST ::", moment().format());
    var obj = req.client._httpMessage.req.body;
    var text = obj.text;
    console.log(obj);
    var link = "https://www.youtube.com/watch?v=X-6V0Wg0aOI";

    res.writeHead(200, {
        "Content-Type": "application/json"
    });
    var attachments_arr = [{
        text: link
    }];
    var json = JSON.stringify({
        response_type: "ephemeral",
        text: "Why would you go and do a thing like that?",
        attachments: attachments_arr
    });
    res.end(json);
});

app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log('Server started on port', port);
});

setInterval(function () {
    var now = moment();
    var day = now.day();
    if (day >= 1 && day <= 5) {
        if (now.isAfter(morning) && now.isBefore(night)) {
            console.log("DEBUG : Making sure heroku app is awake::", now.format());
            https.get("https://slack-lmgtfy.herokuapp.com");
        }
    }
}, 1500000); // every 25 minutes