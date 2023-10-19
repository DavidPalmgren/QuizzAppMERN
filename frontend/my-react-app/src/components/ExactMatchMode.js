import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Button, Grid, Paper, Box, TextField } from '@mui/material';
import MasteryRating from './MasteryRating';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const ExactMatchMode = ({ card, onExactAnswerClick, answerStatus, resetAnswerStatus, score, cards, userProgress }) => {
    const [timeoutActive, setTimeoutActive] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [showAnswer, setAnswer] = useState(false);
    const [textFieldBorderStyle, setTextFieldBorderStyle] = useState({});
    const [imageUrl, setImageUrl] = useState("");
    

    
    useEffect(() => {
        if (card.image) {
            setImageUrl(`url("http://localhost:4040/uploads/${card.image.filename}")`);
        } else {
            setImageUrl(""); // clear the image URL when there's no image
        }
    }, [card.image]);

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
            }, 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [timeoutActive, resetAnswerStatus, showAnswer]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setAnswer(!showAnswer);

        const cleanedUserAnswer = userAnswer.trim().toLowerCase();
        const correctAnswer = card.answers[getCorrect()].text.trim().toLowerCase();

        if (cleanedUserAnswer === correctAnswer) {
            console.log("correct");
            onExactAnswerClick(true);
            setTimeoutActive(true);
            setTextFieldBorderStyle({ backgroundColor: 'green' });
            answerStatus[card._id] = 'correct';
            toast.success(`Correct! The answer is: ${correctAnswer}`, { autoClose: 2000 });
        } else {
            console.log("incorrect");
            onExactAnswerClick(false);
            setTimeoutActive(true);
            setTextFieldBorderStyle({ backgroundColor: 'red' });
            answerStatus[card._id] = 'incorrect';
            toast.error(`Wrong answer. The correct answer is: ${correctAnswer}`, { autoClose: 2000 });
        }
        setUserAnswer("");
    }

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

    const currentUserMasteryRating = userProgress.find((progressItem) => progressItem.cardId === card._id)?.masteryRating;
    //problem with image load making the answer display
// my solution to this was to make toasts to show the answer
// which is why its so clowny
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
                    onChange={(e) => setUserAnswer(e.target.value)}
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
