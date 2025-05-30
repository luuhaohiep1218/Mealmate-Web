import React, { createContext, useContext, useState, useEffect } from "react";
import { message } from "antd";
import { authService } from "../services/authService";
import { api, endpoints } from "../utils/axiosInstance";

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
      const storedUserInfo = sessionStorage.getItem("userInfo");

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (storedUserInfo) {
        // Nếu có thông tin user trong sessionStorage, sử dụng nó
        const userInfo = JSON.parse(storedUserInfo);
        setUser(userInfo);
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // Nếu không có thông tin user trong sessionStorage, gọi API
      const userInfo = await authService.getCurrentUser();
      if (userInfo) {
        setUser(userInfo);
        setIsAuthenticated(true);
        // Lưu thông tin user vào sessionStorage
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        setUser(null);
        setIsAuthenticated(false);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userInfo");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
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

      // Lấy thông tin user profile đầy đủ từ API
      const userProfile = await api.get(endpoints.user.profile);

      if (!userProfile) {
        throw new Error("Failed to get user profile");
      }

      // Update user state with complete profile
      const userInfo = {
        _id: userProfile._id,
        full_name: userProfile.full_name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        profile_picture: userProfile.profile_picture,
        authProvider: userProfile.authProvider,
      };

      // Update context and sessionStorage
      setUser(userInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

      message.success("Đăng nhập thành công!");
      return userInfo;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
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
        throw new Error("No token provided");
      }

      // Set token in sessionStorage
      sessionStorage.setItem("token", token);

      // Get user profile with the token
      const response = await authService.handleGoogleCallback(token);

      if (!response) {
        throw new Error("Failed to get user profile");
      }

      // Lấy thông tin user profile từ API
      const userProfile = await api.get(endpoints.user.profile);

      if (!userProfile) {
        throw new Error("Failed to get user profile");
      }

      // Create user info object with profile picture
      const userInfo = {
        _id: userProfile._id,
        full_name: userProfile.full_name,
        email: userProfile.email,
        phone: userProfile.phone,
        role: userProfile.role,
        authProvider: userProfile.authProvider,
        profile_picture: userProfile.profile_picture,
      };

      // Update context state
      setUser(userInfo);
      setIsAuthenticated(true);
      setShowLoginModal(false);

      // Save user info to sessionStorage
      sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

      return userInfo;
    } catch (error) {
      console.error("Error in handleGoogleCallback:", error);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
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
    setUser,
    isAuthenticated,
    setIsAuthenticated,
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
