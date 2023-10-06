import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person'; // Import the user icon


function Navbar() {
  const isLoggedIn = localStorage.getItem('token');
  const [user, setUser] = useState("")

  const handleLogout = () => {
    localStorage.removeItem('token')
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const response = await fetch('https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/user', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.username);
      } else {
        console.error('Failed to fetch user progress data');
      }
    } catch (error) {
      console.error('Error fetching user progress data:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
          StudyBuddy
        </Typography>

        <div style={{ flexGrow: 1 }}></div>

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/categories">
          Categories
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/createdeck">
          Create Deck
        </Button>
        <Button color="inherit" component={Link} to="/create-cardv2/:deckId">
          createcardv2
        </Button>
        {isLoggedIn ? (
          <>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
            <Button color="inherit" component={Link} to={`/user/${user}`}>
              <PersonIcon /> {/* User icon */}
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
