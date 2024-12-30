import axiosInstance from './axiosInstance'
import { normalizePhone, validateOTP } from '../utils/phoneUtils'
import { firebaseAuthService } from './firebaseAuthService'

const authAPI = {
  // Login (POST /api/v1/auth/login)
  login: async (credentials) => {
    try {
      const formattedPhone = normalizePhone(credentials.phone)

      console.log('🔄 API Login - Request:', {
        phone: formattedPhone,
        type: credentials.type,
      })

      // First, request OTP through Firebase
      const firebaseResponse = await firebaseAuthService.requestOTP(formattedPhone);
      
      if (!firebaseResponse.success) {
        throw new Error(firebaseResponse.error || 'Failed to send OTP');
      }

      // Store the Firebase session ID for later verification
      localStorage.setItem('firebase_session_id', firebaseResponse.sessionId);

      // We still need to validate the phone with backend first
      const formData = new FormData()
      formData.append('phone', formattedPhone)
      formData.append('type', credentials.type)
      formData.append('provider', 'firebase') // Add provider flag for backend
      formData.append('session_id', firebaseResponse.sessionId) // Send Firebase session ID

      const response = await axiosInstance.post('auth/login', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      })

      console.log('✅ API Login - Response:', response.data)

      // Check login success
      if (!response.data.success) {
        throw {
          success: false,
          status: response.data.status || 400,
          message: response.data.message || 'Login failed',
          errors: response.data.errors || [],
        }
      }

      return response.data
    } catch (error) {
      console.error('❌ API Login - Error:', error)
      throw {
        success: false,
        status: error.status || 500,
        message: error.message || 'Login failed',
        errors: error.errors || [],
      }
    }
  },

  // Verify OTP (POST /api/v1/auth/verify-otp)
  verifyOTP: async (verificationData) => {
    try {
      // Get the stored Firebase session ID
      const sessionId = localStorage.getItem('firebase_session_id');
      
      if (!sessionId) {
        throw new Error('Firebase session not found');
      }
      

      // First verify with Firebase
      const firebaseVerification = await firebaseAuthService.verifyOTP(
        sessionId,
        verificationData.otp
      );

      if (!firebaseVerification.success) {
        throw new Error(firebaseVerification.error || 'Firebase verification failed');
      }

      const formData = new FormData();
      formData.append('phone', verificationData.phone);
      formData.append('type', verificationData.type);
      formData.append('firebase_token', firebaseVerification.token);

      const response = await axiosInstance.post('auth/verify-otp', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw {
          success: false,
          status: response.data.status || 400,
          message: response.data.message || 'Verification failed',
        };
      }

      const token = response.data.data.token;
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      // Clean up Firebase session
      localStorage.removeItem('firebase_session_id');

      // Store the token and user data
      localStorage.setItem('token', bearerToken);
      if (response.data.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return {
        success: true,
        data: {
          token: bearerToken,
          user: response.data.data.user
        },
      };
    } catch (error) {
      // Clean up Firebase session on error
      localStorage.removeItem('firebase_session_id');

      if (error.response?.data) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Verification failed',
        };
      }
      throw {
        success: false,
        status: error.status || 500,
        message: error.message || 'Verification failed',
      };
    }
  },

  // Get Profile (POST /api/v1/auth/profile)
  getUserProfile: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          status: 401,
          message: 'Please login first',
        };
      } 

      const response = await axiosInstance.post('/auth/profile', null, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
        },
      });

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
          success: false,
          status: 401,
          message: 'Session expired. Please login again.',
        };
      }

      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to fetch profile',
      };
    }
  },

  // Register (POST /api/v1/auth/register)
  register: async (userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach((key) => {
        formData.append(key, userData[key]);
      });

      const response = await axiosInstance.post('auth/register', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data.success) {
        throw {
          success: false,
          status: response.data.status,
          message: response.data.message,
          errors: response.data.error || [],
        };
      }

      return response.data;
    } catch (error) {
      if (error.response?.data) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Registration failed',
          errors: error.response.data.error || [],
        };
      }
      throw {
        success: false,
        status: error.status || 500,
        message: error.message || 'Registration failed',
        errors: [],
      };
    }
  },

  // Logout (POST /api/v1/auth/logout)
  logout: async () => {
    try {
      console.log('🔄 Initiating logout process...')
      const token = localStorage.getItem('token')

      if (!token) {
        console.log('ℹ️ No token found, performing local cleanup only')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        return {
          success: true,
          message: 'Logged out successfully',
        }
      }

      const response = await axiosInstance.post('auth/logout', null, {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      })

      if (response.data.success) {
        console.log('🔑 Clearing stored credentials...')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }

      console.log('✅ API Logout - Response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API Logout - Error:', error)
      console.log('🧹 Cleaning up local storage despite API error')
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      throw {
        success: false,
        status: error.status,
        message: error.message || 'Logout failed',
        errors: error.errors || [],
      }
    }
  },

  // Update Profile (POST /api/v1/auth/update-profile)
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return {
          success: false,
          status: 401,
          message: 'Please login first',
        };
      }

      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });

      const response = await axiosInstance.post('auth/update-profile', formData, {
        headers: {
          Authorization: token,
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success && response.data.data) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return {
          success: false,
          status: 401,
          message: 'Session expired. Please login again.',
        };
      }

      return {
        success: false,
        status: error.response?.status || 500,
        message: error.response?.data?.message || 'Failed to update profile',
      };
    }
  },
}

export default authAPI
