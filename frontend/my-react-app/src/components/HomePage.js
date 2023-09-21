import React, { useState, useEffect } from 'react';

const ProdUrl = 'https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards';
const LocalUrl = 'http://localhost:4040/api/cards'

function HomePage() {
  const [decks, setDecks] = useState([]);

  const fetchDecks = async () => {
    try {
      const response = await fetch('http://localhost:4040/api/decks')
      if (response.ok) {
        const data = await response.json();
        setDecks(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <div className="centerA">
      <h1>Welcome to My Landing Page</h1>
      <ul>
        {decks.map((deck) => (
          <li key={deck._id} value={deck.name}>{deck.name} {deck.category}</li>
        ))}

      </ul>
    </div>
  );
}

export default HomePage;
