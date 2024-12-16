import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://starkbrokers.com'

// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

class ContactUsAPI {
    /**
     * Send a contact form message
     * @param {Object} data - The contact form data
     * @param {string} data.full_name - The sender's full name
     * @param {string} data.email - The sender's email address
     * @param {string} data.message - The message content
     * @param {string} language - The current language (en/ar)
     * @returns {Promise} - The API response
     */
    async sendMessage(data, language = 'en') {
        try {
            const response = await api.post('/api/v1/contact-us/send', data, {
                headers: {
                    'Accept-Language': language
                }
            })
            return response.data
        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                const errorData = error.response.data
                throw {
                    status: error.response.status,
                    message: errorData.message || 'Failed to send message',
                    errors: errorData.error || [],
                    success: false
                }
            } else if (error.request) {
                // The request was made but no response was received
                throw {
                    status: 0,
                    message: 'Network error. Please check your connection.',
                    errors: [],
                    success: false
                }
            } else {
                // Something happened in setting up the request
                throw {
                    status: 0,
                    message: error.message || 'An unexpected error occurred',
                    errors: [],
                    success: false
                }
            }
        }
    }
}

export const contactUsAPI = new ContactUsAPI()
export default contactUsAPI 