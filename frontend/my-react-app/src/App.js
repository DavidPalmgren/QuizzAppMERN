//App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Layout from './components/Layout';
import HomePage from './components/HomePage';
import About from './components/About';

import Login from './view/Login';
import Contact from './view/Contact'
import CreateCard from './view/CreateCard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/createcard" element={<CreateCard/>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
