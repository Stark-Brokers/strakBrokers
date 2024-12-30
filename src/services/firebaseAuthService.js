import { 
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut
} from 'firebase/auth';
import { auth, initializeRecaptcha } from './firebaseConfig';

class FirebaseAuthService {
  constructor() {
    this.auth = auth;
    console.log('🔥 Firebase Auth Service Initialized');
  }

  // Format phone number to E.164 format
  formatPhoneNumber(phone) {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add Saudi Arabia country code if not present
    if (!cleaned.startsWith('966')) {
      // If number starts with 0, remove it and add 966
      if (cleaned.startsWith('0')) {
        return `+966${cleaned.slice(1)}`;
      }
      // If number starts with 5, add 966
      if (cleaned.startsWith('5')) {
        return `+966${cleaned}`;
      }
      // If number already has country code without +, add +
      if (cleaned.startsWith('966')) {
        return `+${cleaned}`;
      }
    }
    
    // If number already has + and 966, return as is
    if (phone.startsWith('+966')) {
      return phone;
    }

    return `+966${cleaned}`;
  }

  // Request OTP without reCAPTCHA
  async requestOTP(phoneNumber) {
    try {
      console.group('📱 Firebase Phone Auth - Request OTP');
      console.log('Input Phone Number:', phoneNumber);
      
      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      console.log('Formatted Phone:', formattedPhone);

      // Initialize RecaptchaVerifier
      console.log('Initializing reCAPTCHA...');
      const recaptchaVerifier = initializeRecaptcha();
      console.log('reCAPTCHA Initialized:', !!recaptchaVerifier);

      // For testing purposes, if using the test number
      if (formattedPhone === '+966550427014') {
        console.log('🧪 Using Test Number Flow');
        const testResponse = {
          success: true,
          sessionId: 'test-verification-id',
          phone: formattedPhone,
          isTest: true
        };
        console.log('Test Response:', testResponse);
        console.groupEnd();
        return testResponse;
      }

      // Send verification code
      console.log('Sending verification code...');
      const confirmationResult = await signInWithPhoneNumber(
        this.auth,
        formattedPhone,
        recaptchaVerifier
      );

      console.log('Firebase Response:', {
        verificationId: confirmationResult.verificationId,
        confirmationResult: !!confirmationResult
      });

      // Store the confirmation result
      window.confirmationResult = confirmationResult;

      const response = {
        success: true,
        sessionId: confirmationResult.verificationId,
        phone: formattedPhone,
        isTest: false
      };

      console.log('Final Response:', response);
      console.groupEnd();
      return response;
    } catch (error) {
      console.group('❌ Firebase Phone Auth - Error');
      console.error('Error Details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.groupEnd();
      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }
  }

  // Verify OTP
  async verifyOTP(verificationId, otp) {
    try {
      console.group('🔐 Firebase Phone Auth - Verify OTP');
      console.log('Verification ID:', verificationId);
      console.log('OTP:', otp);

      // For testing purposes, if using the test number and verification ID
      if (verificationId === 'test-verification-id' && otp === '123456') {
        console.log('🧪 Using Test Verification Flow');
        const testResponse = {
          success: true,
          user: {
            phoneNumber: '+966550427014',
            uid: 'test-user-id'
          },
          token: 'test-firebase-token',
          isTest: true
        };
        console.log('Test Response:', testResponse);
        console.groupEnd();
        return testResponse;
      }

      if (!window.confirmationResult) {
        throw new Error('No verification session found. Please request OTP again.');
      }

      console.log('Confirming OTP...');
      // Verify the code
      const result = await window.confirmationResult.confirm(otp);
      
      // Get the Firebase ID token
      const idToken = await result.user.getIdToken();

      const response = {
        success: true,
        user: {
          phoneNumber: result.user.phoneNumber,
          uid: result.user.uid,
          metadata: result.user.metadata
        },
        token: idToken,
        isTest: false
      };

      // Clear the confirmation result
      window.confirmationResult = null;

      console.log('Verification Result:', {
        user: response.user,
        hasToken: !!response.token
      });
      console.groupEnd();
      return response;
    } catch (error) {
      console.group('❌ Firebase Phone Auth - Verification Error');
      console.error('Error Details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      console.groupEnd();

      // Clear the confirmation result on error
      window.confirmationResult = null;

      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      console.group('🚪 Firebase Auth - Sign Out');
      await signOut(this.auth);
      // Clear any remaining Firebase state
      window.confirmationResult = null;
      console.log('Sign out successful');
      console.groupEnd();
      return { success: true };
    } catch (error) {
      console.group('❌ Firebase Auth - Sign Out Error');
      console.error('Error Details:', {
        code: error.code,
        message: error.message
      });
      console.groupEnd();
      return {
        success: false,
        error: error.message,
        errorCode: error.code
      };
    }
  }
}

export const firebaseAuthService = new FirebaseAuthService(); 