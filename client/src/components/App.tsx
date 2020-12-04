import React, { useState } from 'react';
import axios from 'axios';
import { InputChangeEventHandler, MouseEventHandler } from '../types';

import './App.scss';

function App() {

  const [query, setQuery] = useState<string>('zucchini, apple, carrots');
  const [unmatches, setUnmatches] = useState<string[]>([]); // ingredients from user query that we did not find recipes for
  const [results, setResults] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleInputChange: InputChangeEventHandler = (event) => {
    setQuery(event.target.value);
  }

  const handleSubmit: MouseEventHandler = () => {

    if (query.length === 0) return;

    axios.get(`http://localhost:8080/ingredients?query=${sanitizeQuery(query)}`)
      .then(response => {
        console.log(response.data);
        setHasSearched(true);
        setUnmatches(response.data.unmatched_ingredients);
        setResults(response.data.common_recipes);
      })
      .catch(error => {
        console.error(error);
        setResults(['None found']);
      });
  }

  // TODO: create an input with typeahead
  return (
    <>
      <h1>Ingredientory</h1>
      <input type='text' value={query} onChange={handleInputChange}></input>
      <button type='button' onClick={handleSubmit}>Submit</button>
      { hasSearched &&
        (results.length > 0 ?
          <>
          <h3>Results: {unmatches?.length > 0 && `(No matches found for ${unmatches.map(x => `"${x}"`).join(', ')})`}</h3>
            <ul>{results.map((item) => <li key={item}>{item}</li>)}</ul>
          </>
          :
          <h3>No results found</h3>
        )
      }
    </>
  );
}

function sanitizeQuery(query: string): string {
  return query
    .replace(/(?: *[,]+ *)+/g, ';') // matches comma or commas and spaces around them, then replace with semi colon 
    .replace(/ {2,}/g, ' '); // matches series or two or more spaces, then replace with one space
}

export default App;
