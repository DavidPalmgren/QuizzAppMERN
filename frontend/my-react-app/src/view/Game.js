import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Button, CardContent, Grid } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import QuestionCard from '../components/QuestionCard';
import LearningMode from '../components/LearningMode';
import ExactMatchMode from '../components/ExactMatchMode';
import Result from '../components/Result';

const QuizGame = () => {
  const [cards, setCards] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [mode, setMode] = useState('quiz');

  const { deckId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch(`http://localhost:4040/api/decks/${deckId}/cards`);
        if (response.ok) {
          const data = await response.json();
          setCards(data);
          setAnswerStatus(Array(data.length).fill(null)); // Initialize answer status
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, [deckId]);

  const handleAnswerClick = (isCorrect) => {
    // Check if cards is still null then redirect to create-cardv2, fix later so that u cant post empty decks
    if (cards === null) {
      navigate(`/create-cardv2/${deckId}`);
      return;
    }

    const updatedAnswerStatus = cards[currentIndex].answers.map((answer) =>
      answer.isCorrect ? 'correct' : 'wrong'
    );

    setAnswerStatus(updatedAnswerStatus);

    if (isCorrect) {
      setScore(score + 1);
    }

    // Delay for 1 second before moving to the next question
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  const resetAnswerStatus = () => {
    setAnswerStatus(Array(cards.length).fill(null));
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setAnswerStatus(Array(cards.length).fill(null));
  };

  const switchToQuizMode = () => {
    setMode('quiz');
  };

  const switchToExactMatchMode = () => {
    setMode('exactMatch');
  };

  const switchToLearningMode = () => {
    setMode('learning');
  };

  return (
    <Container>
      <CardContent className='pseudo-card'>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button variant="outlined" onClick={switchToLearningMode}>
              Learning
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" onClick={switchToQuizMode}>
              Quiz 4-Options
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" onClick={switchToExactMatchMode}>
              Quiz Exact Match
            </Button>
          </Grid>
        </Grid>
      </CardContent>
      {showResult ? (
        <Result score={score} totalQuestions={cards.length} onRestart={restartQuiz} />
      ) : (
        cards === null ? (
          <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
            <Typography variant="h6" gutterBottom>
              No cards in this deck yet. Add cards by clicking the following button:
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/create-cardv2/${deckId}`)}
            >
              Add Cards
            </Button>
          </Paper>
        ) : cards.length > 0 ? (
            <>
              {mode === 'quiz' && (
                <QuestionCard
                  card={cards[currentIndex]}
                  onAnswerClick={handleAnswerClick}
                  answerStatus={answerStatus}
                  resetAnswerStatus={resetAnswerStatus}
                />
              )}
              {mode === 'exactMatch' && (
                <ExactMatchMode
                  card={cards[currentIndex]}
                  onAnswerClick={handleAnswerClick}
                  answerStatus={answerStatus}
                  resetAnswerStatus={resetAnswerStatus}
                />
              )}
              {mode === 'learning' && (
                <LearningMode
                  card={cards[currentIndex]}
                  onNextCard={() => {
                    // Logic to show the next card in learning mode
                  }}
                />
              )}
            <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
              <Typography variant="h6" gutterBottom>
                Score: {score} / {cards.length}
              </Typography>
            </Paper>
          </>
        ) : (
          <Typography>Loading...</Typography>
        )
      )}
    </Container>
  );
};

export default QuizGame;
