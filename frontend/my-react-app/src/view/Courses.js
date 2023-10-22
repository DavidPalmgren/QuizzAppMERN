import React, { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';


function Categories() {
  const { categoryName, courseName } = useParams();
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`http://localhost:4040/api/categories/${categoryName}/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error("Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  useEffect(() => {
    fetchCourses();
  }, [categoryName]);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Browse courses in category: {categoryName}
      </Typography>
      <Grid container spacing={2}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
  <Link to={`/categories/${categoryName}/${course.name}`} className="category-link">
    <Paper elevation={3} className="category-box">
      <Tooltip title={course.name} placement="top">
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
            textOverflow: 'ellipsis',
          }}
        >
          {course.name}
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
