import axios from 'axios';
import { API_BASE_URL } from './config.js';

const api = axios.create({ baseURL: API_BASE_URL });


export const addShow = async (showData) => {
  const response = await api.post('/api/show/addShow', showData);
  return response.data;
};

