import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Spring Boot backend
});

// Service API functions
export const serviceAPI = {
  // Get all services for current user
  getMyServices: (token) => {
    return API.get('/services/user/my-services', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Create a new service
  createService: (serviceData, token) => {
    return API.post('/services/provider/add', serviceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update a service
  updateService: (serviceId, serviceData, token) => {
    return API.put(`/services/provider/${serviceId}`, serviceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Delete a service
  deleteService: (serviceId, token) => {
    return API.delete(`/services/provider/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get service by ID
  getServiceById: (serviceId) => {
    return API.get(`/services/user/${serviceId}`);
  },

  // Get all services (public)
  getAllServices: () => {
    return API.get('/services/user/all');
  }
};

// User API functions
export const userAPI = {
  // Get user profile by username
  getProfile: (username, token) => {
    return API.get(`/users/profile/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update availability
  updateAvailability: (available, token) => {
    return API.put('/users/provider/availability', { available }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default API;
