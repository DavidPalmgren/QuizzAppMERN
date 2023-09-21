import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

const LearningMode = ({ card, onNextCard }) => {
    const [showAnswer, setAnswer] = useState(false);
    const getCorrect = () => {
        return card.answers.findIndex((answer) => answer.isCorrect)
    }

  return (
    <Card>
        <Button className='question-card-button'
            variant="outlined"
            fullWidth
            onClick={() => {
                setAnswer(!showAnswer)
                console.log(card.answers)
            }}>
        <CardContent className='question-card-button'>
            <Typography variant="h5" className='center-text'>{showAnswer ? card.answers[getCorrect()].text : card.question}</Typography>
        </CardContent>
        </Button>

    </Card>
  );
};


export default LearningMode;