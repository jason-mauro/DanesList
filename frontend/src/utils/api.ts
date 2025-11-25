// src/utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const signup = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}) => {
    console.log('Attempting signup to:', `${API_BASE_URL}/auth/signup`);
    
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    // No credentials: 'include' needed! ✅
    credentials: 'include',
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: "include",
    // No credentials: 'include' needed! ✅
    credentials: 'include',
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Store token in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const logout = async () => {
  try {
    // Optional: notify backend
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear localStorage regardless
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Example: Make authenticated requests
export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Attach token here
    },
    credentials: "include"
  });

  return response;
};