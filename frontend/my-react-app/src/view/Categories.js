import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';


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
<Box
  sx={{
    backgroundColor: '#F44336',
    color: 'white',
    padding: '1rem',
    borderRadius: '12px',
    textAlign: 'center',
    margin: '1rem 0',
  }}
>
  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
    Tired of looking? Try our improved search feature for quicker browsing!
  </Typography>
</Box>


      <Typography variant="h4" align="center" gutterBottom>
        Browse categories
      </Typography>
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Link to={`/categories/${category.name}`} className="category-link">
              <Paper elevation={3} className="category-box">
                <Tooltip title={category.name} placement="top">
                  <Typography
                    variant="h3"
                    align="center"
                    color="primary"
                    style={{
                      margin: '0 auto',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis', //shoddy solution
                    }}
                  >
                    {category.name}
                  </Typography>
                </Tooltip>
              </Paper>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Categories;
