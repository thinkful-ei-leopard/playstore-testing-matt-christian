const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const playstore = require('./playstore.data');

const app = express();

app.use(morgan('dev'));
app.use(cors());

app.get('/apps', (req, res) => {
  const {sort, genres} = req.query;
  const validGenres = ['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'];
  const validSorts = ['rating', 'app'];
  let results = [...playstore];

  // validating input: if sort exists, it must be 'rating' or 'app'
  if(sort && !validSorts.includes(sort.toLowerCase())) {
    return res.status(400)
      .json({ message: 'Sort must be by rating or app.'});
  }
  // validating input: if genres exists, it must be one of the values in the validGenres array
  if(genres && !validGenres.includes(genres.toLowerCase())) {
    return res.status(400)
      .json({ message: `Genres must be one of the following: ${validGenres}`});
  }
  
  // if genres is valid, filter the list by the given genre
  if(req.query.genres) {
    results = playstore
      .filter(app => 
        app
          .Genres
          .toLowerCase()
          .includes(genres.toLowerCase()));
  }

  // if sort is valid, sort the list by either rating or app
  if (req.query.sort) {
    // since the properties on sort.App are all capitalized, we need to format the value of sort 
    // (which might be Rating or rating or RaTiNg)
    let formattedInput = sort.charAt(0).toUpperCase() + sort.slice(1).toLowerCase();
    results.sort((a, b) => {
      return a[formattedInput] < b[formattedInput] ? -1 : 1;
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('Express is listening on port 8000');
});