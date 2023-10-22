import React, { useEffect, useState } from 'react'
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
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  Button
} from '@mui/material'
import { useParams, Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import EditIcon from '@mui/icons-material/Edit'

const Root = styled('div')({
  flexGrow: 1,
  padding: theme => theme.spacing(2)
})

const MainContent = styled(Paper)({
  padding: theme => theme.spacing(2)
})

const Aside = styled(Paper)({
  padding: theme => theme.spacing(2)
})

const StatsContainer = styled(Card)({
  marginTop: theme => theme.spacing(2),
  padding: theme => theme.spacing(2)
})

function ProfilePage () {
  const [userData, setUser] = useState({})
  const [decks, setDecks] = useState([])
  const { userName } = useParams()
  const token = localStorage.getItem('token')
  const [achievementAdded, setAchievementAdded] = useState(false)

  const fetchUserByParam = async () => {
    try {
      const response = await fetch(
        `http://localhost:4040/api/user/${userName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setUser(data)
      } else {
        console.error('Failed to user page')
      }
    } catch (error) {
      console.error('Failed to user page:', error)
    }
  }

  const fetchDecks = async username => {
    try {
      const response = await fetch(
        `http://localhost:4040/api/personal-decks?author=${username}`
      )
      if (response.ok) {
        const data = await response.json()
        console.log('decks: ', data)
        setDecks(data)
      } else {
        console.error('Failed to fetch decks')
      }
    } catch (error) {
      console.error('Error fetching decks:', error)
    }
  }

  useEffect(() => {
    fetchDecks(userName)
  }, [])

  useEffect(() => {
    fetchUserByParam()
  }, [])

  useEffect(() => {
    const thresholds = [100, 500]
    const achievementsToAdd = []

    thresholds.forEach(threshold => {
      if (
        userData.totalCardsAnswered >= threshold &&
        !userData.achievements.some(
          achievement =>
            achievement.name === (threshold === 100 ? 'Newbie' : 'Intermediate')
        )
      ) {
        // Push the corresponding achievement to the list
        achievementsToAdd.push(threshold === 100 ? 'Newbie' : 'Intermediate')
      }
    })

    // Check if the URL parameter username matches the token username
    const username = localStorage.getItem('username')
    if (userName === username) {
      // If there are achievements to add, call the addAchievement function
      if (achievementsToAdd.length > 0 && !achievementAdded) {
        addAchievement(achievementsToAdd)
        setAchievementAdded(true) // Set the flag to prevent further calls
      }
    } else {
      console.log(
        'Username in URL does not match token username. Achievements will not be added.'
      )
    }
  }, [userData, achievementAdded])

  const addAchievement = async achievements => {
    // Check if 'username' and 'token' are available in local storage
    const username = localStorage.getItem('username')
    const token = localStorage.getItem('token')

    // Handle missing 'username' or 'token'
    if (!username || !token) {
      console.log(
        'USERNAME or TOKEN NOT IN LOCAL STORAGE. REDIRECT OR HANDLE THIS CASE.'
      )
      return
    }

    try {
      // Create the request payload with the 'achievements' array
      const requestData = {
        achievementNames: achievements, // Send an array of achievements
        user: username
      }

      const response = await fetch(
        'http://localhost:4040/api/add-achievement-to-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(requestData)
        }
      )

      if (response.ok) {
        console.log('Achievement added successfully')
        fetchUserByParam()
      } else {
        const data = await response.json()
        console.error('Failed to add achievement:', data.message)
      }
    } catch (error) {
      console.error('Error adding achievement:', error)
    }
  }

  function formatTimeToHours (seconds) {
    const hours = Math.floor(seconds / 3600) // 3600 seconds in an hour
    const minutes = Math.floor((seconds % 3600) / 60) // in min this is fucked currently it looks like minutes is secconds
    return `${hours}h ${minutes}m`
  }

  function formatTimestampToDateString (timestamp) {
    const date = new Date(timestamp)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // Usage:
  const formattedTime = formatTimeToHours(userData.totalTimeStudied)

  return (
    <Root>
      <Container component='main' maxWidth='lg' style={{ marginTop: '32px' }}>
        <Grid container spacing={3}>
          {/* Left Aside */}
          <Grid item xs={3}>
            <Aside>
              <Grid item ms={6}>
                <div
                  style={{
                    marginTop: '0px',
                    backgroundColor: 'white',
                    color: '#1976D2',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    minHeight: '292px'
                  }}
                >
                  <h2>User Decks</h2>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {decks.map(deck => (
                      <ListItem key={deck._id} disableGutters>
                        <ListItemText
                          primary={`${deck.name} - ${deck.category}`}
                        />
                        <ListItemSecondaryAction>
                          <Tooltip title='Play deck'>
                            <Link to={`/quizgame/${deck._id}`}>
                              <IconButton edge='end' aria-label='play'>
                                <PlayCircleIcon />
                              </IconButton>
                            </Link>
                          </Tooltip>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </div>
              </Grid>
            </Aside>
          </Grid>
          <Grid item xs={6}>
            <MainContent style={{ padding: '10px', height: '292px' }}>
              <Avatar
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#6998ff'
                }}
              >
                <AccountCircleIcon style={{ fontSize: '60px' }} />
              </Avatar>
              <Typography variant='h5' style={{ padding: '10px' }}>
                {userData.username}
              </Typography>
              <Typography variant='body1' style={{ padding: '10px' }}>
                {userData.email}
              </Typography>
            </MainContent>
            <CardContent
              style={{
                backgroundColor: 'rgb(222 222 222)',
                borderRadius: '4px'
              }}
            >
              <Typography
                variant='body2'
                style={{ padding: '10px', color: 'black' }}
              >
                Achievements
              </Typography>

              {userData.achievements && userData.achievements.length > 0 ? (
                userData.achievements
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((entry, index) => (
                    <Card
                      style={{
                        margin: '10px',
                        borderRadius: '4px',
                        border: '1px solid #1976D2',
                        backgroundColor: '#f0f0f0'
                      }}
                      key={entry.timestamp}
                    >
                      <CardContent
                        style={{
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                          }}
                        >
                          <span
                            style={{
                              backgroundColor: '#1976D2',
                              color: '#fff',
                              padding: '4px 8px',
                              borderRadius: '4px'
                            }}
                          >
                            <strong>{entry.name}:</strong>
                          </span>
                          <Typography variant='body2'>
                            {formatTimestampToDateString(entry.timestamp)}
                          </Typography>
                        </div>
                        <Typography variant='body2'>{entry.text}</Typography>
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card>
                  <Typography variant='body2' style={{ padding: '10px' }}>
                    {' '}
                    None
                  </Typography>
                </Card>
              )}
            </CardContent>
          </Grid>
          {/* Right Aside */}
          <Grid item xs={3}>
            {/* Stats row udner right aside, just using style cba right now mb later */}
            {/* Reworked this 5billion times what a waste of time */}
            <StatsContainer style={{ marginTop: '0px' }}>
              <CardContent>
                <Typography variant='h6'>User Stats</Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    border: '1px solid #1976D2',
                    padding: '8px',
                    borderRadius: '10px'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    Total Cards Answered:
                  </span>
                  <Card
                    style={{
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      {userData.totalCardsAnswered}
                    </span>
                  </Card>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    border: '1px solid #1976D2',
                    padding: '8px',
                    borderRadius: '10px'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    Total Correct Answers:
                  </span>
                  <Card
                    style={{
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      {userData.totalCorrectAnswers}
                    </span>
                  </Card>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    border: '1px solid #1976D2',
                    padding: '8px',
                    borderRadius: '10px'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    Percentage Correct:
                  </span>
                  <Card
                    style={{
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      {(
                        (userData.totalCorrectAnswers /
                          userData.totalCardsAnswered) *
                        100
                      ).toFixed(2) + '%'}
                    </span>
                  </Card>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    border: '1px solid #1976D2',
                    padding: '8px',
                    borderRadius: '10px'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>
                    Total Time Studied:
                  </span>
                  <Card
                    style={{
                      backgroundColor: '#1976D2',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '10px'
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>{formattedTime}</span>
                  </Card>
                </div>
              </CardContent>
            </StatsContainer>
          </Grid>
        </Grid>
      </Container>
    </Root>
  )
}

export default ProfilePage
