// src/utils/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL;

// SIGNUP
export const signup = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}) => {

  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',     // send/receive cookies
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  localStorage.setItem("userId", data._id);
  localStorage.setItem("username", data.username)
  localStorage.setItem("user_avatar", data.avatar);
  localStorage.setItem("isAdmin", "false");

  return data; // user info, but no token
};

export const AdminSignup = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string;
}) => {

  const response = await fetch(`${API_BASE_URL}/auth/adminSignup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',     // send/receive cookies
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Signup failed');
  }

  localStorage.setItem("userId", data._id);
  localStorage.setItem("username", data.username)
  localStorage.setItem("user_avatar", data.avatar);

  return data; // user info, but no token
};


// LOGIN
export const login = async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',      // IMPORTANT: cookie arrives here
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  localStorage.setItem("userId", data._id);
  localStorage.setItem("username", data.username)
  localStorage.setItem("user_avatar", data.avatar);
  return data;
};


// LOGOUT
export const logout = async () => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include', // ensure cookie removal
  });
};


// CHECK AUTH FROM BACKEND
export const isAuthenticated = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: 'include',
  });

  return response.ok; // true if authenticated, false if not
};


// FOR CALLING PROTECTED ROUTES
export const makeAuthenticatedRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'include', // send cookie auth
  });

  return response;
};
