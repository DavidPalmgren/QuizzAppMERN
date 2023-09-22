import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Paper } from '@mui/material';

const LearningMode = ({ card, onNextCard, onPreviousCard, cards, currentIndex }) => {
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
        <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                <Button
                    className=''
                    variant="outlined"
                    onClick={() => {
                        onPreviousCard();
                        setAnswer(false)
                    }}>
                        <Typography>Prev</Typography>
                </Button>
                <Button
                    className=''
                    variant="outlined"
                    onClick={() => {
                        onNextCard();
                        setAnswer(false)
                    }}>
                        <Typography>Next</Typography>
                    </Button>
            </Paper>
            <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
              <Typography variant="h6" gutterBottom>
                Card: {currentIndex + 1} / {cards.length}
              </Typography>
            </Paper>
    </Card>
  );
};


export default LearningMode;