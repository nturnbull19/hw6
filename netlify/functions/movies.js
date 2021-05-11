// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  // check if url is correct
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Please add a year and genre to the url. Add "?year=<input year>&genre=<input desired genre>" to end of url. An example would be http://localhost:8888/.netlify/functions/movies?year=2019&genre=Drama` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    // loop through movie data
    for (let i=0; i < moviesFromCsv.length; i++) {

      // store each item as a result
      let result = moviesFromCsv[i]

      // check if inputted genre is within string of genres listed
      let genreCheck = result.genres.includes(genre)

      // ignore results without genres or runtime and include only movies with included genre as one of the genres listed within the movie data
      if (result.genres != `\\N` && result.runtimeMinutes != `\\N` && result.startYear == year && genreCheck == true) {
        let movie = {
          title: result.primaryTitle,
          year: result.startYear,
          genres: result.genres
        }
        
        // push results into final array
        returnValue.movies.push(movie)
        // increment number of results in final value by 1
        returnValue.numResults = returnValue.numResults + 1
        
      }
      
    }
    
   
    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(returnValue) // a string of data
    }
  }
}