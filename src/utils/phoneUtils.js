/**
 * Formats a phone number to the standard E.164 format for Saudi numbers
 * Accepts formats:
 * - 0550427014
 * - 550427014
 * - +966550427014
 * - 966550427014
 * Returns: +966XXXXXXXXX (with + prefix)
 */
export const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  
  // Remove leading zeros
  cleaned = cleaned.replace(/^0+/, '')
  
  // If number starts with 966, remove it
  if (cleaned.startsWith('966')) {
    cleaned = cleaned.substring(3)
  }
  
  // Add +966 prefix
  return `+966${cleaned}`;
}

/**
 * Validates if a phone number is a valid Saudi mobile number
 * Accepts all common formats
 */
export const validateSaudiPhone = (phone) => {
  // Should match +966 followed by 9 digits
  const saudiPhoneRegex = /^\+9665\d{8}$/
  return saudiPhoneRegex.test(phone)
}

/**
 * Formats a phone number for display in the UI
 * Input: any valid format
 * Output: +966 5X XXX XXXX
 */
export const formatPhoneForDisplay = (phone) => {
  try {
    // First normalize the number
    const normalized = formatPhoneNumber(phone)
    const cleaned = normalized.replace(/^\+966/, '')
    
    // Format as: +966 5X XXX XXXX
    return `+966 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 4)} ${cleaned.slice(4)}`
  } catch (error) {
    return phone // Return original if formatting fails
  }
}

/**
 * Normalizes any valid Saudi phone format to API format
 * Input: any valid format
 * Output: +966XXXXXXXXX (with + prefix)
 */
export const normalizePhone = (phone) => {
  return formatPhoneNumber(phone)
}

/**
 * Validates if a string is a valid OTP code
 */
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp)
}
