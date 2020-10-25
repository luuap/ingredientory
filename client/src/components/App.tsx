import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import './App.scss';

function App() {

  const [query, setQuery] = useState<string>('zucchini;apple;carrots');
  const [data, setData] = useState<string[]>([]);

  function handleInputChange(event: any): void {
    setQuery(event.target.value);
  }

  function handleSubmit(event: any): void {
    axios.get(`http://localhost:8080/ingredients?query=${query}`)
      .then(response => {
        console.log(response.data);
        setData(response.data[0].common_recipes); // TODO: return object instead of array of objects
      })
      .catch(error => {
        setData(['None found']);
      });
  }

  // TODO: create an input with typeahead
  return (
    <>
      <h1>Ingredientory</h1>
      <input type='text' value={ query } onChange={ handleInputChange }></input>
      <button type='button' onClick={ handleSubmit }>Submit</button>
      <ul>{ data.map((item) => <li key={ uuid() }>{ item }</li>) }</ul>
    </>
  );
}

export default App;
