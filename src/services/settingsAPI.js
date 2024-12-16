import axiosInstance from './axiosInstance'

class SettingsAPI {
    async getSettings() {
        try {
            const response = await axiosInstance.get('/setting')
            return response.data
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            throw error
        }
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