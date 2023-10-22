import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Button, CardContent, TextField, Rating, Box, List, ListItem, ListItemText } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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

      if (comment == "") {
        toast.error("Your comment lacks any text", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      if (!rating) {
        toast.error("Please chose a rating to give the deck", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      if (!token) {
        toast.error("You can't comment or rate a deck if you are not registered.", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }



      const response = await fetch(`http://localhost:4040/api/deck/add-comment/${deckId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: username,
          comment: comment,
          rating: rating,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        fetchComments()
        setComment("");
        toast.success("Added", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:4040/api/decks/get-comments/${deckId}`);

      if (response.ok) {
        const data = await response.json();
        setComments(data);
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
      <ToastContainer autoClose={5000} />
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
      border: '1px solid #ccc', 
      borderRadius: '8px',      
      padding: '10px',         
      marginBottom: '10px',     
    }}>
      <ListItemText
        primary={
          <span style={{ color: 'black' }}>{comment.text}</span>
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
