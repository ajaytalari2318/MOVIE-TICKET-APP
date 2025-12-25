// src/App.jsx - Updated with Booking Routes
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetails from './pages/MovieDetails';

import SeatSelection from './pages/SeatSelection';
import Payment from './pages/Payment';
import ProtectedRoute from './components/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import PartnerProfile from './pages/PartnerProfile';
import BookingPage from './pages/BookingPage';
import BookingHistory from './pages/BookingHistory';
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

        {/* Booking Routes - Protected (only logged-in users) */}
        <Route
          path="/booking/:id"
          element={
            <ProtectedRoute>
              <BookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seat-selection"
          element={
            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        {/* User Profile - Only for regular users */}
        <Route
          path="/user-profile"
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/User_Bookings"
          element={

            <BookingHistory />
          }
        />

        {/* Partner Profile - Only for partners */}
        <Route
          path="/partner-profile"
          element={
            <ProtectedRoute allowedRoles={['partner']}>
              <PartnerProfile />
            </ProtectedRoute>
          }
        />

        {/* Admin Profile - Only for admins */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;