// src/App.js
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import React from 'react';
import Signup from './components/Signup/Signup';
import Home from './components/Home/Home';
import AdminPanel from './components/AdminPanel/AdminPanel';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Signup/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/admin" element={<AdminPanel/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
