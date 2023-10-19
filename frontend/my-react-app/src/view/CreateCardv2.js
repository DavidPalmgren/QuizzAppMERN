import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useCheckTokenAndRedirect } from "../requests/JWT";

const defaultTheme = createTheme();

const CreateCard = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [decks, setDecks] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const { deckId } = useParams();


  useCheckTokenAndRedirect();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  const fetchDecks = async () => {
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
    fetchDecks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("question", question);

    for (let i = 0; i < 4; i++) {
      formData.append(`answers[]`, answers[i]);
    }

    formData.append("correctAnswerIndex", correctAnswerIndex);
    formData.append("deckId", selectedDeckId);
    formData.append("isMultipleChoice", isMultipleChoice);

    if (imageFile !== null) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch(`http://localhost:4040/api/add-card/${selectedDeckId}`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("New card added");
        setAnswers(["", "", "", ""]);
        setImageFile(null);
        setQuestion("");
      } else {
        console.log("Something went wrong with adding card");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "white",
            padding: "15px",
            borderRadius: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <NoteAddIcon />
          </Avatar>
          <Typography component="h1" variant="h5" color="primary">
            Add a flashcard
          </Typography>
          <form
            onSubmit={handleSubmit}
            style={{ width: "100%", marginTop: "16px" }}
          >
          <FormControlLabel
            control={
              <Checkbox
                checked={isMultipleChoice}
                onChange={() => setIsMultipleChoice(!isMultipleChoice)}
                color="primary"
                
              />
            }
            label="Multiple Choice"
            style={{ color: 'grey' }}
          />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Card question"
              type="text"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            {isMultipleChoice
              ? [0, 1, 2, 3].map((index) => (
                  <TextField
                    key={index}
                    margin="normal"
                    required
                    fullWidth
                    label={`Card answer ${index + 1}`}
                    type="text"
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  />
                ))
              : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Card answer"
                  type="text"
                  value={answers[0]} // Assuming only one answer in single-choice mode
                  onChange={(e) => handleAnswerChange(0, e.target.value)}
                />
              )}
            {isMultipleChoice && (
              <TextField
                margin="normal"
                select
                fullWidth
                label="Correct Answer"
                id="correctAnswerIndex"
                value={correctAnswerIndex}
                onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
              >
                {[0, 1, 2, 3].map((index) => (
                  <MenuItem key={index} value={index}>
                    Answer {index + 1}
                  </MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              margin="normal"
              select
              fullWidth
              label="Select Deck"
              id="deck"
              value={selectedDeckId}
              onChange={(e) => setSelectedDeckId(e.target.value)}
            >
              {decks.map((deck) => (
                <MenuItem key={deck._id} value={deck._id}>
                  {deck.name}
                </MenuItem>
              ))}
            </TextField>
            <label style={{ color: "#ccc" }}>Upload Image (optional):</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Card
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
              };  

export default CreateCard;
