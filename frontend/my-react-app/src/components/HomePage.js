import React, { useState, useEffect } from 'react';

const ProdUrl = 'https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards';
const LocalUrl = 'http://localhost:4040/api/cards'

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(LocalUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('API Response:', data);
        setCards(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="centerA">
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
