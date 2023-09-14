import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

function Footer() {
  const footerStyles = {
    backgroundColor: '#1b263b',
    color: 'white',
    textAlign: 'center',
    padding: '20px 0',
    alignItems: 'center',
  };

  return (
    <AppBar position="static" style={footerStyles}>
      <Toolbar>
        <Typography variant="body1" component="div">
          &copy; {new Date().getFullYear()} StudyBuddy
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;