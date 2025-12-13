import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({ baseURL: API_BASE_URL });

export const getAllMovies = async () => {
  const response = await api.get('/api/movie/allMovies');
  return response.data;
};

export const addMovies = async (movies) => {
  const response = await api.post('/api/movie/add-movies', movies);
  return response.data;
};

export const updateMovie = async (id, movieData) => {
  const response = await api.put(`/api/movie/update/${id}`, movieData);
  return response.data;
};

export const deleteMovie = async (id) => {
  const response = await api.delete(`/api/movie/delete/${id}`);
  return response.data;
};
