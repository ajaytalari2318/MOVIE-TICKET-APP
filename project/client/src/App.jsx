// src/App.jsx
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect to home if logged in, otherwise to login */}
        <Route 
          path="/" 
          element={
            localStorage.getItem('token') ? 
            <Navigate to="/home" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to home or login */}
        <Route 
          path="*" 
          element={
            localStorage.getItem('token') ? 
            <Navigate to="/home" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;