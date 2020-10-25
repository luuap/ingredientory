import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';

import './App.scss';

function App() {

  const [data, setData] = useState<string[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:8080/ingredients?query=escargot')
      .then(response => {
        console.log(response.data);
        setData(response.data.recipes);
      })
      .catch(error => {
        setData([]);
      });
  }, [])

  return (
    <div className="App">
      <h1>Hello World</h1>
      <ul>{ data.map((item) => <li key={uuid()}>{ item }</li>) }</ul>
    </div>
  );
}

export default App;
