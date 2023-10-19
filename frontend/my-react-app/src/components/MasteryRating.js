import React from 'react';
import { Star, StarHalf, StarOutline } from '@mui/icons-material';

const MasteryRating = ({ rating, style }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      if (rating >= i + 1) {
        stars.push(<Star key={i} color="primary" />);
      } else if (rating > i) {
        stars.push(<StarHalf key={i} color="primary" />);
      } else {
        stars.push(<StarOutline key={i} color="primary" />);
      }
    }
    return stars;
  };

  return (
    <div className="mastery-rating" style={style}>
      {renderStars(rating)}
    </div>
  );
};

export default MasteryRating;
