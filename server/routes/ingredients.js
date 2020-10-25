const fs = require('fs');
const express = require('express');

const Ingredient = require('../models/Ingredient');
const ingredientsRoute = express.Router();

ingredientsRoute.get('/', async (req, res) => {
  const query = req.query.query;

  if (query === undefined) {
    res.send('Ready for query');
  } else {
    const result = await Ingredient.findOne({ name: query });
    res.send(result);
  }

});

function initIngredients() {
  const rawData = fs.readFileSync('test_data/test_data.json');
  const ingredients = JSON.parse(rawData);
  Ingredient.insertMany(
    ingredients,
    () => console.log('DB seeded with ingredients')
  );
}

module.exports = {
  ingredientsRoute,
  initIngredients,
};

// function findRecipes(query) {
//   const result = ingredients.find(ingredient => ingredient['ingredients'] === query);
//   return result ? result['recipes'] : 'Not found';
// }