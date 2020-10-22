import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.scss';

function App() {

  const [data, setData] = useState<string[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:8080/?query=escargot')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        setData([]);
      });
  }, [])

  return (
    <div className="App">
      <h1>Hello World</h1>
      <p>[{ data.join(', ') }]</p>
    </div>
  );
}

export default App;
