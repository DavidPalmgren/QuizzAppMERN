import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const QuestionCard = ({ card, onAnswerClick, answerStatus, resetAnswerStatus }) => {
  const [timeoutActive, setTimeoutActive] = useState(false);

  useEffect(() => {
    if (timeoutActive) {
      // Reset the answerStatus array after the timeout this occasionally fucked stuff but is working now
      const timeoutId = setTimeout(() => {
        setTimeoutActive(false);
        resetAnswerStatus();
      }, 1000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [timeoutActive, resetAnswerStatus]);

  return (
    <Card>
      <CardContent>
      <CardContent className='question-card'>
        <Typography variant="h5" className='center-text'>{card.question}</Typography>
        </CardContent>
        <Grid container spacing={2}>
          {card.answers.map((answer, index) => (
            <Grid item key={index} xs={6}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => {
                  if (!timeoutActive) {
                    onAnswerClick(answer.isCorrect);
                    setTimeoutActive(true);
                  }
                }}
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
    </Card>
  );
};

export default QuestionCard;
