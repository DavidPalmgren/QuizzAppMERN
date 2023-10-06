import React from 'react';
import Demo from './Demo';
import {
    CardContent,
    Container,
    Typography,
} from '@mui/material'


function About() {
    return (
        <Container component="main" maxWidth="xs">
        <CardContent className='pseudo-card'>
        <Typography variant="h4" style={{ textAlign:"center", color:"black", marginBottom:"16px"}}>About</Typography>
        <Typography variant="h8" style={{color:"black", marginTop:"10px"}}>This is part of my individual project course at BTH, we've been tasked with creating a website for a customer.<br></br> Our customer decided on this project StudyBuddy which is a quizz game app that intends to help users study their course material.<br></br> In this project we have to keep contact with our customer and inquire him for how he wants the website to look we do this through Demos that we have every 2 week, we also have the option of contacting him through email if we need further clarification. We also have frequent status reports that we need to write for our Head of department.<br></br><br></br> //David Palmgren</Typography>
        </CardContent>
        </Container>

    )
}

export default About;