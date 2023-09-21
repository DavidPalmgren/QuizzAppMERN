import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Categories() {
  const [categories, setCategories] = useState([]);

  const fetchDecks = async () => {
    try {
      const response = await fetch('http://localhost:4040/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
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
        Browse categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Link to={`/decks/${category.name}`} className="category-link">
              <Paper elevation={3} className="category-box">
                <Typography variant="h5">{category.name}</Typography>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  ); 
}

export default Categories;
