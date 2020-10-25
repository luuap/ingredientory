const fs = require('fs');
const express = require('express');

const Ingredient = require('../models/Ingredient');
const ingredientsRoute = express.Router();

ingredientsRoute.get('/', async (req, res) => {
  const query = req.query.query.split(';');

  if (query === undefined) {
    res.send('Ready for query');
  } else {
    const result = await Ingredient.aggregate([
      { $match: { name: { $in: query } } }, // filter the ingredients
      {
        $group: { // separate the first result, group the rest (this is done in preparation for the $project stage)
          _id: 0,
          recipes: { $push: '$recipes' },
          initial: { $first: '$recipes' },
        }
      },
      {
        $project: {
          common_recipes: {
            $reduce: { // reduce funcction that takes intersection of recipes
              input: '$recipes',
              initialValue: '$initial',
              in: { $setIntersection: ['$$value', '$$this'] } 
            }
          }
        }
      }
    ]);

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