import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Container,
  CssBaseline,
  TextField,
  Button,
  MenuItem,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditIcon from '@mui/icons-material/Edit';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCheckTokenAndRedirect } from "../requests/JWT";

const defaultTheme = createTheme();

const CreateDeck = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [decks, setDecks] = useState([]);
  const [newCourse, setNewCourse] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  //dont touch old stuff just cause more problem

  useCheckTokenAndRedirect();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  // selected courses for category
  const [selectedCategory, setSelectedCategory] = useState("");
  const [coursesForCategory, setCoursesForCategory] = useState([]);

  const [selectedCategoryCreateCourse, setSelectedCategoryCreateCourse] = useState("");

  const handleselectedCategoryCreateCourse = (event) => {
    setSelectedCategoryCreateCourse(event.target.value)
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value)
  }

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

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:4040/api/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const postDeck = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.log("USERNAME NOT IN LOCAL STORAGE WTH DO A REDIRECT IF THIS IS A POSSIBLE SCENARIO")
      return;
    }
    if (isCreatingDeck) {
      return;
    }

    setIsCreatingDeck(true);

    try {
      console.log(name, selectedCategory, selectedCourse, username)
      const response = await fetch("http://localhost:4040/api/add-decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category: selectedCategory,
          course: selectedCourse,
          author: username,
          difficulty : difficulty,
        }),
      });

      if (response.ok) {
        const newDeckData = await response.json();
        addAchievement();
        if (newDeckData && newDeckData.name && newDeckData.category && newDeckData.course) {
          setDecks((prevDecks) => [...prevDecks, newDeckData]);
          setName("");
          setSelectedCategory("");
          setSelectedCourse("");
        } else {
          console.error("Invalid deck data received from the server.");
        }
      } else {
        console.error("Failed to create deck.");
      }
    } catch (error) {
      console.error("Error creating deck:", error);
    } finally {
      setIsCreatingDeck(false);
    }
  };

  const addAchievement = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.log("USERNAME NOT IN LOCAL STORAGE WTH DO A REDIRECT IF THIS IS A POSSIBLE SCENARIO")
    }

    try {
      const response = await fetch("http://localhost:4040/api/add-achievement-to-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          achievement: "Craftsmanship",
          user: username,

        }),
      });

      if (response.ok) {
      } else {
        console.error("Failed to create deck.");
      }
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  }

  //TODO FIX USEEFFECTS
  useEffect(() => {
    Promise.all([fetchCategories(), fetchCourses()])
      .then(([categoriesData, coursesData]) => {
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const fetchDecks = async (username) => {
    try {
      const response = await fetch(`http://localhost:4040/api/personal-decks?author=${username}`);
      if (response.ok) {
        const data = await response.json();
        setDecks(data);
      } else {
        console.error("Failed to fetch decks");
      }
    } catch (error) {
      console.error("Error fetching decks:", error);
    }
  };

  useEffect(() => {
    // Fetch courses for the selected category when it changes
    const fetchCoursesForCategory = async () => {
      try {
        const response = await fetch(`http://localhost:4040/api/categories/${selectedCategory}/courses`);
        if (response.ok) {
          const data = await response.json();
          setCoursesForCategory(data);
        } else {
          console.error("Failed to fetch courses for the selected category");
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (selectedCategory) {
      fetchCoursesForCategory();
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchDecks(username);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleDeleteDeck = (deckId) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this deck?");

    if (confirmDelete) {
      fetch(`http://localhost:4040/api/decks/delete/${deckId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            setDecks((prevDecks) => prevDecks.filter((deck) => deck._id !== deckId));
            console.log("Deck deleted successfully.");
          } else {
            console.error("Failed to delete deck.");
          }
        })
        .catch((error) => {
          console.error("Error deleting deck:", error);
        });
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await fetch("http://localhost:4040/api/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCategory,
        }),
      });

      if (response.ok) {
        const newCategoryData = await response.json();
        if (newCategoryData && newCategoryData.name) {
          setCategories((prevCategories) => [...prevCategories, newCategoryData]);
          setCategory(newCategoryData.name); // Select the newly created category
          setNewCategory(""); // Clear the custom category input
        } else {
          console.error("Invalid category data received from the server.");
        }
      } else {
        console.error("Failed to create category.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleCreateCourse = async () => {
    try {

      if (isCreatingDeck) {
        return;
      }

      const response = await fetch("http://localhost:4040/api/add-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCourse,
          category: selectedCategoryCreateCourse,
        }),
      });

      if (response.ok) {
        const newCourseData = await response.json();
        if (newCourseData && newCourseData.name && newCourseData.category) {
          console.log("Course created successfully.");
          setNewCourse(""); // Clears the input field
          setSelectedCategoryCreateCourse("")
        } else {
          console.error("Invalid course data received from the server.");
        }
      } else {
        console.error("Failed to create course.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setIsCreatingDeck(false); // Set isCreatingDeck to false regardless of success or error idk what is going wrong
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div
              style={{
                marginTop: "8px",
                backgroundColor: "white",
                color: "#1976D2",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>Your Decks</h2>
              <p>
                This is where you can find your already existing decks.
              </p>
              <p>You can add cards to your decks, edit or delete them below.</p>
              <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                {decks.map((deck) => (
                  <ListItem key={deck._id} disableGutters>
                    <ListItemText primary={`${deck.name} - ${deck.category}`} />
                    <ListItemSecondaryAction>
                      <Tooltip title="Play deck">
                        <Link to={`/quizgame/${deck._id}`}>
                          <IconButton edge="end" aria-label="play">
                            <PlayCircleIcon />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Add card">
                        <Link to={`/create-cardv2/${deck._id}`}>
                          <IconButton edge="end" aria-label="add-card">
                            <NoteAddIcon />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <Link to={`/edit`}>
                          <IconButton edge="end" aria-label="edit">
                            <EditIcon />
                          </IconButton>
                        </Link>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteDeck(deck._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div
              style={{
                marginTop: "8px",
                backgroundColor: "white",
                color: "#1976D2",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >



              <form autoComplete="off" onSubmit={handleSubmit}>
                <h2>Create new deck</h2>
                <TextField
                  label="Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  color="primary"
                  type="name"
                  sx={{ mb: 3 }}
                  fullWidth
                  value={name}
                />
                <TextField
                  margin="normal"
                  select
                  fullWidth
                  label="Card category"
                  id="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
                {coursesForCategory.length > 0 && (
                  <TextField
                    margin="normal"
                    select
                    fullWidth
                    label={`Select a course for ${selectedCategory}`}
                    id="course"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                  >
                    {coursesForCategory.map((course) => (
                      <MenuItem key={course._id} value={course.name}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                {selectedCourse && (
                  <TextField
                    margin="normal"
                    select
                    fullWidth
                    label={`Difficulty`}
                    id="difficulty"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                  >
                          {[1, 2, 3, 4, 5].map((level) => (
        <MenuItem key={level} value={level}>
          {level}
        </MenuItem>
      ))}
                    </TextField>
                )}


                    <Button
                      variant="outlined"
                      color="primary"
                      type="submit"
                      fullWidth
                      onClick={postDeck}
                    >
                      Create
                    </Button>









                  </form>
            </div>
            <div
              style={{
                marginTop: "16px",
                backgroundColor: "white",
                color: "#1976D2",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>Create new Course</h2>
              <TextField
                margin="normal"
                select
                fullWidth
                label="Course category"
                id="category"
                value={selectedCategoryCreateCourse}
                onChange={handleselectedCategoryCreateCourse}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Course Name"
                onChange={(e) => setNewCourse(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="name"
                sx={{ mb: 3 }}
                fullWidth
                value={newCourse}
              />
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleCreateCourse}
              >
                Create Course
              </Button>
            </div>








            <div
              style={{
                marginTop: "16px",
                backgroundColor: "white",
                color: "#1976D2",
                padding: "15px",
                borderRadius: "10px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h2>Create new Category</h2>
              <TextField
                label="Category Name"
                onChange={(e) => setNewCategory(e.target.value)}
                required
                variant="outlined"
                color="primary"
                type="name"
                sx={{ mb: 3 }}
                fullWidth
                value={newCategory}
              />
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                onClick={handleCreateCategory}
              >
                Create Category
              </Button>
            </div>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default CreateDeck;
