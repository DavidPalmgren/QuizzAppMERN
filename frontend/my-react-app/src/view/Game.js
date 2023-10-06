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
  const [mode, setMode] = useState('learning');
  const [startTime, setStartTime] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [isQuizButtonDisabled, setIsQuizButtonDisabled] = useState(false);
  const [userProgress, setUserProgress] = useState([]);


  const { deckId } = useParams();
  const navigate = useNavigate();

  const fetchUserProgressData = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('Token not found in local storage');
        return;
      }
  
      const response = await fetch('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/user-progress', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('User progress data:', data);
        setUserProgress(data);
      } else {
        console.error('Failed to fetch user progress data');
      }
    } catch (error) {
      console.error('Error fetching user progress data:', error);
    }
  };
  

  useEffect(() => {
    fetchUserProgressData();
  }, []);

  //todo clean up fix useEffects
  useEffect(() => {
    setStartTime(new Date()); // init here

    const fetchCards = async () => {
      try {
        const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/decks/${deckId}/cards`);
        if (response.ok) {
          const data = await response.json();
          setCards(data);
          setAnswerStatus(Array(data.length).fill(null));
          console.log('deck fetch:', data)
          const hasNonMultipleChoice = data.some(card => card.isMultipleChoice); //INVERTED THIS CAUSE IM NOT SURE WHY IT WASNT WORKING ALL OF A SUDDEN
          setIsQuizButtonDisabled(hasNonMultipleChoice);
        } else {
          console.error('Failed to fetch cards');
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    fetchCards();
  }, [deckId]);

  useEffect(() => {
    if (showResult && startTime) {
      const endTime = new Date();
      const timeSpent = (endTime - startTime) / 1000; // Convert to seconds
      setTotalTime(timeSpent); // Update total time spent
      console.log('Time spent (seconds):', timeSpent);

      // Send data to the server when the user finishes
      sendGameDataToServer(timeSpent);
    }
  }, [showResult, startTime]);

  const sendGameDataToServer = async (timeSpent) => {
    try {
      // Get the username from local storage
      const username = localStorage.getItem('username');
      console.log(username)
  
      if (!username) {
        console.error('Username not found in local storage');
        return;
      }
  
      // Create an array to store card data for sending to the server
      const cardData = cards.map(card => ({
        cardId: card._id,
        answeredCorrectly: card.answeredCorrectly,
        masteryRating: card.masteryRating,
      }));
  
      const response = await fetch('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/record-study-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          timeSpent,
          correctAnswers: score,
          totalAnswers: cards.length,
          cardData,
        }),
      });
  
      if (response.ok) {
        console.log('Game data recorded successfully');
      } else {
        console.error('Failed to record game data');
      }
    } catch (error) {
      console.error('Error recording game data:', error);
    }
  };
  

  const handleAnswerClick = (isCorrect) => {
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
    
      // I think i fixed this but id rather not try removing it and then having it break again
      // Anyways this is supposed to work as a failsafe and make sure that values are not null which breaks EVERYTHING regarding the components star display
      cards[currentIndex].answeredCorrectly = true;
      if (cards[currentIndex].masteryRating < 3) {
        cards[currentIndex].masteryRating += 1;
      } else if (cards[currentIndex].masteryRating === 3) {
        // Do nothing, keep it on 3*
      }
    
      // Check for null or undefined and set to 0
      if (cards[currentIndex].masteryRating == null) {
        cards[currentIndex].masteryRating = 0;
      }
    } else {
      // If answered incorrectly, set masteryRating to 0.5
      cards[currentIndex].masteryRating -= 0.5;
    
      // Check for null or undefined and set to 0.5
      if (cards[currentIndex].masteryRating == null) {
        cards[currentIndex].masteryRating = 0.5;
      }
    }
    

    // delay for 1 second before moving to the next question
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
  
  // resets everything including time
  const restartQuiz = () => {
    setCurrentIndex(0); //back to start with it
    setScore(0); // display score not user statistics
    setShowResult(false); // for flip effect, currently learning mode is bugged look into that todo
    setAnswerStatus(Array(cards.length).fill(null));
    setStartTime(new Date()); // start new intervall för data
    fetchUserProgressData(); //dynamic score
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

  const goToNextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onExactAnswerClick = (correct) => {
    if (cards === null) {
      navigate(`/create-cardv2/${deckId}`);
      return;
    }
    // ADD ELIF FOR 
    if (correct) {
      setScore(score + 1);
      // Update the card's data
      cards[currentIndex].answeredCorrectly = true;
      if (cards[currentIndex].masteryRating < 3) {
        cards[currentIndex].masteryRating += 1;
      } else if (cards[currentIndex].masteryRating === 3) {
        // Do nothing, keep it on 3*
      }
    
      // Check for null or undefined and set to 0
      if (cards[currentIndex].masteryRating == null) {
        cards[currentIndex].masteryRating = 0;
      }
    } else {
      // If answered incorrectly, set masteryRating to 0.5
      cards[currentIndex].masteryRating -= 0.5;
    
      // Check for null or undefined and set to 0.5
      if (cards[currentIndex].masteryRating == null) {
        cards[currentIndex].masteryRating = 0.5;
      }
    }

    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowResult(true);
      }
    }, 1000);
  };

  console.log(isQuizButtonDisabled)

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
            <Button variant="outlined" onClick={switchToQuizMode} disabled={isQuizButtonDisabled}>
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
                score={score}
                cards={cards}
                userProgress={userProgress}
              />
            )}
            {mode === 'exactMatch' && (
              <ExactMatchMode
                card={cards[currentIndex]}
                onAnswerClick={handleAnswerClick}
                answerStatus={answerStatus}
                onExactAnswerClick={onExactAnswerClick}
                resetAnswerStatus={resetAnswerStatus}
                score={score}
                cards={cards}
                userProgress={userProgress}
              />
            )}
            {mode === 'learning' && (
              <LearningMode
                card={cards[currentIndex]}
                onNextCard={goToNextCard}
                onPreviousCard={goToPreviousCard}
                cards={cards}
                currentIndex={currentIndex}
                userProgress={userProgress}
              />
            )}
          </>
        ) : (
          <Typography>Loading...</Typography>
        )
      )}
    </Container>
  );
};

export default QuizGame;
