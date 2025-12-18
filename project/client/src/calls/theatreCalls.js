// client/src/calls/theatreCalls.js - NEW FILE
import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({ baseURL: API_BASE_URL });

// Partner: Add theatre request
export const addTheatre = async (theatreData) => {
  const response = await api.post('/api/theatre/addTheatre', theatreData);
  return response.data;
};

// Get all theatres (admin)
export const getAllTheatres = async () => {
  const response = await api.get('/api/theatre/getAllTheatres');
  return response.data;
};

// Get theatres by owner (partner)
export const getTheatresByOwner = async (ownerId) => {
  const response = await api.get(`/api/theatre/getTheatresByOwner/${ownerId}`);
  return response.data;
};

// Get approved theatres (public)
export const getApprovedTheatres = async () => {
  const response = await api.get('/api/theatre/getApprovedTheatres');
  return response.data;
};

// Admin: Approve theatre
export const approveTheatre = async (id, adminId) => {
  const response = await api.put(`/api/theatre/approveTheatre/${id}`, { adminId });
  return response.data;
};

// Admin: Reject theatre
export const rejectTheatre = async (id, adminId, reason) => {
  const response = await api.put(`/api/theatre/rejectTheatre/${id}`, { adminId, reason });
  return response.data;
};

// Update theatre
export const updateTheatre = async (id, theatreData) => {
  const response = await api.put(`/api/theatre/updateTheatre/${id}`, theatreData);
  return response.data;
};

// Delete theatre
export const deleteTheatre = async (id) => {
  const response = await api.delete(`/api/theatre/deleteTheatre/${id}`);
  return response.data;
};