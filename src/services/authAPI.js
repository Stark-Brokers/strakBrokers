import axiosInstance from './axiosInstance'
import { normalizePhone } from '../utils/phoneUtils'
// import { firebaseAuthService } from './firebaseAuthService' // Commented for now

const authAPI = {
  // Login (POST /api/v1/auth/login)
  login: async (credentials) => {
    try {
      const formattedPhone = normalizePhone(credentials.phone)

      console.log('🔄 API Login - Request:', {
        phone: formattedPhone,
        type: credentials.type,
      })

      // Using direct API call without Firebase
      const formData = new FormData()
      formData.append('phone', formattedPhone)
      formData.append('type', credentials.type)

      const response = await axiosInstance.post('auth/login', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'lang': credentials.language || 'en'
        },
      })

      console.log('✅ API Login - Response:', response.data)

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
      if (error.response?.data) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Login failed',
          errors: error.response.data.errors || [],
        }
      }
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
      const formData = new FormData();
      formData.append('phone', verificationData.phone);
      formData.append('type', verificationData.type);
      formData.append('otp', verificationData.otp);

      const response = await axiosInstance.post('auth/verify-otp', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'lang': verificationData.language || 'en'
        },
      });

      if (!response.data.success) {
        throw {
          success: false,
          status: response.data.status || 400,
          message: response.data.message || 'Verification failed',
          errors: response.data.errors || [],
        };
      }

      const token = response.data.data.token;
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

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
      console.error('❌ Verification Error:', error);
      if (error.response?.data) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Verification failed',
          errors: error.response.data.errors || [],
        };
      }
      throw {
        success: false,
        status: error.status || 500,
        message: error.message || 'Verification failed',
        errors: [],
      };
    }
  },

  // Register (POST /api/v1/auth/register)
  register: async (userData) => {
    try {
      const formData = new FormData();
      
      // Required fields
      formData.append('full_name', userData.full_name);
      formData.append('phone', userData.phone);
      formData.append('email', userData.email);
      formData.append('type', userData.type);
      formData.append('address', userData.address);

      // Optional fields for owner type
      if (userData.type === 'owner') {
        formData.append('business_name', userData.business_name);
        formData.append('business_license', userData.business_license);
      }

      const response = await axiosInstance.post('auth/register', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'lang': userData.language || 'en'
        },
      });

      console.log('✅ Registration Response:', response.data);

      
      if (!response.data.success) {
        throw {
          success: false,
          status: response.data.status,
          message: response.data.message,
          errors: response.data.error || [],
          language: userData.language
        };
      }

      return response.data;
    } catch (error) {
      console.error('❌ Registration Error:', error);
      
      // Handle the new error format
      if (error.response?.data?.error) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Validation failed',
          errors: error.response.data.error || [],
          language: userData.language
        };
      }
      
      if (error.response?.data) {
        throw {
          success: false,
          status: error.response.data.status || error.response.status,
          message: error.response.data.message || 'Registration failed',
          errors: error.response.data.errors || [],
          language: userData.language
        };
      }
      
      throw {
        success: false,
        status: error.status || 500,
        message: error.message || 'Registration failed',
        errors: [],
        language: userData.language
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
