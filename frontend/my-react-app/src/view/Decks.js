import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, Grid, Paper } from '@mui/material';

import DeckRating from '../components/DeckRating';

const ProdUrl = 'https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards';
const LocalUrl = 'https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards';

function Decks() {
  const [decks, setDecks] = useState([]);
  const { categoryName, courseName } = useParams();

  const fetchDecks = async () => {
    try {
      const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/decks/${categoryName}/${courseName}`);
      if (response.ok) {
        const data = await response.json();
        setDecks(data);
        console.log(data)
      } else {
        console.error("Failed to fetch decks");
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  }

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Browse decks from {categoryName} / {courseName}
      </Typography>
      <Grid container spacing={2}>
        {decks.map((deck) => (
          <Grid item xs={12} sm={6} md={4} key={deck._id}>
            <Link to={`/quizgame/${deck._id}`} className="category-link">
            <Paper elevation={3} className="category-box">
              <Typography variant="h5" align="center">{deck.name}</Typography>
              <Typography variant="body2" align="center">Author: {deck.author}</Typography>
              <Typography variant="body2" align="center">Rating: {deck.averageRating ? deck.averageRating.toFixed(1) : '0'}</Typography>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'bottom' }}>
              <DeckRating rating={deck.averageRating || 0} />
              </div>
            </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Decks;
