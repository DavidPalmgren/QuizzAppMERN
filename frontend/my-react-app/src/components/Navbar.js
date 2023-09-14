import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ textDecoration: 'none', color: 'white' }}>
          StudyBuddy
        </Typography>
        <TextField id="outlined-basic" label="Search for catalogs, flashcards etc.." variant="filled" size="small" fullWidth style={{marginLeft: "20px", marginRight: "20px", color: "white"}} />
        <div style={{ flexGrow: 1 }}></div>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/about">
          About
        </Button>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/contact">
          Contact
        </Button>
        <Button color="inherit" component={Link} to="/createcard">
          Create
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
