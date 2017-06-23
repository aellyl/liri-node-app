//Week 10 homework - Liri Bot
//started on June 10,2017
//Finished on June 22, 2017
//Developed by Aelly Liu
//
//The following is the available commands:
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says
//
//Instruction:
// 1. node liri.js my-tweets
// This will show your last 20 tweets and when they were created at in your terminal/bash window.
// 2. node liri.js spotify-this-song '<song name here>'
// This will show the following information about the song in your terminal/bash window:

// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from

// If no song is provided then your program will default to "The Sign" by Ace of Base.
// 3. node liri.js movie-this '<movie name here>'
// This will output the following information to your terminal/bash window:

//   * Title of the movie.
//   * Year the movie came out.
//   * IMDB Rating of the movie.
//   * Country where the movie was produced.
//   * Language of the movie.
//   * Plot of the movie.
//   * Actors in the movie.
//   * Rotten Tomatoes URL.

//Default movie name to Mr. Nobody when no movie name is entered
//=========================================================

var request=require("request");

//spotify app 
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
  id: "8348ec1c3304412d81eecf3187edc8c2",
  secret: "571b1ab1e8484a66a4fc38bfd3bd02e2"
});

//twitter app
var Twitter = require('twitter');
var twitterKey=require("./keys.js").twitterKeys;

const fs=require("fs");

//getting command from user
var userCommand=process.argv[2];
var searchTerm="";
if (typeof process.argv[3] === "string" && process.argv[3]!== "")
{
	searchTerm=process.argv[3];
}

//taking command line input to execute the approriate action based on user input
function callApp(command,search){
	var outContent="";

	switch(command)
	{
		case "my-tweets":
			displayTweets();
			break;

		case "spotify-this-song":
			if (search!== "")
			{
				searchSong(search);
			}
			else
			{
				searchSong("The Sign by Ace of Base");
			}
			
			break;

		case "movie-this":
			if (search!== "")
			{
				getMovieInfo(search);
			}
			else
			{
				getMovieInfo("Mr. Nobody");
			}
			
			break;

		case "do-what-it-says":
			readRandom();
			break;
		default:
			console.log("You have entered invalid command.");
			console.log("=================================================================================================");
			console.log("Below are the available commands: my-tweets, spotify-this-song, movie-this, do-what-it-says");
			console.log("Usage: ");
			console.log("node liris.js my-tweets						- this will display the last 20 tweets");
			console.log("node liris.js spotify-this-song <search song title> 		- search the song title on Spotify");
			console.log("node liris.js movie-this <movie title> 				- search the movie title on IMDB");
			console.log("node liris.js do-what-it-says 					- do the command in the random.txt file");
			

	};

}


//call imdb api
function getMovieInfo(movieTitle)
{

	var requestUrl="http://www.omdbapi.com/?apikey=40e9cece&t="+movieTitle;

	request(requestUrl, function(error, response, body) {

	  // If the request was successful...
	  if (!error && response.statusCode === 200) {

	    // Then log the body from the site!
	    result=JSON.parse(body);
	  
		//console.log("++++++++++++++++++++++++++++");
	    //   * Title of the movie.
	    //console.log("Title: "+result.Title);
		//   * Year the movie came out.
		//console.log("Year: "+result.Year);
		//   * IMDB Rating of the movie.
		//console.log("Rating: "+result.Rated);
		//   * Country where the movie was produced.
		//console.log("Country: "+result.Country);
		//   * Language of the movie.
		//console.log("Language: "+result.Language);
		//   * Plot of the movie.
		//console.log("Plot: "+result.Plot);
		//   * Actors in the movie.
		//console.log("Actors: "+result.Actors);
		//   * Rotten Tomatoes URL.
		//console.log("Website: "+result.Website);
		//console.log("++++++++++++++++++++++++++++");

		dataOutput="++++++++++++++++++++++++++++\n"
					+ "Title: "+result.Title
					+ "\nYear: "+result.Year
					+ "\nRating: "+result.Rated
					+ "\nCountry: "+result.Country
					+ "\nLanguage: "+result.Language
					+ "\nPlot: "+result.Plot
					+ "\nActors: "+result.Actors
					+ "\nWebsite: "+result.Website
					+ "\n++++++++++++++++++++++++++++\n";
		
		console.log(dataOutput);
		generateLog("movie-this",movieTitle,dataOutput);
	  	}

	});

}

//call spotify api
function searchSong(songName)
{ 
	spotify.search({ type:"track", query: songName, limit: 1 })
	  .then(function(response) {
		  items=response.tracks.items;
	    var dataOutput= "++++++++++++++++++++++++++++\nArtist name(s): "
						+items[0].album.artists[0].name
						+ "\nSong title: "+items[0].name
						+ "\nPreview link from Spotify: "+items[0].preview_url
						+ "\nAlbum name: "+items[0].album.name
						+ "\n++++++++++++++++++++++++++++\n"
	    console.log(dataOutput);
	 	//Artist(s)
		//console.log("Artist name(s): "+items[0].album.artists[0].name);
		// The song's name
		//console.log("Song title: "+items[0].name);
		// A preview link of the song from Spotify
		//console.log("Preview link from Spotify: "+items[0].preview_url);
		// The album that the song is from
		//console.log("Album name: "+items[0].album.name);
		//console.log("++++++++++++++++++++++++++++");
		//console.log(JSON.stringify(response.tracks,null,2));
		generateLog("spotify-this-song",songName,dataOutput);
	  })
	  .catch(function(err) {
	    console.log(error);
	  });

}

//read random.txt file's command
function readRandom(){
		
		generateLog("do-what-it-says","","Below Entry is the command in the random.txt file.\n---------------------------------------------");

		fs.readFile("./random.txt","utf8", function(error,data){
			if(error)
			{
				return console.log(error);
			}

			var randomContent=data.split(",");
			if (typeof randomContent[1] === "string" && randomContent[1]!== "")
			{
				searchTerm=randomContent[1];
			}
			else
			{
				searchTerm="";
			}
			 callApp(randomContent[0],searchTerm);

		});
}

//call twitter api
function displayTweets(){

	var client= new Twitter(
		{consumer_key: twitterKey.consumer_key,
		consumer_secret: twitterKey.consumer_secret,
		access_token_key: twitterKey.access_token_key,
		access_token_secret: twitterKey.access_token_secret
		}
	);
	client.get("statuses/user_timeline", function(error, tweets, response) {
		if(error){
			console.log(error);	
		};
		var dataOutput="";
		//console.log(tweets);  // The favorites. 
		//console.log(response);  // Raw response object. 
		for(var index in tweets)
		{
			dataOutput+="------------------------------\n"
					+ "tweet#: " + (+index+1)
					+ "\ntweet text: " + tweets[index].text
					+ "\ntweet created at: " + tweets[index].created_at
					+ "\n------------------------------\n";
		}

		console.log(dataOutput);
		generateLog("my-tweets","",dataOutput);
	});

}

//generate log file that documents all the command and data output to log.txt file
function generateLog(inputCommand,inputSearch,output){
	var logContent="\n"+inputCommand+" "+inputSearch+"\n"+output;
	fs.appendFile("log.txt",logContent,function(error){
		if(error)
		{
			console.log(error);
		}
	});
}

callApp(userCommand,searchTerm);