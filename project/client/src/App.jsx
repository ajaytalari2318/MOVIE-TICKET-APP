import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/userProfile'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<UserProfile />} /> 
        
        {/* Homepage */}
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/movie/:id" 
          element={
            <ProtectedRoute>
              <MovieDetails />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
