import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Login from './pages/Login'
import Register from './pages/Register'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Homepage />} /> {/* default route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
