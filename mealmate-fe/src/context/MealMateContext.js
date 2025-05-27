import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { authService } from "../services/authService";

// Create context
const MealMateContext = createContext();

// Custom hook to use the context
export const useMealMate = () => {
  const context = useContext(MealMateContext);
  if (!context) {
    throw new Error("useMealMate must be used within a MealMateProvider");
  }
  return context;
};

export const MealMateProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Initialize auth state
  useEffect(() => {
    checkAuth();
  }, []);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const userInfo = await authService.getCurrentUser();
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      // Store token in sessionStorage
      sessionStorage.setItem("token", response.accessToken);

      // Update user state
      const userInfo = {
        role: response.role,
        full_name: response.full_name,
        phone: response.phone,
      };
      setUser(userInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      message.success("Logged in successfully!");
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Register
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);

      // Store token in sessionStorage
      sessionStorage.setItem("token", response.accessToken);

      // Update user state
      const userInfo = {
        role: response.role,
        full_name: response.full_name,
        phone: response.phone,
      };
      setUser(userInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      message.success("Registration successful!");
      return response;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
      // Clear session storage and state
      sessionStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      message.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear everything on error
      sessionStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Google Login
  const handleGoogleLogin = () => {
    authService.googleLogin();
  };

  // Handle Google OAuth callback
  const handleGoogleCallback = async (token) => {
    try {
      if (!token) {
        throw new Error("No token received");
      }

      // Get user info using the token
      const userInfo = await authService.handleGoogleCallback(token);

      if (!userInfo) {
        throw new Error("No user info received");
      }

      // Update user state
      setUser(userInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      return userInfo;
    } catch (error) {
      console.error("Google callback error in context:", error);
      sessionStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = (newUserData) => {
    setUser((prev) => ({ ...prev, ...newUserData }));
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    loading,
    showLoginModal,
    setShowLoginModal,
    login,
    logout,
    register,
    handleGoogleLogin,
    handleGoogleCallback,
    updateUserProfile,
  };

  return (
    <MealMateContext.Provider value={value}>
      {!loading && children}
    </MealMateContext.Provider>
  );
};

export default MealMateContext;
