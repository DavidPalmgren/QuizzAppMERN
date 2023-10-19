import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Paper } from '@mui/material';
import { Star, StarHalf, StarOutline } from '@mui/icons-material';
import MasteryRating from './MasteryRating';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';


const QuestionCard = ({ card, onAnswerClick, answerStatus, resetAnswerStatus, score, cards, userProgress, onExactAnswerClick }) => {
  const [timeoutActive, setTimeoutActive] = useState(false);
  const [imageUrl, setImageUrl] = useState("");


  useEffect(() => {
    if (timeoutActive) {
      // Reset the answerStatus array after the timeout this occasionally messed up stuff but is working now
      const timeoutId = setTimeout(() => {
        setTimeoutActive(false);
        resetAnswerStatus();
      }, 1000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [timeoutActive, resetAnswerStatus]);

  useEffect(() => {
    if (card.image) {
        setImageUrl(`url("http://localhost:4040/uploads/${card.image.filename}")`);
    } else {
        setImageUrl(""); // clear the image URL when there's no image
    }
}, [card.image]);

  const currentUserMasteryRating = userProgress.find((progressItem) => progressItem.cardId === card._id)?.masteryRating;

  const handleAnswerClick = (isCorrect, answerText) => {
    if (!timeoutActive) {
      onExactAnswerClick(isCorrect);
      setTimeoutActive(true);

      if (isCorrect) {
        toast.success(`Correct! The answer is: ${answerText}`, { autoClose: 2000 });
      } else {
        toast.error(`Incorrect! The answer is: ${answerText}`, { autoClose: 2000 });
      }
    }
  };

  const textStyle = css`
  position: relative;
  z-index: 1;
  transition: color 0.3s, background 0.3s;
  color: white;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 8px;

  &:hover {
    background: transparent;
    color: transparent;
  }
`;

const cardContentStyle = css`
  display: flex;
  flexDirection: column;
  alignItems: center;
  justifyContent: center;
  textAlign: center;
  padding: 16px;
  border-radius: 8px;
  position: relative;
  background-image: ${imageUrl};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const starStyle = {
  position: 'absolute',
  top: '8px',
  left: '8px',
};

return (
  <Card>
      <ToastContainer position="top-center" />
      <CardContent>
          {imageUrl ? (
              <CardContent className="question-card" css={cardContentStyle}>
                  <MasteryRating rating={currentUserMasteryRating} style={starStyle} />
                  <Typography variant="h5" className='top-text'>
                      <p css={textStyle}>
                          {card.question}
                      </p>
                  </Typography>
              </CardContent>
          ) : (
              <CardContent className='question-card'>
                  <MasteryRating rating={currentUserMasteryRating || 0} />
                  <Typography variant="h5" className='center-text'>
                      {card.question}
                  </Typography>
              </CardContent>
          )}
          <Grid container spacing={2}>
              {card.answers.map((answer, index) => (
                  <Grid item key={index} xs={6}>
                      <Button
                          variant="outlined"
                          fullWidth
                          onClick={() => handleAnswerClick(answer.isCorrect, answer.text)}
                          style={{
                              border: '2px solid',
                              borderColor:
                                  answerStatus[index] === 'correct'
                                      ? 'green'
                                      : answerStatus[index] === 'wrong'
                                          ? 'red'
                                          : 'grey',
                          }}
                      >
                          {answer.text}
                      </Button>
                  </Grid>
              ))}
          </Grid>
      </CardContent>
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
          <Typography variant="h6" gutterBottom>
              Score: {score} / {cards.length}
          </Typography>
      </Paper>
  </Card>
);
                        };

export default QuestionCard;
