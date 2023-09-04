// src/components/HomePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4040/api/cards') // Assuming your Express API serves at '/api/cards'
      .then((response) => {
        setCards(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to My Landing Page</h1>
      <ul>
        {cards.map((card) => (
          <li key={card._id}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
