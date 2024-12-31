import axiosInstance from './axiosInstance'

const CACHE_KEY = 'app_settings'
const FAQ_CACHE_KEY = 'app_faqs'
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

    // Get FAQs with language support
    async getFAQs(language = 'en') {
        try {
            // Check cache first
            const cachedData = this.getCachedFAQs(language)
            if (cachedData) {
                return cachedData
            }

            // If no cache, fetch from API with language header
            const response = await axiosInstance.get('/FAQ', {
                headers: {
                    'Accept-Language': language, // Use Accept-Language header
                    'lang': language // Keep lang header as backup
                }
            })
            
            // Cache the response with language
            this.cacheFAQs(response.data, language)
            
            return response.data
        } catch (error) {
            console.error('Failed to fetch FAQs:', error)
            throw error
        }
    }

    // Cache FAQs data
    cacheFAQs(data, language) {
        const cacheData = {
            data,
            language,
            timestamp: new Date().getTime()
        }
        localStorage.setItem(`${FAQ_CACHE_KEY}_${language}`, JSON.stringify(cacheData))
    }

    // Get cached FAQs if they exist and are not expired
    getCachedFAQs(language) {
        try {
            const cached = localStorage.getItem(`${FAQ_CACHE_KEY}_${language}`)
            if (!cached) return null

            const { data, timestamp } = JSON.parse(cached)
            const now = new Date().getTime()

            // Check if cache is expired
            if (now - timestamp > CACHE_DURATION) {
                localStorage.removeItem(`${FAQ_CACHE_KEY}_${language}`)
                return null
            }

            return data
        } catch (error) {
            console.error('Error reading FAQ cache:', error)
            localStorage.removeItem(`${FAQ_CACHE_KEY}_${language}`)
            return null
        }
    }

    // Clear the FAQ cache
    clearFAQCache(language) {
        if (language) {
            localStorage.removeItem(`${FAQ_CACHE_KEY}_${language}`)
        } else {
            // Clear all language caches
            localStorage.removeItem(`${FAQ_CACHE_KEY}_en`)
            localStorage.removeItem(`${FAQ_CACHE_KEY}_ar`)
        }
    }
}

export const settingsAPI = new SettingsAPI()
export default settingsAPI 