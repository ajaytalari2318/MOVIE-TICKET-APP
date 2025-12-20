// src/App.jsx - Updated with Guest Experience
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import Partner from './pages/Partner';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Homepage - accessible to all (guest + logged in) */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
        
        {/* Movie Details - accessible to guests but with limited interaction */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* Protected Routes - require authentication */}
        <Route 
          path="/user-profile" 
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } 
        />

       <Route 
          path="/partner-profile" 
          element={
            <ProtectedRoute>
              <Partner />
            </ProtectedRoute>
          } 
          />
          

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;