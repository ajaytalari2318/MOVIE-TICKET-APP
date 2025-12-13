import axios from 'axios'
import { API_BASE_URL } from './config.js'

const api = axios.create(
    {
        baseURL: API_BASE_URL
    })

export const getAllMovies = async () => {
  try {
    const response = await api.get('/api/movie/allMovies');
    return response.data; 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
