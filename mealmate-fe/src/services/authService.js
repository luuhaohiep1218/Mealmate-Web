import { api, endpoints } from "../utils/axiosInstance";

// Get API URL from environment variables
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

export const authService = {
  // Login with email and password
  login: async (email, password) => {
    try {
      const response = await api.post(endpoints.auth.login, {
        email,
        password,
      });

      if (response.accessToken) {
        // Save token to sessionStorage
        sessionStorage.setItem("token", response.accessToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Register new account
  register: async (userData) => {
    try {
      const response = await api.post(endpoints.auth.register, userData);

      if (response.accessToken) {
        sessionStorage.setItem("token", response.accessToken);
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post(endpoints.auth.logout);
      sessionStorage.removeItem("token");
    } catch (error) {
      // Still remove session storage items even if API call fails
      sessionStorage.removeItem("token");
      throw error;
    }
  },

  // Google OAuth login
  googleLogin: () => {
    const callbackUrl = `${window.location.origin}/login-success`;
    window.location.href = `${API_URL}/auth/google?callback_url=${encodeURIComponent(
      callbackUrl
    )}`;
  },

  // Handle Google OAuth callback
  handleGoogleCallback: async (token) => {
    try {
      if (!token) {
        throw new Error("No token provided");
      }

      // Set token in sessionStorage
      sessionStorage.setItem("token", token);

      // Get user profile with the token
      const response = await api.get(endpoints.user.profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error("Failed to get user profile");
      }

      return {
        _id: response._id,
        full_name: response.full_name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        authProvider: response.authProvider,
        profile_picture: response.profile_picture,
        gender: response.gender,
        date_of_birth: response.date_of_birth,
        job: response.job,
        height: response.height,
        weight: response.weight,
        calorieGoal: response.calorieGoal,
        proteinGoal: response.proteinGoal,
        fatGoal: response.fatGoal,
        carbGoal: response.carbGoal,
      };
    } catch (error) {
      console.error("Error in handleGoogleCallback:", error);
      sessionStorage.removeItem("token");
      throw error;
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post(endpoints.auth.forgotPassword, { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return null;
      }

      // Fetch from API
      const response = await api.get(endpoints.user.profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response) {
        throw new Error("Failed to get user profile");
      }

      return {
        _id: response._id,
        full_name: response.full_name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        authProvider: response.authProvider,
        profile_picture: response.profile_picture,
        gender: response.gender,
        date_of_birth: response.date_of_birth,
        job: response.job,
        height: response.height,
        weight: response.weight,
        calorieGoal: response.calorieGoal,
        proteinGoal: response.proteinGoal,
        fatGoal: response.fatGoal,
        carbGoal: response.carbGoal,
      };
    } catch (error) {
      console.error("Error in getCurrentUser:", error);
      return null;
    }
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!sessionStorage.getItem("token");
  },
};
