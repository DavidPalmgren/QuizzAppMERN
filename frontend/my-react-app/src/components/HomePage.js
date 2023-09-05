import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards');
        console.log('API Response:', response.data); // Log the response data
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Welcome to My Landing Page</h1>
      <ul>
        {cards.length === 0 ? <li>No cards available</li> : cards.map((card) => (
          <li key={card._id}>{card.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomePage;
