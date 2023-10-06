import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, CardContent, TextField, Rating, Box, List, ListItem, ListItemText } from '@mui/material';

const Result = ({ score, totalQuestions, onRestart }) => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(1);
  const { deckId } = useParams();

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue);
  };

  const handleSubmit = () => {
    console.log('Comment:', comment);
    console.log('Rating:', rating);
    console.log('Username', localStorage.getItem('username'))
    sendComment(comment, rating)
  };

  const sendComment = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/deck/add-comment/${deckId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          comment: comment,
          rating: rating,
        }), // Stringify the request body
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchComments()
        setComment("");
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/decks/get-comments/${deckId}`);

      if (response.ok) {
        const data = await response.json();
        setComments(data); // Set the comments retrieved from the server
      } else {
        console.error('Failed to fetch comments');
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <CardContent className='pseudo-card'>
      <Typography variant="h5">Quiz Results</Typography>
      <Typography variant="h6">Score: {score}/{totalQuestions}</Typography>
      <Button variant="contained" onClick={onRestart}>
        Restart Quiz
      </Button>
      <CardContent>
        <Typography variant="h6">Add a Comment and Rating</Typography>
        <TextField
          label="Comment"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={handleCommentChange}
        />
        <Box component="fieldset" mt={2}>
          <Typography component="legend">Rating</Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={handleRatingChange}
            max={5}
            precision={1}
          />
        </Box>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit Comment and Rating
        </Button>
        {/* Display comments */}
        <List>
  {comments.map((comment, index) => (
    <ListItem key={index} style={{
      border: '1px solid #ccc', // Border style
      borderRadius: '8px',      // Rounded corners
      padding: '10px',          // Padding inside the comment box
      marginBottom: '10px',     // Spacing between comments
    }}>
      <ListItemText
        primary={
          <span style={{ color: 'black' }}>{comment.text}</span> // Change 'blue' to your desired text color
        }
        secondary={
          <React.Fragment>
            <span>Rating: {comment.rating}</span><br></br>
            <span>From: {comment.username}</span>
          </React.Fragment>
        }
      />
    </ListItem>
  ))}
</List>
      </CardContent>
    </CardContent>
  );
};

export default Result;
