import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Paper } from '@mui/material';
import MasteryRating from './MasteryRating';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const LearningMode = ({ card, onNextCard, onPreviousCard, cards, currentIndex, userProgress }) => {
  const [showAnswer, setAnswer] = useState(false);
  const getCorrect = () => {
    return card.answers.findIndex((answer) => answer.isCorrect);
  };

  let imageUrl = '';

  if (card.image) {
    imageUrl = `url("http://localhost:4040/uploads/${card.image.filename}")`;
  }
// a dumb solution to having bg as a variable
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

  const flipCardStyle = css`
    perspective: 1000px;
  `;

  const flipButtonStyle = css`
    transform-style: preserve-3d;
    transition: transform 0.5s;
    cursor: pointer;

    &.flipped {
      transform: rotateY(180deg);
    }
  `;

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

  const starStyle = {
    position: 'absolute',
    top: '8px',
    left: '8px',
  };

  const currentUserMasteryRating = userProgress.find((progressItem) => progressItem.cardId === card._id)?.masteryRating;

  return (
    <Card>
      <div css={flipCardStyle}>
        <Button
          className=""
          variant="outlined"
          fullWidth
          onClick={() => {
            setAnswer(!showAnswer);
          }}
          css={css`
            ${flipButtonStyle};
          `}
        >
          {imageUrl ? (
            <CardContent className="question-card-button" css={cardContentStyle}>
              <MasteryRating rating={currentUserMasteryRating} style={starStyle} />
              <Typography variant="h5" className="top-text">
                <p css={textStyle}>
                  {showAnswer ? `A: ${card.answers[getCorrect()].text}` : `Q: ${card.question}`}
                </p>
              </Typography>
            </CardContent>
          ) : (
            <CardContent className='question-card'>
              <MasteryRating rating={currentUserMasteryRating || 0} />
              <Typography variant="h5" className='center-text'>
              {showAnswer ? `A: ${card.answers[getCorrect()].text}` : `Q: ${card.question}`}
              </Typography>
            </CardContent>
          )}
        </Button>
      </div>
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px', alignItems: "space-between" }}>
        <Button
          className=""
          variant="outlined"
          onClick={() => {
            onPreviousCard();
            setAnswer(false);
          }}
        >
          <Typography>Prev</Typography>
        </Button>
        <Button
          className=""
          variant="outlined"
          onClick={() => {
            onNextCard();
            setAnswer(false);
          }}
        >
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
