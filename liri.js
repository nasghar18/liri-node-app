
var keys = require('./keys.js');

var Twitter = require('twitter');

var spotify = require('spotify');

var request = require('request');

var fs = require('file-system');

var inquirer = require('inquirer');

var LIRIinput = process.argv[2].toLowerCase();

var secspot = process.argv[3];

function LIRI(){
	
	console.log("LIRI is searching for you...");
	//If you want the last 20 or under tweets
	if(LIRIinput === "my-tweets"){
		//This code connects the keys from the keys.js file so that Twitter can be accessed
		var client = new Twitter({
			consumer_key: keys.twitterKeys.consumer_key,
			consumer_secret: keys.twitterKeys.consumer_secret,
			access_token_key: keys.twitterKeys.access_token_key,
			access_token_secret: keys.twitterKeys.access_token_secret
		});
		//Code that retrieves the information
		client.get('statuses/home_timeline', function(error, tweets, response) {
		  //In case there is an error
		  if(error){
		  	console.log("Could not retrieve files!");
		  	return
		  }
		  //If all is good, display the last 20 or under tweets
		  else{
		  	console.log("Here are your most recent tweets:");
		  	console.log("----------------------------------");
			  for (var i = 0; i < tweets.length; i++) {
			  	console.log("You tweeted: " + tweets[i].text);
			  	console.log("On: " + tweets[i].created_at);
			  	console.log("----------------------------------");
				};
			return
			}
		});

	}
	//If you want to spotify something
	else if(LIRIinput === "spotify-this-song"){
		var songQ = secspot;
		var searchC = 0;
		//The spotify search and display function
		function spotifyRun() {
			spotify.search({ type: 'track', query: songQ }, function(err, data) {
			    if (err) {
			        console.log('An error occurred while trying to get you your music: ' + err);
			        return;
			    }

			    //The following code filters the search results to the first result brought back and shows 4 pieces of information from it
			    else{
		 		console.log("Here is your music information:");
			  	console.log("----------------------------------");
			 	console.log("Artist: " + data.tracks.items[searchC].artists[0].name);
			 	console.log("Song Name: " + data.tracks.items[searchC].name);
			 	console.log("Song Preview: " + data.tracks.items[searchC].preview_url);
			 	console.log("Album: " + data.tracks.items[searchC].album.name);
			 	wrongSong();
			 	}
	     
			});
		}
		//A function that pulls up default results if there is no input for the spotify call.
		function spotifyDefault() {
			spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) {
			    if (err) {
			        console.log('An error occurred while trying to get you your music: ' + err);
			        return;
			    }

			    //The following code extracts the Ace of Base result along with its 4 pieces of information for it
			    else{
		 		console.log("Here is your music information:");
			  	console.log("----------------------------------");
			 	console.log("Artist: " + data.tracks.items[2].artists[0].name);
			 	console.log("Song Name: " + data.tracks.items[2].name);
			 	console.log("Song Preview: " + data.tracks.items[2].preview_url);
			 	console.log("Album: " + data.tracks.items[2].album.name);
			 	wrongSong();
			 	}
	     
			});
		}
		//This function asks to make sure the song was right, if it was not, it pulls back the next result on the list
		function wrongSong() {
		
			inquirer.prompt([

				{
					type: "confirm",
					message: "Was that the song you were looking for?",
					name: "subYesNo"
				},

			]).then(function(response){
				var answer = response.subYesNo;

				if (answer === true) {
					console.log("Glad I could help!");
					return;
				} else {
					searchC++;
					spotifyRun();
				};
			});

		};
		//Initialzing the spotify function depending on what the user input is
		if(songQ !== undefined){
			spotifyRun();
		}else{
			spotifyDefault();
		}

	}
	//If you want to search for a movie
	else if(LIRIinput === "movie-this"){
		var movieT = secspot;
		//The movie search and display function
		function movieSearch(){
			request('http://www.omdbapi.com/?t=' + movieT, function (error, response, body) {
			  if(error){
			  	console.log('error:', error); // Print the error if one occurred 
				}
			  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			  //console.log('body: ' + body); // Print the HTML for the Google homepage. 
			  var bodyP = JSON.parse(body);
			  //console.log(response);
			  var RT = "https://www.rottentomatoes.com/m/" + movieT + "_" + bodyP.Year;
			 
			  console.log("Title: " + bodyP.Title);
			  console.log("Year: " + bodyP.Year);
			  console.log("IMDB Rating: " + bodyP.imdbRating);
			  console.log("Country: " + bodyP.Country);
			  console.log("Language(s): " + bodyP.Language);
			  console.log("Plot: " + bodyP.Plot);
			  console.log("Actors: " + bodyP.Actors);
			  console.log("Rotten Tomatoes Rating: " + bodyP.Ratings[1].Value);
			  console.log("Rotten Tomatoes Link: " + RT);
			  return

			});

		}
		//A function that pulls up default results if there is no input for the movie name.
		function movieDefault(){
			request('http://www.omdbapi.com/?t=mr.nobody', function (error, response, body) {
			  if(error){
			  	console.log('error:', error); // Print the error if one occurred 
				}
			  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			  //console.log('body: ' + body); // Print the HTML for the Google homepage. 
			  var bodyP = JSON.parse(body);
			  //console.log(response);
			  var RT = "https://www.rottentomatoes.com/m/mr.nobody";
			 
			  console.log("Title: " + bodyP.Title);
			  console.log("Year: " + bodyP.Year);
			  console.log("IMDB Rating: " + bodyP.imdbRating);
			  console.log("Country: " + bodyP.Country);
			  console.log("Language(s): " + bodyP.Language);
			  console.log("Plot: " + bodyP.Plot);
			  console.log("Actors: " + bodyP.Actors);
			  console.log("Rotten Tomatoes Rating: " + bodyP.Ratings[1].Value);
			  console.log("Rotten Tomatoes Link: " + RT);
			  return

			});
		}
		//Initialzing the spotify function depending on what the user input is
		if(movieT !== undefined){
			movieSearch();
		}else{
			movieDefault();
		}
	
	}
	//If you want LIRI to read a txt file and search for you
	else if(LIRIinput === "do-what-it-says"){
		//The function that allows LIRI to search the random.txt file and execute what it says for you
		function AltTerm(){
			fs.readFile('./random.txt', 'utf8', (err, data) => {
			  if(err){
			  	console.log("Could not retrieve files!");
			  }
			  else{
			  	var randfile = data;
			  	//A function that splits the entire string from random.txt and stores back what is needed for LIRI
			  	function commandsplit(){
					if (randfile.includes("my-tweets")){
						LIRIinput = randfile;
					}
					else if(randfile.includes("spotify-this-song")){
						LIRIinput = randfile.slice(0,17);
						secspot = randfile.slice(18,randfile.length);
						
					}
					else if(randfile.includes("movie-this")){
						LIRIinput = randfile.slice(0,10);
						secspot = randfile.slice(11,randfile.length);
					}
					else{
						LIRIinput = randfile;
					}


				}
				//Initializing commandsplit function
			  	commandsplit();
			  	//Calling back LIRI with the new stored information
			  	LIRI();
			  }
			});
		}
		
		//Initializing the AltTerm function
		AltTerm();

	}
	//If no function can be recognized, this is the message that is sent
	else{
		console.log("I'm sorry but I can't help you, I'm still learning to get smarter!");
	}
};

LIRI();




// client.get('statuses/home_timeline')
//   .then(function (tweet) {
//     console.log(tweet);
//   })
//   .catch(function (error) {
//     throw error;
//   })