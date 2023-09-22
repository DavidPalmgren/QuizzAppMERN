import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Paper, Box, TextField } from '@mui/material';

const ExactMatchMode = ({ card, onExactAnswerClick, answerStatus, resetAnswerStatus, score, cards }) => {
    const [timeoutActive, setTimeoutActive] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [showAnswer, setAnswer] = useState(false);
    const [textFieldBorderStyle, setTextFieldBorderStyle] = useState({});

    const getCorrect = () => {
        return card.answers.findIndex((answer) => answer.isCorrect);
    }

    useEffect(() => {
        if (timeoutActive) {
            const timeoutId = setTimeout(() => {
                setAnswer(!showAnswer);
                setTimeoutActive(false);
                resetAnswerStatus();
                setTextFieldBorderStyle({});
            }, 1500);
    
            return () => clearTimeout(timeoutId);
        }
    }, [timeoutActive, resetAnswerStatus, showAnswer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setAnswer(!showAnswer);
        if (userAnswer.toLowerCase() === card.answers[getCorrect()].text.toLowerCase()) {
            console.log("correct");
            onExactAnswerClick(true);
            setTimeoutActive(true);
            setTextFieldBorderStyle({ backgroundColor: 'green' });
        } else {
            console.log("incorrect");
            onExactAnswerClick(false);
            setTimeoutActive(true);
            setTextFieldBorderStyle({ backgroundColor: 'red' });
        }
    }

    return (
        <Card>
            <CardContent>
                <CardContent className='question-card'>
                    <Typography variant="h5" className='center-text'>{showAnswer ? card.answers[getCorrect()].text : card.question}</Typography>
                </CardContent>
            </CardContent>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="userAnswer"
                    label="Answer"
                    name="userAnswer"
                    autoFocus
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)} //Fix downtime so user cant spam fuck themselves
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSubmit(e);
                        }
                    }}
                    sx={textFieldBorderStyle}
                />
            </Box>
            <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                <Typography variant="h6" gutterBottom>
                    Score: {score} / {cards.length}
                </Typography>
            </Paper>
        </Card>
    );
};

export default ExactMatchMode;
