const fs = require('fs');
const express = require('express');

// TODO only in development
const cors = require('cors');
const rawdata = fs.readFileSync('test_data/test_data.json');
const ingredients = JSON.parse(rawdata);
console.log('Finished reading test file');

const corsOptions = cors({
  origin: 'http://localhost:3000', // whitelist localhost:3000 (dev server)
  optionsSuccessStatus: 200,
});

function findRecipes(query) {
  const result = ingredients.find(ingredient => ingredient['ingredients'] === query);
  return result ? result['recipes'] : 'Not found';
}

const app = express();

app.get('/', corsOptions, (req, res) => {
  const query = req.query.query;

  if (query === undefined) {
    res.send('Ready for query');
  } else {
    res.send(findRecipes(query));
  }

});

app.listen('8080');