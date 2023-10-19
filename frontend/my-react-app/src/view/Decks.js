import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Container, Grid, Paper, Button, Card, CardContent } from '@mui/material';

import DeckRating from '../components/DeckRating';

const ProdUrl = 'http://localhost:4040/api/cards';
const LocalUrl = 'http://localhost:4040/api/cards';

function Decks() {
  const [decks, setDecks] = useState([]);
  const { categoryName, courseName } = useParams();

  const fetchDecks = async () => {
    try {
      const response = await fetch(`http://localhost:4040/api/decks/${categoryName}/${courseName}`);
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1:
        return 'green'; // Rating 1: Green
      case 2:
        return 'yellow'; // Rating 2: Yellow
      case 3:
        return 'orange'; // Rating 3: Orange
      case 4:
        return 'darkorange'; // Rating 4: Dark Orange
      case 5:
        return 'red'; // Rating 5: Red
      default:
        return 'green'; // Default to gray
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Browse decks from {categoryName} / {courseName}
      </Typography>
      <Grid container spacing={3}>
        {decks.map((deck) => (
          <Grid item xs={12} sm={6} md={4} key={deck._id}>
            <Card sx={{ minHeight: '100%' }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="h6">{deck.name}</Typography>
                    <Typography variant="body2">
                      <span className="bold-text">Category: </span>
                      {deck.category || "Unknown"}
                    </Typography>
                    <Typography variant="body2">
                      <span className="bold-text">Course: </span>
                      {deck.course || "Unknown"}
                    </Typography>
                    <Typography variant="body2">
                      <span className="bold-text">Cards: </span>
                      {deck.cards && deck.cards.length > 0 ? deck.cards.length : '0'}
                    </Typography>
                    <Typography variant="body2">
                      <span className="bold-text">Author: </span>
                      {deck.author ? <Link to={`/user/${deck.author}`}>{deck.author}</Link> : "Anonymous"}
                    </Typography>
                  </div>
                  <div style={{ textAlign: 'left', marginLeft: 'auto', position: 'relative' }}>
                    <div
                      style={{
                        color: getDifficultyColor(deck.difficulty),
                        border: `2px solid ${getDifficultyColor(deck.difficulty)}`,
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.5rem',
                      }}
                    >

                      {deck.difficulty || "1"}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  component={Link} to={`/quizgame/${deck._id}`}
                >
                  Play
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Decks;