import axiosInstance from './axiosInstance'

const favoritesAPI = {
  // Get all favorites
  getFavorites: async () => {
    try {
      const response = await axiosInstance.get('/favorites')
      return response.data
    } catch (error) {
      console.error('Failed to get favorites:', error)
      throw error.response?.data || error
    }
  },

  // Add to favorites
  addToFavorites: async (unitId) => {
    try {
      const response = await axiosInstance.post(
        `/favorites/store?unit_id=${unitId}`
      )
      return response.data
    } catch (error) {
      console.error('Failed to add to favorites:', error)
      throw error.response?.data || error
    }
  },

  // Remove from favorites
  removeFromFavorites: async (unitId) => {
    try {
      const response = await axiosInstance.get(`/favorites/delete/${unitId}`)
      return response.data
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      throw error.response?.data || error
    }
  },
}

export default favoritesAPI
