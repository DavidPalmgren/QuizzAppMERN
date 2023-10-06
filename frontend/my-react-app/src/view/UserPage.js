import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  styled,
  Container,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Root = styled('div')({
  flexGrow: 1,
  padding: (theme) => theme.spacing(2),
});

const MainContent = styled(Paper)({
  padding: (theme) => theme.spacing(2),
});

const Aside = styled(Paper)({
  padding: (theme) => theme.spacing(2),
});

const StatsContainer = styled(Card)({
  marginTop: (theme) => theme.spacing(2),
  padding: (theme) => theme.spacing(2),
});

function ProfilePage() {
  const [userData, setUser] = useState({});
  const { userName } = useParams();

  const fetchUserByParam = async () => {
    try {
      const response = await fetch(`https://studyapp-dapa-98dcdc34bdde.herokuapp.com/api/user/${userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUser(data);
      } else {
        console.error('Failed to user page');
      }
    } catch (error) {
      console.error('Failed to user page:', error);
    }
  };

  useEffect(() => {
    fetchUserByParam();
  }, []);

  function formatTimeToHours(seconds) {
    const hours = Math.floor(seconds / 3600); // 3600 seconds in an hour
    const minutes = Math.floor((seconds % 3600) / 60); // in min this is fucked currently it looks like minutes is secconds
    return `${hours} hours ${minutes} minutes`;
  }
  
  // Usage:
  const formattedTime = formatTimeToHours(userData.totalTimeStudied);

  return (
    <Root>
      <Container component="main" maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>

        <Grid container spacing={3}>
          {/* Left Aside */}
          <Grid item xs={3}>
            <Aside>
              {/*left aside */}
              <Typography variant="h6" style={{height:"292px"}}>Favorite decks</Typography>
              {/* favorite section fix backend later */}
            </Aside>
          </Grid>

          {/* Main Content */}
          <Grid item xs={6}>
            <MainContent style={{ padding: "10px", height: "292px" }}>
                {/* User profile section */}
                <Avatar style={{ width: '80px', height: '80px', backgroundColor: '#6998ff' }}>
                <AccountCircleIcon style={{ fontSize: '60px' }} />
                </Avatar>
                <Typography variant="h5" style={{ padding: "10px" }}>{userData.username}</Typography>
                <Typography variant="body1" style={{ padding: "10px" }}>{userData.email}</Typography>
                <Typography variant="body2" style={{ padding: "10px" }}>Follows: {userData.followsCount}</Typography> {/* Placeholders implement to backend later */}
                <Typography variant="body2" style={{ padding: "10px" }}>Followers: {userData.followersCount}</Typography>
                {/* Here is the user feed later */}
            </MainContent>
            </Grid>

          {/* Right Aside */}
          <Grid item xs={3}>
            <Aside style={{ padding: "10px"}}>
              <Typography variant="h6" style={{textAlign: 'center'}}>Milestones</Typography>
              <Typography variant="body1">
                <CardContent>
                <Card style={{ padding: "10px", margin: "5px", backgroundColor:"#1976D2", color:"#fff"}}><strong>Newbie:</strong> Answer 100 Questions</Card>
                <Card style={{ padding: "10px", margin: "5px", backgroundColor:"#1976D2", color:"#fff" }}><strong>Touch grass:</strong> Answer 200 Questions</Card>
                <Card style={{ padding: "10px", margin: "5px", backgroundColor:"#1976D2", color:"#fff" }}><strong>Maniac:</strong> Study for 100hrs</Card>
                </CardContent>
              </Typography>
            </Aside>
            {/* Stats row udner right aside, just using style cba right now mb later */}
            <StatsContainer style={{ marginTop: '16px', padding: '10px' }}>
              <CardContent style={{ padding: "10px" }}>
                <Typography variant="h6" style={{textAlign: 'center'}}>Stats</Typography>
                <Typography variant="body1">
                  <Card style={{ padding: "10px" , margin: "5px", backgroundColor:"#1976D2", color:"#fff"}}><strong>Total Cards Answered:</strong> {userData.totalCardsAnswered}</Card>
                </Typography>
                <Typography variant="body1">
                <Card style={{ padding: "10px" , margin: "5px", backgroundColor:"#1976D2", color:"#fff"}}><strong>Total Correct Answers:</strong> {userData.totalCorrectAnswers}</Card>
                </Typography>
                <Typography variant="body1">
                <Card style={{ padding: "10px" , margin: "5px", backgroundColor:"#1976D2", color:"#fff"}}><strong>Percentage Correct:</strong> {((userData.totalCorrectAnswers / userData.totalCardsAnswered) * 100).toFixed(2) + '%'}</Card>
                </Typography>
                <Typography variant="body1">
                <Card style={{ padding: "10px" , margin: "5px", backgroundColor:"#1976D2", color:"#fff"}}><strong>Total Time Studied:</strong> {formattedTime}</Card>
                </Typography>
              </CardContent>
            </StatsContainer>
          </Grid>
        </Grid>
      </Container>
    </Root>
  );
}

export default ProfilePage;
