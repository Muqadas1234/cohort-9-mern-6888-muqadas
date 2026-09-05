// Base API URL configuration for backend proxy or production environment
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

// Helper to construct request headers with authorization JWT token
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic fetch wrapper with error response handling
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'Something went wrong');
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.status) throw err;
    throw new Error(err.message || 'Network or server communication failure');
  }
};

// Authentication Endpoints
export const signupUser = (name, email, password) =>
  apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

export const loginUser = (email, password) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

// Notes CRUD Endpoints
export const fetchNotes = () => apiRequest('/notes');

export const createNoteApi = (title, content) =>
  apiRequest('/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });

export const updateNoteApi = (id, title, content) =>
  apiRequest(`/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  });

export const deleteNoteApi = (id) =>
  apiRequest(`/notes/${id}`, {
    method: 'DELETE',
  });
