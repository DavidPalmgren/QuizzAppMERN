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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// found this cool toast library for react im not sure if im gonna go through everything and add it to all creation etc

const defaultTheme = createTheme();

const CreateCard = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [selectedCard, setSelectedCard] = useState("");

  const [decks, setDecks] = useState([]);
  const [cards, setCards] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

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

  const fetchCards = async () => {
    try {
      const response = await fetch(`http://localhost:4040/api/decks/${selectedDeckId}/cards`);
      if (response.ok) {
        const data = await response.json();
        setCards(data);
        console.log(data);
      } else {
        console.error("Couldn't fetch cards in that deck");
      }
    } catch (error) {
      console.error("Error fetching cards", error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [selectedDeckId]);

  useEffect(() => {
    if (selectedCard) {
      const selectedCardData = cards.find((card) => card._id === selectedCard);
      if (selectedCardData) {
        setQuestion(selectedCardData.question);
        if (isMultipleChoice) {
          // problems with saving values and dispalying this is a measure to avoid showing object while keeping the same dumb structure i had before.
          const answerTexts = Array(4).fill('');
          
          // Update the text values for existing answers
          selectedCardData.answers.forEach((answer, index) => {
            answerTexts[index] = answer.text;
          });
  
          setAnswers(answerTexts);
          setCorrectAnswerIndex(selectedCardData.correctAnswerIndex);
        } else {
          // fOr single-choice mode
          const singleAnswer = selectedCardData.answers[0].text;
          const singleChoiceAnswers = [singleAnswer, '', '', ''];
  
          setAnswers(singleChoiceAnswers);
          setCorrectAnswerIndex(0);
        }
      }
    }
  }, [selectedCard, cards]);
  
  
  
  
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    logFormData();
  

    const updatedCard = {
      question,
      isMultipleChoice,
      answers,
      correctAnswerIndex,
    };
  
    try {
      const response = await fetch(`http://localhost:4040/api/update-card/${selectedDeckId}/${selectedCard}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCard),
      });
  
      if (response.ok) {
        console.log('Card updated successfully');
        fetchCards()
        toast.success('Card updated successfully', {
            position: 'top-center',
            autoClose: 3000, //3s
          });
      } else {
        console.error('Failed to update card');
        toast.error('Failed to update card', {
            position: 'top-center',
            autoClose: 3000,
          });
      }
    } catch (error) {
        console.error('Error updating card:', error);

  toast.error('Error updating card', {
    position: 'top-center',
    autoClose: 3000,
  });
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const logFormData = () => {
    console.log("Submitted Form Data:");
    console.log("Question:", question);
    console.log("Answers:", answers);
    if (correctAnswerIndex === undefined) {
        setCorrectAnswerIndex(0)


    }
    console.log("Correct Answer Index:", correctAnswerIndex);
    console.log("Selected Deck ID:", selectedDeckId);
    console.log("Is Multiple Choice:", isMultipleChoice);
    console.log("Image File:", imageFile);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
        <ToastContainer />
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            backgroundColor: "white",
            borderRadius: "10px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <aside style={{ width: "300px", padding: "15px" }}>
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
            <TextField
              margin="normal"
              select
              fullWidth
              label="Select Card"
              id="card"
              value={selectedCard}
              onChange={(e) => setSelectedCard(e.target.value)}
            >
              {cards.map((card, index) => (
                <MenuItem key={card._id} value={card._id}>
                  {index + 1} {card.question}
                </MenuItem>
              ))}
            </TextField>
          </aside>
          <div style={{ flex: 1, padding: "15px" }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <NoteAddIcon />
            </Avatar>
            <Typography component="h1" variant="h5" color="primary">
              Edit flashcard
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isMultipleChoice}
                    onChange={() => setIsMultipleChoice(!isMultipleChoice)}
                    color="primary"
                  />
                }
                label="Multiple Choice"
                style={{ color: "grey" }}
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
      value={answers[0]}
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
              <label style={{ color: "#ccc" }}>Upload Image (optional):</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Edit Card
              </Button>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                DELETE
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default CreateCard;
