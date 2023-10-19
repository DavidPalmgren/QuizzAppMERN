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
  MenuItem,
  Select,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { returnTopRated } from '../requests/helpers.js';
import DeckRating from '../components/DeckRating';

function Search() {
  const [results, setResults] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [coursesForCategory, setCoursesForCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredData, setFilteredData] = useState([]);


  const { search } = useParams();

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:4040/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch(`http://localhost:4040/api/search?search=${search}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const result = await response.json();
        console.log("res:", result)
        setResults(result)

      } else {
        console.error('Login failed:', response.status);
        // show failure message TODO
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // show error message TODO
    }
  };
  
  const fetchCoursesForCategory = async (category) => {
    try {
      if (category) {
        const response = await fetch(`http://localhost:4040/api/categories/${category}/courses`);
        if (response.ok) {
          const data = await response.json();
          setCoursesForCategory(data);
          console.log('course for cat: ', data);
        } else {
          console.error("Failed to fetch courses for the selected category");
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  

  useEffect(() => {
    fetchCoursesForCategory(selectedCategory);
  }, [selectedCategory]);


  useEffect(() => {
    fetchData()
  },[search])

  const filterData = () => {
    let filteredResults = results.decks; // Start with all results

    // Apply filters
    if (selectedDifficulty !== '') {
      if (selectedDifficulty === 1) {
        //
      } else {
        filteredResults = filteredResults.filter(
          (deck) => deck.difficulty === parseInt(selectedDifficulty)
        );
      }

    }

    if (selectedCourse !== '') {
      filteredResults = filteredResults.filter(
        (deck) => deck.course === selectedCourse
      );
    }

    if (selectedCategory !== '') {
      filteredResults = filteredResults.filter(
        (deck) => deck.category === selectedCategory
      );
    }

    setFilteredData(filteredResults);
  };

  useEffect(() => {
    filterData(); // frontend filter very pog and moist
  }, [selectedDifficulty, selectedCourse, selectedCategory, results]);

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

  const resetFilters = () => {
    setSelectedDifficulty('');
    setSelectedCourse('');
    setSelectedCategory('');
  };


//my js formater broke and now all fucking hell is loose enjoy
  return (
    <div>




      <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ mt: 3, backgroundColor: '#f5f5f5', padding: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Select
              label="Difficulty"
              fullWidth
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <MenuItem value={1}>Difficulty 1</MenuItem>
              <MenuItem value={2}>Difficulty 2</MenuItem>
              <MenuItem value={3}>Difficulty 3</MenuItem>
              <MenuItem value={4}>Difficulty 4</MenuItem>
              <MenuItem value={5}>Difficulty 5</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              label="Category"
              fullWidth
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.name}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Select
              label="Course"
              fullWidth
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <MenuItem value="">All Courses</MenuItem>
              {coursesForCategory.length > 0 ? (
                coursesForCategory.map((course) => (
                  <MenuItem key={course.id} value={course.name}>
                    {course.name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No courses for category</MenuItem>
              )}
            </Select>
          </Grid>
        </Grid>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
      </Paper>
        <Card style={{marginTop: "10px", marginBottom: "10px"}}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', margin: 'auto', border: '#1976D2 2px solid' }}>
          Search: { search }
        </Typography>
        </Card>

        <Grid container spacing={3}>
  {filteredData && filteredData.length > 0 ? (
    filteredData.map((deck) => (
      <Grid item xs={12} sm={6} md={4} key={deck._id}>
        <Card sx={{ minHeight: '100%' }}>
          <CardContent>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
            <Typography variant="h6" sx={{ fontWeight: 'normal', color: (deck.name && search.toLowerCase() === deck.name.toLowerCase()) ? 'green' : 'black' }}>
              {deck.name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: (deck.category && search.toLowerCase() === deck.category.toLowerCase()) ? 'green' : 'black' }}>
              <DeckRating rating={deck.averageRating || 0} />
              <span className="bold-text">Category: </span>
              {deck.category || "Unknown"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: (deck.course && search.toLowerCase() === deck.course.toLowerCase()) ? 'green' : 'black' }}>
              <span className="bold-text">Course: </span>
              {deck.course || "Unknown"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'black' }}>
              <span className="bold-text">Cards: </span>
              {deck.cards && deck.cards.length > 0 ? deck.cards.length : '0'}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 'normal', color: (deck.author && search.toLowerCase() === deck.author.toLowerCase()) ? 'green' : 'black' }}>
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
    ))
  ) : (
    <p>No decks found.</p>
  )}
</Grid>

<Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
  Category Results
</Typography>
<Grid container spacing={3}>
  {results && results.categories?.length > 0 ? (
    results.categories.map((category) => (
      <Grid item xs={12} sm={6} md={4} key={category._id}>
        <Card sx={{ minHeight: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'normal', color: (category.name && search.toLowerCase() === category.name.toLowerCase()) ? 'green' : 'black' }}>
              {category.name}
            </Typography>

            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              component={Link} to={`/categories/${category.name}`}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))
  ) : (
    <p>No categories found.</p>
  )}
</Grid>

<Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
  Course Results
</Typography>
<Grid container spacing={3}>
  {results && results.courses?.length > 0 ? (
    results.courses.map((course) => (
      <Grid item xs={12} sm={6} md={4} key={course._id}>
        <Card sx={{ minHeight: '100%' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'normal', color: (course.name && search.toLowerCase() === course.name.toLowerCase()) ? 'green' : 'black' }}>
              {course.name}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              component={Link} to={`/categories/${course.category}/${course.name}`}
            >
              Explore
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))
  ) : (
    <p>No courses found.</p>
  )}
</Grid>

      </Container>
    </div>
  );
}

export default Search;
