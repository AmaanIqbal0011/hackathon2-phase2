/**
 * Authentication utilities to preserve existing flow
 */

// Helper function to decode JWT token
const decodeToken = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part of JWT)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Get JWT token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Set JWT token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

// Remove JWT token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // If we can't decode or no exp, consider expired
  }

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

// Get user info from localStorage (preferred) or decode from token as fallback
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    // First try to get user data from localStorage
    const userId = localStorage.getItem("userId");
    const userEmail = localStorage.getItem("userEmail");
    const userName = localStorage.getItem("userName");
    const userCreatedAt = localStorage.getItem("userCreatedAt");

    if (userId) {
      // User data is available in localStorage
      return {
        id: userId || "",
        email: userEmail || "",
        name: userName || "",
        created_at: userCreatedAt || new Date().toISOString(),
      };
    }

    // Fallback: decode from token if localStorage is not available
    const token = getAuthToken();
    if (token && !isTokenExpired(token)) {
      const decoded = decodeToken(token);

      if (decoded) {
        // Extract user info from the token payload
        // The backend sets "sub" to user.id in the token
        return {
          id: decoded.sub || "",
          email: "", // Email is not in the token, will be populated from API call
          name: "",  // Name is not in the token, will be populated from API call
          created_at: new Date().toISOString(),
        };
      }
    }
  }

  return null;
};

// Store user data in localStorage (to be called after login to supplement token data)
export const storeUserData = (userData: { id: string; email: string; name: string; created_at?: string }) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', userData.id);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userName', userData.name);
    if (userData.created_at) {
      localStorage.setItem('userCreatedAt', userData.created_at);
    }
  }
};

// Clear user data from localStorage
export const clearUserData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCreatedAt');
  }
};

// Fetch user profile from backend API and store in localStorage
export const fetchAndStoreUserProfile = async (): Promise<boolean> => {
  if (typeof window !== 'undefined') {
    const token = getAuthToken();

    if (!token) {
      return false;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'}/api/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();

        storeUserData({
          id: userData.id,
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          created_at: userData.created_at
        });

        return true;
      } else {
        console.error('Failed to fetch user profile:', response.status);
        return false;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return false;
    }
  }

  return false;
};

// Enhanced getCurrentUser that tries to fetch profile if not available locally
export const getCurrentUserWithProfile = async () => {
  let user = getCurrentUser();

  // If user data is not available locally, try to fetch it
  if (!user || !user.id) {
    const profileFetched = await fetchAndStoreUserProfile();
    if (profileFetched) {
      user = getCurrentUser();
    }
  }

  return user;
};

// Generic fetch wrapper with authentication headers
export const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  const authenticatedOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  return fetch(url, authenticatedOptions);
};