import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('http://your-api-server-url/') // Replace with your API server URL
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="App">
      {/* Render your data here */}
      <ul>
        {cards.map((card) => (
          <li key={card._id}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
