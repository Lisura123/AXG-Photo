const API_BASE_URL = "http://localhost:8070";

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
      }

      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token in localStorage
      if (data.data?.token) {
        localStorage.setItem("authToken", data.data.token);
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        // If token is invalid, remove it
        if (response.status === 401) {
          this.logout();
        }
        throw new Error(data.message || "Failed to get profile");
      }

      return data;
    } catch (error) {
      console.error("Get profile error:", error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      const token = this.getToken();

      if (token) {
        // Call backend logout endpoint to invalidate token server-side
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // Check if logout was successful
        const data = await response.json();
        if (!response.ok) {
          console.warn("Server logout failed:", data.message);
        }
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local cleanup even if server logout fails
    } finally {
      // Always remove token from localStorage and clear any stored user info
      localStorage.removeItem("authToken");

      // Clear any other auth-related items if they exist
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");

      // Clear session storage as well (if used)
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    }
  }

  // Get stored token
  getToken() {
    return localStorage.getItem("authToken");
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic token validation - check if it's not expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        // Token expired, remove it
        this.logout();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      this.logout();
      return false;
    }
  }

  // Get user info from token (without API call)
  getUserFromToken() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      return null;
    }
  }

  // Set authorization header for API requests
  getAuthHeaders() {
    const token = this.getToken();
    return token
      ? {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      : {
          "Content-Type": "application/json",
        };
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;
