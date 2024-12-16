import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { FiPhone, FiLock } from 'react-icons/fi'
import { formatPhoneNumber, validateSaudiPhone } from '../../utils/phoneUtils'
import { toast } from 'react-hot-toast'

export default function Login({ language, userType }) {
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, verifyOTP } = useAuth()
  const navigate = useNavigate()

  const content = {
    en: {
      renterTitle: 'Renter Login',
      ownerTitle: 'Owner Login',
      phone: 'Phone Number',
      otp: 'Enter OTP',
      sendOtp: 'Send OTP',
      verifyOtp: 'Verify OTP',
      registerLink: "Don't have an account? Register",
      phoneRequired: 'Phone number is required',
      phoneInvalid: 'Please enter a valid phone number',
      otpRequired: 'OTP is required',
      otpInvalid: 'Please enter a valid OTP',
      resendOtp: 'Resend OTP',
      otpSent: 'OTP has been sent to your phone'
    },
    ar: {
      renterTitle: 'تسجيل دخول المستأجر',
      ownerTitle: 'تسجيل دخول المالك',
      phone: 'رقم الهاتف',
      otp: 'رمز التحقق',
      sendOtp: 'إرسال رمز التحقق',
      verifyOtp: 'تحقق من الرمز',
      registerLink: 'ليس لديك حساب سجل الآن',
      phoneRequired: 'رقم الهاتف مطلوب',
      phoneInvalid: 'الرجاء إدخال رقم هاتف صحيح',
      otpRequired: 'رمز التحقق مطلوب',
      otpInvalid: 'الرجاء إدخال رمز تحقق صحيح',
      resendOtp: 'إعادة إرسال الرمز',
      otpSent: 'تم إرسال رمز التحقق إلى هاتفك'
    }
  }

  const t = content[language]

  const validatePhone = () => {
    if (!phoneNumber) {
      setError(t.phoneRequired)
      return false
    }

    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (!validateSaudiPhone(formattedPhone)) {
      setError(t.phoneInvalid)
      return false
    }

    return true
  }

  const validateOtp = () => {
    if (!otp) {
      setError(t.otpRequired)
      return false
    }
    if (otp.length !== 6) {
      setError(t.otpInvalid)
      return false
    }
    return true
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!validatePhone()) return;

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      console.log('🔄 Sending login request:', {
        phone: formattedPhone,
        type: userType
      });

      const response = await login({
        phone: formattedPhone,
        type: userType
      });

      if (response.success) {
        setStep('otp');
        // Store data for OTP verification
        localStorage.setItem('auth_phone', formattedPhone);
        localStorage.setItem('auth_type', userType);
      } else {
        throw new Error(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError('');

      if (!validateOtp()) return;

      const formattedPhone = formatPhoneNumber(phoneNumber);
      const verificationData = {
        otp: otp,
        phone: formattedPhone,
        type: userType
      };

      const response = await verifyOTP(verificationData);

      if (response.success) {
        // Clean up temporary storage
        localStorage.removeItem('auth_phone');
        localStorage.removeItem('auth_type');

        // Show success message
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Logged in successfully');

        // Navigate to appropriate dashboard
        const redirectPath = `/${userType}/profile`;
        navigate(redirectPath);
      } else {
        setError(response.message || 'Verification failed');
        setOtp('');
      }
    } catch (err) {
      console.error('❌ Verification error:', err);
      setError(err.message || 'Verification failed');
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''
          }`}>
          {userType === 'renter' ? t.renterTitle : t.ownerTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={step === 'phone' ? handleSendOtp : handleVerifyOtp} className="space-y-6">
            {step === 'phone' ? (
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  {t.phone}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPhone className="text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+966 5XXXXXXXX"
                    dir="ltr"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  {t.otp}
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    dir="ltr"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLoading ? '...' : step === 'phone' ? t.sendOtp : t.verifyOtp}
              </button>
            </div>
          </form>

          {step === 'otp' && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setStep('phone')}
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                {t.resendOtp}
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to={`/register/${userType}`}
              className="text-sm font-medium text-primary hover:text-primary-hover"
            >
              {t.registerLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 