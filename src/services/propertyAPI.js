import axiosInstance from './axiosInstance'

const getDailySeed = () => {
  const now = new Date()
  // Create a seed based on year, month, and day
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}

// Seeded random function
const seededRandom = (seed) => {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

const propertyAPI = {
  // Get all properties/units with filters
  getProperties: async (filters = {}) => {
    try {
      const response = await axiosInstance.get('/units', {
        params: filters,
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get property/unit types (apartment, villa, etc.)
  getPropertyTypes: async () => {
    try {
      const response = await axiosInstance.get('/units/type')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get categories with features
  getFeatures: async () => {
    try {
      const response = await axiosInstance.get('/categories')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error.response?.data || error
    }
  },

  // Get property/unit details
  getPropertyById: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/details/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create new property/unit
  createProperty: async (formData) => {
    try {
      const response = await axiosInstance.post('/units/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get owner's properties/units
  getOwnerProperties: async (page = 1) => {
    try {
      const response = await axiosInstance.get('/units/owner-units', {
        params: {
          page,
          per_page: 15,
        },
      })
      return response.data
    } catch (error) {
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === 'No data found'
      ) {
        return {
          success: true,
          status: 200,
          data: {
            items: [],
            total: 0,
            currentPage: 1,
            lastPage: 1,
            perPage: 15,
          },
        }
      }
      throw error.response?.data || error.message
    }
  },

  // Delete property/unit
  deleteProperty: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/delete/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Create property tour request
  createTourRequest: async (tourData) => {
    try {
      const formData = new FormData()
      Object.keys(tourData).forEach((key) => {
        formData.append(key, tourData[key])
      })

      const response = await axiosInstance.post(
        '/booking-requests/store',
        formData
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get tour requests
  getTourRequests: async () => {
    try {
      const response = await axiosInstance.get('/booking-requests')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Update tour request status
  updateTourRequest: async (requestId, status) => {
    try {
      const response = await axiosInstance.post(
        '/booking-requests/change-status',
        {
          booking_id: requestId,
          status,
        }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  // Get available properties with filters
  getAvailableProperties: async (params) => {
    try {
      const queryString =
        params instanceof URLSearchParams
          ? params.toString()
          : new URLSearchParams(params).toString()

      const response = await axiosInstance.get(`/units?${queryString}`)
      return response.data
    } catch (error) {
      if (
        error.response?.status === 404 &&
        error.response?.data?.message === 'No data found'
      ) {
        return {
          success: true,
          status: 200,
          data: {
            items: [],
            total: 0,
            currentPage: 1,
            lastPage: 1,
            perPage: 15,
          },
        }
      }
      throw error
    }
  },

  // Get property details
  getPropertyDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/units/details/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get property filters (types, features, etc.)
  getPropertyFilters: async () => {
    try {
      const [typesResponse, featuresResponse] = await Promise.all([
        axiosInstance.get('/units/type'),
        axiosInstance.get('/categories'),
      ])
      return {
        types: typesResponse.data,
        features: featuresResponse.data,
      }
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    try {
      const response = await axiosInstance.get('/units', {
        params: {
          status: 'accepted',
          per_page: 3, // Limit to 3 items directly from API
        },
      })

      const properties = response?.data?.data?.items || []

      if (properties.length === 0) {
        return { success: true, data: [] }
      }

      // Get today's seed
      const dailySeed = getDailySeed()

      // Sort properties using the daily seed - only sort what we need
      const selectedProperties = properties
        .sort((a, b) => {
          const randomA = seededRandom(parseInt(dailySeed + a.id))
          const randomB = seededRandom(parseInt(dailySeed + b.id))
          return randomA - randomB
        })
        .slice(0, 3)
        .map((property) => ({
          ...property,
          isNew:
            new Date(property.created_at) >
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          isFeatured: true,
        }))

      return {
        success: true,
        data: selectedProperties,
      }
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update property/unit
  updateProperty: async (id, formData) => {
    try {
      // Remove Content-Type header to let browser set it with boundary for FormData
      const response = await axiosInstance.post(
        `/units/update/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
          // Add timeout specifically for file uploads
          timeout: 60000, // 60 seconds for file uploads
        }
      )
      return response.data
    } catch (error) {
      console.error('Update property error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      })
      throw error.response?.data || error.message
    }
  },
}

export default propertyAPI
