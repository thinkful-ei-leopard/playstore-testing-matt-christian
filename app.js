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


  if(sort && !validSorts.includes(sort.toLowerCase())) {
    return res.status(400)
      .json({ message: 'Sort must be by rating or app.'});
  }
  

  if(genres && !validGenres.includes(genres.toLowerCase())) {
    return res.status(400)
      .json({ message: `Genres must be one of the following: ${validGenres}`});
  }
  

  if(req.query.genres) {
    results = playstore
      .filter(app => 
        app
          .Genres
          .toLowerCase()
          .includes(genres.toLowerCase()));
  }

  if (req.query.sort) {
    let formattedInput = sort.charAt(0).toUpperCase() + sort.slice(1);
    results.sort((a, b) => {
      return a[formattedInput] < b[formattedInput] ? -1 : 1;
    });
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log('Express is listening on port 8000');
});