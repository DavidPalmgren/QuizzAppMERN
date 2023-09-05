import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios.get('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards')
      .then((response) => {
        console.log('API Response:', response.data); // Log the response data
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
        {cards.length === 0 ? (
          <li>No cards available</li>
        ) : (
          createListItems(cards)
        )}
      </ul>
    </div>
  );
}

// Function to create list items
function createListItems(cards) {
  const listItems = [];
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    listItems.push(
      <li key={card._id}>{card.name}</li>
    );
  }
  return listItems;
}

export default HomePage;
