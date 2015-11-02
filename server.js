var FILE_INPUT_NAME = "twitter.json";
var PORT = 3000;

var http = require("http");
var fs = require("fs");
var twitterData = JSON.parse(fs.readFileSync("./" + FILE_INPUT_NAME));
var html = fs.readFileSync("index.html");
var jquery = fs.readFileSync("jquery.js");
var client = fs.readFileSync("client.js");
var style = fs.readFileSync("style.css");

/* Returns the user information for a screen_name

   param: screen_name
*/
function getUserByScreenName (data){
    // Get param out of the post data
    var screen_name = data.screen_name;
    // Check whether or not that user exists
    var found = false;
    if (screen_name){
        // Iterate through all the users
        for (var i = 0; i < twitterData.length; i++)
        {
            var tweet = twitterData[i],
                user = tweet.user;
            if (screen_name == user.screen_name){
                // Get information on the user
                userData = {
                    "name" : user.name,
                    "location" : user.location,
                    "description" : user.description,
                    "url" : user.url
                };
                data = userData;
                found = true;
                break;
            }
        }
    }
    // Return info on user if exists, else an error signifier
    if (found)
        data = JSON.stringify(data);
    else
        data = JSON.stringify({"UserNotFound" : true});

    return data;
}


/* Returns the twitter post information pertaining to a twitter id

   param: twitter id
*/
function getTwitterID (data){
    // Get param out of the post data
    var id = data.id;
    // Check whether or not that user exists
    var found = false;
    if (id){
        // Iterate through all the users
        for (var i = 0; i < twitterData.length; i++)
        {
            var tweet = twitterData[i],
                user = tweet.user;
            if (id == tweet.id){
                // Get information on the user
                userData = {
                    "id" : tweet.id,
                    "text" : tweet.text,
                    "data" : tweet.created_at,
                    "username" : user.screen_name
                };
                data = userData;
                found = true;
                break;
            }

        }
    }
    // Return info on user if exists, else an error signifier
    if (found)
        data = JSON.stringify(data);
    else
        data = JSON.stringify({"IdNotFound" : true});
    return data;
}

/* Returns information about all tweets in <twitter.json>

   param: none
*/
function getAllTweets () {
    var data = {};
    // Iterate through all tweets
    for (var i = 0; i < twitterData.length; i++)
    {
        var tweetName = "tweet #"  + (i + 1).toString();
        // Tweet information
        var tweet = twitterData[i],
            // User information
            user = tweet.user,
            // Get all data pertaining to tweet
            tweetData = {
                "id" : tweet.id,
                "text" : tweet.text,
                "data" : tweet.created_at,
                "username" : user.screen_name
            };
        // Append tweet json data to json of all tweet information
        data[tweetName] = tweetData;
    }
    data = JSON.stringify(data);
    return data;
}


/* Returns information about all users in <twitter.json>

   param: none
*/
function getAllUsers () {
    var data = [];
    // Tracking dictionary used to remove duplicate users
    var tracker = {};
    for (var i = 0; i < twitterData.length; i++)
    {
        var tweet = twitterData[i],
            user = tweet.user,
            // Gather user data
            userData = {
                "id" : user.id,
                "name" : user.name,
                "username" : user.screen_name,
                "description" : user.description
            };
        // If the user has not been selected before, we select them
        if (!(user.id in tracker)){
            // Add user to our return array
            data.push(userData);
            // Add user to our tracker
            tracker[user.id] = true;
        }
    }
    data = JSON.stringify(data);
    return data;
}

/* Returns all links denoted in tweet messages

   param: none
*/
function getAllExternalLinks () {
    var data = [];
    for (var i = 0; i < twitterData.length; i++){
        var tweet = twitterData[i],
            retList = [],
            hasLink = false,
            // Create an array of every word (potential link)
            text = tweet.text.split(" ");
        for (var j = 0; j < text.length; j++){
            // If the array element has more than 4 chars, it's a potential link
            if (text[j].length > 4){
                // Check if the first 5 chars represent a link
                if (text[j].substring(0, 5) == "http:"){
                    retList.push(text[j]);
                    hasLink = true;
                }
            }
        }
        if (hasLink)
            data.push({"id" : tweet.id, "urls" : retList});
    }
    data = JSON.stringify(data);
    return data;
}

/* Returns expanded link associated with each user

   param: none
*/
function getAllUserExpandedURL() {
    var data = [];
    for (var i = 0; i < twitterData.length; i++){
        var tweet = twitterData[i],
            user = tweet.user,
            isExpanded = user.entities.url.urls[0].expanded_url;

            if (isExpanded == null)
                data.push({"id" : user.id, "url" : user.url});
            else
                data.push({"id" : user.id, "url" : isExpanded});

    }
    data = JSON.stringify(data);
    return data;
}

// Server Setup
var server = http.createServer(
    // Request handler
    function (req, res){
        // GET request handler
        if (req.method == "GET"){
            // Switch on the http endpoints
            switch (req.url)
            {
                // Home
                case "/":
                    res.writeHead(200);
                    res.end(html);
                break;
                // Serve up jquery library
                case "/jquery.js":
                    res.writeHead(200);
                    res.end(jquery);
                break;
                // Serve up client side javascript file
                case "/client.js":
                    res.writeHead(200);
                    res.end(client);
                break;
                // Serve up style file
                case "/style.css":
                    res.writeHead(200);
                    style = fs.readFileSync("style.css");
                    res.end(style);
                break;
                // Handle GET request for getAllTweets
                case "/getAllTweets":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    var data = getAllTweets();
                    res.write(data);
                    res.end();
                    break;
                // Handle GET request for getAllUserExpandedURL
                case "/getAllUserExpandedURL":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    var data = getAllUserExpandedURL();
                    res.write(data);
                    res.end();
                    break;
                // Handle GET request for getAllUsers
                case "/getAllUsers":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    var data = getAllUsers();
                    res.write(data);
                    res.end();
                    break;
                // Handle GET request for getAllExternalLinks
                case "/getAllExternalLinks":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    var data = getAllExternalLinks();
                    res.write(data);
                    res.end();
                    break;
                // Return a 404 for any erroneous endpoint request
                default:
                    res.writeHeader(404, {"Content-Type": "plain/text"});
                    res.write("Not Found");
                    res.end();
            }
        }
        // POST request handler
        else{
            // Switch on http endpoints
            switch (req.url)
            {
                // Handle POST request for tweet information by tweet id
                case "/getTwitterID":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    // Initialize our accumulator for the POST data
                    var data = '';
                    // Concatenate chunks of data as the POST is still coming through
                    req.on('data', function(chunk) {
                        data += chunk.toString();
                    });
                    // At the end of the POST request, process the data, then return our response
                    req.on('end', function() {
                        data = JSON.parse(data);
                        data = getTwitterID(data);
                        res.writeHeader(200, {"Content-Type": "application/json"});
                        res.write(data)
                        res.end();
                    });
                    break;
                // Handle POST request for user information by screen name
                case "/getUserByScreenName":
                    res.writeHeader(200, {"Content-Type": "application/json"});
                    // Initialize our accumulator for the POST data
                    var data = '';
                    // Concatenate chunks of data as the POST is still coming through
                    req.on('data', function(chunk) {
                        data += chunk.toString();
                    });
                    // At the end of the POST request, process the data, then return our response
                    req.on('end', function() {
                        data = JSON.parse(data);
                        data = getUserByScreenName(data);
                        res.writeHeader(200, {"Content-Type": "application/json"});
                        res.write(data)
                        res.end();
                    });
                    break;
                default:
                    res.writeHeader(404, {"Content-Type": "plain/text"});
                    res.write("Not Found");
                    res.end();
            }
        }
    }
);

// Start the server
// Serve at port 3000
console.log("Server started\nListening on port " + PORT.toString());
server.listen(PORT);
