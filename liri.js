//Required Variables/Dependencies
var fs = require("fs");
var keys = require("./keys.js");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var twitterKeys = keys.twitterKeys;

// //input variables
var userInput = process.argv[2];
var alternateUserInput = process.argv[3];

console.log('Enter "my-tweets", "spotify-this-song", "movie-this" or "do-what-it-says"');

// //**********SWITCH CASE COMMAND**********

switch (userInput) {
    case 'my-tweets':
        twitterFunction();
        break;

    case 'spotify-this-song':
        spotifyFunction();
        break;

    case 'movie-this':
        movieFunction();
        break;

        case 'do-what-it-says':
        doWhatItSaysFunction();
        break;

    default:
        console.log("Enter 'myTwitter', 'spotifyThisSong', 'movie-this', or 'do-what-it-says'");
}



//This is the function to be called when user inputs node app.js my-tweets.  This function will pull 20 twitter posts and print them in the terminal
function twitterFunction() {
    //for user based authentication.  Var client now holds the twitter keys that are stored in keys.js
    var client = new twitter(twitterKeys);
    //passing the endpoint and parameters.
    client.get("statuses/user_timeline", { count: 20 }, function(error, tweets, response) {
        if (!error)
        //object"tweets".methodName"forEach"--->using forEach method to execute the function
            tweets.forEach(function(tweet) {
            //console.logging tweet text, creation time, times favorited, times retweeted
            console.log(tweet.text);
            console.log("created: " + tweet.created_at);
            console.log("favorited: " + tweet.favorite_count + " times");
            console.log("retweeted: " + tweet.retweet_count + " times");
            console.log("***********************************");
        });
    })
    //the user input will append to the log.txt file(ex. my tweets)
    fs.appendFile("log.txt", ", " + userInput);
};


//This function will get information pertaining to the song name that the user types in and print the song information in the terminal
function spotifyFunction() {
    //variable used to hold the selected track information
    var trackSelect;
    //if variable alternateUserInput is not defined variable trackSelect will default to "The Sign"
    if (alternateUserInput === undefined) {
        trackSelect = "The Sign";
        //else variable trackSelect = variable alternateUserInput
    } else {
        trackSelect = alternateUserInput;
    }
    //from Spotify documentation.  type: track, query: value of trackSelect which is determined by alternateUserInput variable
    spotify.search({ type: 'track', query: trackSelect }, function(err, data) {
        //if error occurs console.log Error message
        if (err) {
            console.log('Error occurred: ' + err);
            return;
            //else console.log the Artist, Song, Preview, and Album
        } else {
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Album: " + data.tracks.items[0].album.name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview Here: " + data.tracks.items[0].preview_url);
            console.log("Explicit Content: " + data.tracks.items[0].explicit);
        }
    });
    //the user input will append to the log.txt file(ex. spotify-this-song + song title)
    fs.appendFile("log.txt", ", " + userInput + " " +alternateUserInput);
};


// This function will have the user enter a movie title and pull information which will print to the terminal.
function movieFunction() {
    //console.log when entering the function
    console.log("Entering Movie Function");

    //variable to store the movie title the user inputs
    //if user does not put in any input the movie will default to Mr.Nobody
    var movieTitle;
    if (alternateUserInput === undefined) {
        movieTitle = "Mr. Nobody";
    } else {
        movieTitle = alternateUserInput;
    };


    //Request Code line found in OMDB in class assignment
    //var movieTitle is put in the middle of the URL where the movie title is requested
    request("http://www.omdbapi.com/?t=" + movieTitle + "&plot=short&r=json &tomatoes=true", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            //an alterative to using JSON.parse(body) for all console.logs would be to create a variable =JSON.parse(body).  e.x. console.log("The movie's title is: " + variable.Title);
            //Model Fields found at = https://media.readthedocs.org/pdf/omdbpy/latest/omdbpy.pdf
            console.log("The movie's title is: " + JSON.parse(body).Title);
            console.log("The movie was released in: " + JSON.parse(body).Year);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("This movie was produced in: " + JSON.parse(body).Country);
            console.log("This movie is available in: " + JSON.parse(body).Language);
            console.log("This movie's plot is:  " + JSON.parse(body).Plot);
            console.log("The movie has the following actors: " + JSON.parse(body).Actors);
            //ROTTEN TOMATOES RATING AND WEBSITE
            console.log("The Rotten Tomatoes score for this film is " + JSON.parse(body).tomatoRating);
            console.log("The Rotten Tomatoes URL for this film is " + JSON.parse(body).tomatoURL);           
        }
    });
    //The user input will append to the log.txt file(ex. movie-this + movie title)
    fs.appendFile("log.txt", ", " + userInput + " " +alternateUserInput);
};


// // //Function needed for Do-what-it-says
function doWhatItSaysFunction() {
    fs.readFile("random.txt", "utf8", function(error, body) {
        console.log(body);
        var bodyArr = body.split(",");
        if (bodyArr[0] === "my-tweets"){
            twitterFunction();
        } else if (bodyArr[0] === "spotify-this-song"){
            spotifyFunction();
        } else if (bodyArr[0] === "movie-this"){
            movieFunction();
        }

        })
    //The user input will append to the log.txt file(ex. do-what-it-says + my tweets)
    fs.appendFile("log.txt", ", " + userInput + " " +alternateUserInput);
    };
     

