import fs from 'fs';
import express from 'express';

import { Ingredient } from '../models/Ingredient';

export const ingredientsRoute = express.Router();

ingredientsRoute.get('/', async (req, res) => {
  const query = (req.query.query as string)?.split(';');

  if (query === undefined) {
    res.send('Ready for query');
  } else {

    const result = await Ingredient.aggregate([
      { $match: { name: { $in: query } } }, // filter the ingredients TODO: find a way to get unmatched queries
      {
        $group: { // separate the first result, group the rest (this is done in preparation for the $project stage)
          _id: 0,
          recipes: { $push: '$recipes' }, // Note: recipes is a field in the documents returned by the previous stage 
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

    if (result.length === 0) {
      res.send({ _id: 0, common_recipes: [] })
    }

    res.send(result[0]); // Note: aggregate function returns array of results, return only the first result
  }

});

export function initIngredients() {
  const rawData = fs.readFileSync('./test_data/test_data.json');
  const ingredients = JSON.parse(rawData.toString());
  Ingredient.insertMany(
    ingredients,
    () => console.log('DB seeded with ingredients')
  );
}
