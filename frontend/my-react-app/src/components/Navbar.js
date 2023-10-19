import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';

import { Link, useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { useUser } from '../requests/UserContext';
import {
  Category as CategoryIcon, // Add the category icon here
  Add as AddIcon, // Add the add icon here
  LockOpen,
} from '@mui/icons-material';


function Navbar() {
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useUser();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const targetSearch = search.trim();
  
    if (targetSearch === '') {
      navigate('/search/all');
    } else {
      navigate(`/search/${targetSearch}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUser('');
  }

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token not found in local storage');
        return;
      }

      const response = await fetch('http://localhost:4040/api/user', {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.username);
        setIsLoggedIn(true);
      } else {
        console.error('Failed to fetch user progress data');
      }
    } catch (error) {
      console.error('Error fetching user progress data:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, [setIsLoggedIn, setUser]);

  const searchBarStyle = {
    background: 'white',
    borderRadius: 4,
    paddingLeft: 10,
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
  
      handleSearch();
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
          StudyBuddy
        </Typography>
  
        <div style={{ flexGrow: 1 }}></div>
  
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputBase
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={searchBarStyle}
            onKeyPress={handleKeyPress}
          />
          <IconButton color="inherit" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
        </div>
  
        <Button color="inherit" component={Link} to="/categories">
          <CategoryIcon />
          Categories
        </Button>
        <Button color="inherit" component={Link} to="/createdeck">
          <AddIcon />
          Create Deck
        </Button>
        <Button color="inherit" component={Link} to="/create-cardv2/:deckId">
          <AddIcon />
          Create Card
        </Button>
        {isLoggedIn ? (
          <>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
            <Button color="inherit" component={Link} to={`/user/${user}`}>
              <PersonIcon />
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              <LockOpen/>
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
