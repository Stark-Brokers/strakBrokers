import axiosInstance from './axiosInstance'

const CACHE_KEY = 'app_settings'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

class SettingsAPI {
    async getSettings() {
        try {
            // Check cache first
            const cachedData = this.getCachedSettings()
            if (cachedData) {
                return cachedData
            }

            // If no cache, fetch from API
            const response = await axiosInstance.get('/setting')
            
            // Cache the response
            this.cacheSettings(response.data)
            
            return response.data
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            throw error
        }
    }

    // Cache the settings data
    cacheSettings(data) {
        const cacheData = {
            data,
            timestamp: new Date().getTime()
        }
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
    }

    // Get cached settings if they exist and are not expired
    getCachedSettings() {
        try {
            const cached = localStorage.getItem(CACHE_KEY)
            if (!cached) return null

            const { data, timestamp } = JSON.parse(cached)
            const now = new Date().getTime()

            // Check if cache is expired
            if (now - timestamp > CACHE_DURATION) {
                localStorage.removeItem(CACHE_KEY)
                return null
            }

            return data
        } catch (error) {
            console.error('Error reading cache:', error)
            localStorage.removeItem(CACHE_KEY)
            return null
        }
    }

    // Clear the settings cache
    clearCache() {
        localStorage.removeItem(CACHE_KEY)
    }

    // Helper method to get a specific setting value
    getSettingValue(settings, key) {
        if (!settings?.data?.general) return null
        const setting = settings.data.general.find(s => s.key === key)
        return setting?.value || null
    }

    // Helper method to get social media links
    getSocialMediaLinks(settings) {
        if (!settings?.data?.social_media) return []
        return settings.data.social_media
    }
}

export const settingsAPI = new SettingsAPI()
export default settingsAPI 