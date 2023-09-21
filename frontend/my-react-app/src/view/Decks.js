import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, Grid, Paper } from '@mui/material';

const ProdUrl = 'https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/cards';
const LocalUrl = 'http://localhost:4040/api/cards';

function Decks() {
  const [decks, setDecks] = useState([]);
  const { categoryName } = useParams();

  const fetchDecks = async () => {
    try {
      const response = await fetch(`http://localhost:4040/api/decks/${categoryName}`);
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
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Browse decks from {categoryName}
      </Typography>
      <Grid container spacing={2}>
        {decks.map((deck) => (
          <Grid item xs={12} sm={6} md={4} key={deck._id}>
            <Link to={`/quizgame/${deck._id}`} className="category-link">
            <Paper elevation={3} className="category-box">
              <Typography variant="h5">{deck.name}</Typography>
              <Typography variant="body2">{deck.category}</Typography>
            </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Decks;
