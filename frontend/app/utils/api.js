import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot backend
});

export default API;
