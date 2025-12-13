import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Get all movies
export const getAllMovies = async () => {
  try {
    const response = await api.get('/api/movie/allMovies');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

// Add movies (expects an array of movie objects)
export const addMovies = async (movies) => {
  try {
    const response = await api.post('/api/movie/add-movies', movies);
    return response.data;
  } catch (error) {
    console.error('Error adding movies:', error);
    throw error;
  }
};

// Update a movie by ID
export const updateMovies = async (id, updatedMovie) => {
  try {
    const response = await api.put(`/api/movie/update/${id}`, updatedMovie);
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};
