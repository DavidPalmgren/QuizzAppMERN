//App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import About from './components/About';

import Login from './view/Login';
import Contact from './view/Contact'
import CreateCard from './view/CreateCard';
import CreateCardv2 from './view/CreateCardv2';
import CreateDeck from './view/CreateDeck';
import QuizGame from './view/Game';
import Categories from './view/Categories';
import Courses from './view/Courses';
import Decks from './view/Decks';
import SignUp from './view/SignUp';
import UserPage from './view/UserPage'
// Make paths uniform

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<Categories/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/createcard" element={<CreateCard/>} />
          <Route path="/create-cardv2/:deckId" element={<CreateCardv2/>} />
          <Route path="/createdeck" element={<CreateDeck/>} />
          <Route path="/categories/:categoryName/" element={<Courses/>} />
          <Route path="/categories/:categoryName/:courseName/" element={<Decks/>} />
          <Route path="/quizgame/:deckId" element={<QuizGame/>} />
          <Route path="/sign-up" element={<SignUp/>} />
          <Route path="/user/:userName" element={<UserPage/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
