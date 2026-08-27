import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, mockLoginApi } from '../utils/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast() || {};

  useEffect(() => {
    const savedToken = localStorage.getItem('gst_auth_token');
    const savedUser = localStorage.getItem('gst_user_data');
    const loginTime = localStorage.getItem('gst_login_time');

    if (savedToken && savedUser && loginTime) {
      const elapsedMs = Date.now() - parseInt(loginTime, 10);
      const tenMinutesMs = 10 * 60 * 1000;

      if (elapsedMs < tenMinutesMs) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const timer = setTimeout(() => {
      if (showToast) {
        showToast("Your 10-minute security session has timed out. Please log in again.", "warning", "Session Expired");
      }
      logout();
    }, 10 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [token, showToast]);

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    if (data.success) {
      saveSession(data.token, data.user);
      if (showToast) {
        showToast(`Welcome back, ${data.user.name}! You are logged in.`, "success", "Login Successful");
      }
      return data;
    }
    throw new Error(data.message || 'Login failed.');
  };

  const register = async (formData) => {
    const data = await registerApi(formData);
    if (data.success) {
      saveSession(data.token, data.user);
      if (showToast) {
        showToast("Your taxpayer account has been created successfully.", "success", "Welcome to GST Saathi");
      }
      return data;
    }
    throw new Error(data.message || 'Registration failed.');
  };

  const mockLogin = async () => {
    const data = await mockLoginApi();
    if (data.success) {
      saveSession(data.token, data.user);
      if (showToast) {
        showToast("Logged in as Ramesh Kumar (Nagpur Hardware & Sanitary Store).", "success", "Instant Demo Session");
      }
      return data;
    }
    throw new Error(data.message || 'Mock login failed.');
  };

  const logout = () => {
    if (token && showToast) {
      showToast("You have been logged out of your session.", "info", "Logged Out");
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('gst_auth_token');
    localStorage.removeItem('gst_user_data');
    localStorage.removeItem('gst_login_time');
  };

  const saveSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('gst_auth_token', newToken);
    localStorage.setItem('gst_user_data', JSON.stringify(newUser));
    localStorage.setItem('gst_login_time', Date.now().toString());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: Boolean(user && token),
        loading,
        login,
        register,
        mockLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
