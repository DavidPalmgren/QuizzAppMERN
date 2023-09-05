import React, { useState, useEffect } from 'react';

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data); // Log the response data
        setCards(data);
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
