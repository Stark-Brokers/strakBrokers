import axiosInstance from './axiosInstance'

const bookingAPI = {
  // Create a new booking request
  createBookingRequest: async (bookingData) => {
    try {
      // Convert data to URLSearchParams for x-www-form-urlencoded format
      const formData = new URLSearchParams()
      formData.append('unit_id', bookingData.unit_id)
      formData.append('booking_date', bookingData.booking_date)

      const response = await axiosInstance.post(
        '/booking-requests/store',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get all booking requests for the authenticated user
  getBookingRequests: async () => {
    try {
      const response = await axiosInstance.get('/booking-requests')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get details of a specific booking request
  getBookingDetails: async (bookingId) => {
    try {
      const response = await axiosInstance.get(
        `/booking-requests/details/${bookingId}`
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get booking request status
  getBookingStatus: async () => {
    try {
      const response = await axiosInstance.get('/booking-requests/status')
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Change booking request status
  changeBookingStatus: async (bookingId, status) => {
    try {
      const response = await axiosInstance.post(
        '/booking-requests/change-status',
        {
          booking_id: bookingId,
          status,
        }
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Delete a booking request
  deleteBookingRequest: async (bookingId) => {
    try {
      const response = await axiosInstance.get(
        `/booking-requests/delete/${bookingId}`
      )
      return response.data
    } catch (error) {
      throw error.response?.data || error
    }
  },
}

export default bookingAPI
