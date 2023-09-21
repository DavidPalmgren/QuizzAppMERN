// Result.js
import React from 'react';
import { Typography, Button } from '@mui/material';

const Result = ({ score, totalQuestions, onRestart }) => {
  return (
    <div>
      <Typography variant="h5">Quiz Results</Typography>
      <Typography variant="h6">Score: {score}/{totalQuestions}</Typography>
      <Button variant="contained" onClick={onRestart}>
        Restart Quiz
      </Button>
    </div>
  );
};

export default Result;
