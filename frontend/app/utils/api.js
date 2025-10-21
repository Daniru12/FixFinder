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

// Admin API functions
export const adminAPI = {
  // Get all services for admin
  getAllServices: (token) => {
    return API.get('/services/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Create service as admin
  createService: (serviceData, token) => {
    return API.post('/services/admin/add', serviceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update service as admin
  updateService: (serviceId, serviceData, token) => {
    return API.put(`/services/admin/${serviceId}`, serviceData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Delete service as admin
  deleteService: (serviceId, token) => {
    return API.delete(`/services/admin/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get all users
  getAllUsers: (token) => {
    return API.get('/users/admin', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Delete user
  deleteUser: (userId, token) => {
    return API.delete(`/users/admin/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update user
  updateUser: (userId, userData, token) => {
    return API.put(`/users/${userId}`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get user by ID
  getUserById: (userId, token) => {
    return API.get(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Create user
  createUser: (userData, token) => {
    return API.post('/users', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get all bookings
  getAllBookings: (token) => {
    return API.get('/api/bookings', {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

// Booking API functions
export const bookingAPI = {
  // Create a new booking
  createBooking: (bookingData, token) => {
    return API.post('/api/bookings/add', bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get all bookings for current user
  getMyBookings: (token) => {
    return API.get('/api/bookings/my', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get bookings for provider
  getProviderBookings: (token) => {
    return API.get('/api/bookings/provider', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get booking by ID
  getBookingById: (bookingId, token) => {
    return API.get(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update booking status
  updateBookingStatus: (bookingId, status, token) => {
    return API.put(`/api/bookings/confirm/${bookingId}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update booking
  updateBooking: (bookingId, bookingData, token) => {
    return API.put(`/api/bookings/${bookingId}`, bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Delete booking
  deleteBooking: (bookingId, token) => {
    return API.delete(`/api/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get bookings by customer
  getBookingsByCustomer: (customerId, token) => {
    return API.get(`/api/bookings/customer/${customerId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get bookings by service
  getBookingsByService: (serviceId, token) => {
    return API.get(`/api/bookings/service/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export default API;
 
// Product API functions
export const productAPI = {
  // Public: list all active products
  getAll: () => API.get('/products'),

  // Public: get product by id
  getById: (id) => API.get(`/products/${id}`),

  // Get user's own products (provider)
  getMyProducts: (token) =>
    API.get('/products/my-products', {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Provider/Admin: create product
  create: (product, token) =>
    API.post('/products/create', product, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Owner/Admin: update product
  update: (id, product, token) =>
    API.put(`/products/${id}`, product, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Owner/Admin: delete product
  remove: (id, token) =>
    API.delete(`/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

// Order API functions
export const orderAPI = {
  // Create a new order
  create: (orderData, token) => {
    return API.post('/orders/create', orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get all orders (Admin only)
  getAll: (token) => {
    return API.get('/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get order by ID
  getById: (orderId, token) => {
    return API.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get my orders (customer's own orders)
  getMyOrders: (token) => {
    return API.get('/orders/my-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get provider orders
  getProviderOrders: (token) => {
    return API.get('/orders/provider-orders', {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get orders by status
  getByStatus: (status, token) => {
    return API.get(`/orders/status/${status}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Get my orders by status
  getMyOrdersByStatus: (status, token) => {
    return API.get(`/orders/my-orders/status/${status}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update order
  update: (orderId, orderData, token) => {
    return API.put(`/orders/${orderId}`, orderData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Update order status
  updateStatus: (orderId, status, token) => {
    return API.put(`/orders/${orderId}/status?status=${status}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Delete order
  delete: (orderId, token) => {
    return API.delete(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  // Cancel order
  cancel: (orderId, token) => {
    return API.put(`/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};