import React, { useState, useEffect } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { returnTopRated } from '../requests/helpers.js';
import DeckRating from '../components/DeckRating';

function HomePage() {
  const [decks, setDecks] = useState([])


  async function fetchData() {
    try {
      const newdecks = await returnTopRated(1,3)
      console.log("data from homepage:", newdecks)
      setDecks(newdecks)
    } catch (error) {
      console.error("failure getting top rated decks", error)
    }
  }

  useEffect(() => {
    fetchData()
  },[])

  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: '#673AB7',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Discover the Power of Knowledge
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Join us to explore a world of learning and growth.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link} to="/sign-up"
        >
          Get Started
        </Button>
      </Box>

      {/* Call to Action */}
      <Box
        sx={{
          backgroundColor: '#F44336',
          color: 'white',
          padding: '3rem 0',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Ready to Elevate Your Skills?
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, mb: 3 }}>
          Explore our courses and unlock your potential.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link} to="/categories"
        >
          Browse Courses
        </Button>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
          Featured Decks
        </Typography>
        <Grid container spacing={3}>
          {/* You can map through featured courses and display them here */}
          {decks.map((deck) => (

          
          <Grid item xs={12} sm={6} md={4} key={deck._id}>
            <Card sx={{ minHeight: '100%' }}>
              <CardContent>
                {/* Course details here */}
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {deck.name}
                </Typography>
                <Typography variant="body2">
                  <DeckRating rating={deck.averageRating || 0} />
                  Author: {deck.author ? <Link to={`/user/${deck.author}`}>{deck.author}</Link> : "Anonymous"}
                </Typography>
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
    </div>
  );
}

export default HomePage;
