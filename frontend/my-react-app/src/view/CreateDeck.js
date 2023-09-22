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
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCheckTokenAndRedirect } from "../requests/JWT";

const defaultTheme = createTheme();

const CreateDeck = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [decks, setDecks] = useState([]);

  useCheckTokenAndRedirect();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const fetchCategories = async () => {
    try {
      const response = await fetch("https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/categories");
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

  const postDeck = async () => {
    const username = localStorage.getItem('username');
    if (!username) {
      console.log("USERNAME NOT IN LOCAL STORAGE WTH DO A REDIRECT IF THIS IS A POSSIBLE SCENARIO")
    }

    try {
      const response = await fetch("https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/add-decks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          username: username,
        }),
      });
  
      if (response.ok) {
        const newDeckData = await response.json();
        if (newDeckData && newDeckData.name && newDeckData.category) {
          setDecks((prevDecks) => [...prevDecks, newDeckData]);
          setName("");
          setCategory("");
          setCustomCategory("");
        } else {
          console.error("Invalid deck data received from the server.");
        }
      } else {
        console.error("Failed to create deck.");
      }
    } catch (error) {
      console.error("Error creating deck:", error);
    }
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchDecks = async (username) => {
    try {
      const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/personal-decks?author=${username}`);
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
    fetchDecks(username);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  const handleDeleteDeck = (deckId) => {

    const confirmDelete = window.confirm("Are you sure you want to delete this deck?");
    
    if (confirmDelete) {
      fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/decks/delete/${deckId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            // Deck deleted successfully, update the state to reflect the change
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
                <p>

                You can add cards to your decks, edit or delete them below.
              </p>
              <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
                {decks.map((deck) => (
                  <ListItem key={deck._id} disableGutters>
                    <ListItemText primary={`${deck.name} - ${deck.category}`} />
                    <ListItemSecondaryAction>
                    <Tooltip title="Play deck">
                    <Link to={`/quizgame/${deck._id}`}>
                        <IconButton
                          edge="end"
                          aria-label="add-card"
                        >
                          <PlayCircleIcon />
                        </IconButton>
                      </Link>
                      </Tooltip>
                      <Tooltip title="Add card">
                      <Link to={`/create-cardv2/${deck._id}`}>
                        <IconButton
                          edge="end"
                          aria-label="add-card"
                        >
                          <NoteAddIcon />
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
          {/* Form */}
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
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                  <MenuItem value="custom">(+) Add Category</MenuItem>
                </TextField>
                {category === "custom" && (
                  <TextField
                    margin="normal"
                    fullWidth
                    label="Custom Category"
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
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
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default CreateDeck;
