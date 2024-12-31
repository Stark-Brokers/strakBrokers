import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../../services/api'
import { formatPhoneNumber, validateSaudiPhone } from '../../utils/phoneUtils'
import { toast } from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

export default function Register({ language, userType }) {
  const { user, logout, login } = useAuth()
  const [step, setStep] = useState('register') // 'register' or 'otp'
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    business_name: userType === 'owner' ? '' : undefined,
    business_license: userType === 'owner' ? '' : undefined,
    type: userType
  })
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const content = {
    en: {
      title: userType === 'renter' ? 'Renter Registration' : 'Owner Registration',
      name: 'Full Name',
      email: 'Email',
      phone: 'Phone Number',
      address: 'Address',
      businessName: 'Business Name',
      businessLicense: 'Business License Number',
      submit: 'Send OTP',
      otpTitle: 'Verify OTP',
      otpMessage: 'Please enter the verification code sent to your phone',
      otpPlaceholder: 'Enter OTP',
      verifyButton: 'Verify & Register',
      successMessage: 'Registration successful! Redirecting...',
      invalidOtp: 'Invalid OTP. Please try again.',
      resendOtp: 'Resend OTP',
      loginLink: 'Already have an account? Login',
      validationErrors: {
        fullNameRequired: 'Full name is required',
        emailRequired: 'Email is required',
        emailInvalid: 'Please enter a valid email address',
        phoneRequired: 'Phone number is required',
        phoneInvalid: 'Please enter a valid Saudi phone number',
        addressRequired: 'Address is required',
        businessNameRequired: 'Business name is required for owners',
        businessLicenseRequired: 'Business license is required for owners',
        phoneExists: 'This phone number is already registered'
      },
      placeholders: {
        name: 'Enter your full name',
        email: 'example@email.com',
        phone: '5XXXXXXXX',
        address: 'Enter your address',
        businessName: 'Enter your business name',
        businessLicense: 'Enter your business license number'
      },
      alreadyLoggedIn: 'You are already logged in',
      logoutMessage: 'To register a new account, please logout first',
      logoutButton: 'Logout',
      goBack: 'Go Back'
    },
    ar: {
      title: userType === 'renter' ? 'تسجيل مستأجر' : 'تسجيل مالك',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      address: 'العنوان',
      businessName: 'اسم الشركة',
      businessLicense: 'رقم الرخصة التجارية',
      submit: 'إرسال رمز التحقق',
      otpTitle: 'التحقق من الرمز',
      otpMessage: 'الراء إدخال رمز التحقق المرسل إلى هاتفك',
      otpPlaceholder: 'أدخل رمز التحقق',
      verifyButton: 'تحقق وتسجيل',
      successMessage: 'تم التسجيل بنجاح! جاري التحويل...',
      invalidOtp: 'رمز التحقق غير صحيح. حاول مرة أخرى.',
      resendOtp: 'إعادة إرسال الرمز',
      loginLink: 'لديك حساب بالفعل؟ تسجيل الدخول',
      validationErrors: {
        fullNameRequired: 'الاسم الكامل مطلوب',
        emailRequired: 'البريد الإلكتروني مطلوب',
        emailInvalid: 'يرجى إدخال بريد إلكتروني صحيح',
        phoneRequired: 'رقم الهاتف مطلوب',
        phoneInvalid: 'يرجى إدخال رقم هاتف سعودي صحيح',
        addressRequired: 'العنوان مطلوب',
        businessNameRequired: 'اسم الشركة مطلوب للملاك',
        businessLicenseRequired: 'رقم الرخصة التجارية مطلوب للملاك',
        phoneExists: 'رقم الهاتف مسجل بالفعل',
        phoneTaken: 'رقم الهاتف مستخدم بالفعل'
      },
      placeholders: {
        name: 'أدخل اسمك الكامل',
        email: 'example@email.com',
        phone: '5XXXXXXXX',
        address: 'أدخل عنوانك',
        businessName: 'أدخل اسم الشركة',
        businessLicense: 'أدخل رقم الرخصة التجارية'
      },
      alreadyLoggedIn: 'أنت مسجل الدخول بالفعل',
      logoutMessage: 'لتسجيل حساب جديد، يرجى تسجيل الخروج أولاً',
      logoutButton: 'تسجيل الخروج',
      goBack: 'رجوع'
    }
  }

  const t = content[language]

  const validateForm = () => {
    if (!formData.full_name?.trim()) {
      setError(t.validationErrors.fullNameRequired);
      return false;
    }
    if (!formData.email?.trim()) {
      setError(t.validationErrors.emailRequired);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t.validationErrors.emailInvalid);
      return false;
    }
    if (!formData.phone?.trim()) {
      setError(t.validationErrors.phoneRequired);
      return false;
    }
    const formattedPhone = formatPhoneNumber(formData.phone);
    if (!validateSaudiPhone(formattedPhone)) {
      setError(t.validationErrors.phoneInvalid);
      return false;
    }

    if (!formData.address?.trim()) {
      setError(t.validationErrors.addressRequired);
      return false;
    }
    if (userType === 'owner') {
      if (!formData.business_name?.trim()) {
        setError(t.validationErrors.businessNameRequired);
        return false;
      }
      if (!formData.business_license?.trim()) {
        setError(t.validationErrors.businessLicenseRequired);
        return false;
      }
    }
    return true;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formattedPhone = formatPhoneNumber(formData.phone);

      const registrationData = {
        ...formData,
        phone: formattedPhone,
        type: userType,
        language,
        ...(userType === 'owner' ? {
          business_name: formData.business_name,
          business_license: formData.business_license
        } : {})
      };

      console.log('🔄 Sending Registration Request:', registrationData);

      const response = await authAPI.register(registrationData);

      if (response.success) {
        setStep('otp');
        // Store data for OTP verification
        localStorage.setItem('auth_phone', formattedPhone);
        localStorage.setItem('auth_type', userType);
        toast.success(t.otpSent);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration Error:', error);

      // Handle validation errors from backend
      if (error.errors && error.errors.length > 0) {
        const translations = {
          // Field translations
          fields: {
            phone: language === 'ar' ? 'رقم الهاتف' : 'Phone',
            email: language === 'ar' ? 'البريد الإلكتروني' : 'Email',
            full_name: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
            address: language === 'ar' ? 'العنوان' : 'Address',
            business_name: language === 'ar' ? 'اسم الشركة' : 'Business Name',
            business_license: language === 'ar' ? 'رخصة العمل' : 'Business License'
          },
          // Error message translations
          messages: {
            'The Phone Number has already been taken.': 'رقم الهاتف مسجل مسبقاً',
            'The Email has already been taken.': 'البريد الإلكتروني مسجل مسبقاً',
            'The phone field is required.': 'رقم الهاتف مطلوب',
            'The email field is required.': 'البريد الإلكتروني مطلوب',
            'The full name field is required.': 'الاسم الكامل مطلوب',
            'The address field is required.': 'العنوان مطلوب',
            'The business name field is required.': 'اسم الشركة مطلوب',
            'The business license field is required.': 'رخصة العمل مطلوبة'
          }
        };

        const errorMessages = error.errors
          .map(err => {
            const fieldName = translations.fields[err.field] || err.field;
            const message = language === 'ar' ? translations.messages[err.messages] || err.messages : err.messages;
            return `${fieldName}: ${message}`;
          })
          .join('\n');

        setError(errorMessages);
      } else {
        setError(error.message || (language === 'ar' ? 'فشل في التسجيل' : 'Registration failed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateOtp()) return;

    setIsLoading(true);
    try {
      const storedPhone = localStorage.getItem('auth_phone');
      const storedType = localStorage.getItem('auth_type');

      const verificationData = {
        otp: otp,
        phone: storedPhone,
        type: storedType,
        language
      };

      console.log('🔄 Sending OTP Verification:', verificationData);

      const response = await authAPI.verifyOTP(verificationData);

      if (response.success) {
        // Clean up temporary storage
        localStorage.removeItem('auth_phone');
        localStorage.removeItem('auth_type');

        // Store token from registration response
        localStorage.setItem('token', response.data.token);

        // Store user data from registration response
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // Show success message
        toast.success(language === 'ar' ? 'تم التسجيل بنجاح' : 'Registration successful');

        // Navigate to profile
        navigate(`/${userType}/profile`);
      } else {
        throw new Error(response.message || t.validationErrors.verificationFailed);
      }
    } catch (error) {
      console.error('❌ OTP Verification Error:', error);
      if (error.errors && Object.keys(error.errors).length > 0) {
        const errorMessages = Object.values(error.errors).flat().join('\n');
        setError(errorMessages);
      } else {
        setError(error.message || t.validationErrors.verificationFailed);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutAndRedirect = async () => {
    try {
      await logout()
      toast.success(language === 'ar' ? 'تم تسجيل الخروج بنجاح' : 'Logged out successfully')
      // Reload the page to clear any cached states
      window.location.reload()
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error(language === 'ar' ? 'فشل تسجيل الخروج' : 'Logout failed')
    }
  }

  // If user is logged in, show logout message
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <h2 className={`text-xl font-bold text-gray-900 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.alreadyLoggedIn}
            </h2>
            <p className={`text-gray-600 mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.logoutMessage}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleLogoutAndRedirect}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200"
              >
                {t.logoutButton}
              </button>
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                {t.goBack}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className={`text-center text-3xl font-extrabold text-gray-900 ${language === 'ar' ? 'font-arabic' : ''
          }`}>
          {step === 'register' ? t.title : t.otpTitle}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-2 bg-red-50 text-red-500 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={step === 'register' ? handleSubmit : handleVerifyOtp} className="space-y-6">
            {step === 'register' ? (
              <>
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    {t.name} *
                  </label>
                  <input
                    id="full_name"
                    type="text"
                    required
                    placeholder={t.placeholders.name}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t.email} *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder={t.placeholders.email}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    {t.phone} *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">+966</span>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder={t.placeholders.phone}
                      className="pl-16 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.phone.replace(/^\+966/, '')}
                      onChange={(e) => {
                        const input = e.target.value.replace(/\D/g, '');
                        const phone = input.length > 0 ? `+966${input}` : '';
                        setFormData({ ...formData, phone });
                      }}
                      maxLength="9"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    {t.address} *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    placeholder={t.placeholders.address}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {userType === 'owner' && (
                  <>
                    <div>
                      <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                        {t.businessName} *
                      </label>
                      <input
                        id="business_name"
                        type="text"
                        required
                        placeholder={t.placeholders.businessName}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.business_name}
                        onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      />
                    </div>

                    <div>
                      <label htmlFor="business_license" className="block text-sm font-medium text-gray-700">
                        {t.businessLicense} *
                      </label>
                      <input
                        id="business_license"
                        type="text"
                        required
                        placeholder={t.placeholders.businessLicense}
                        className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.business_license}
                        onChange={(e) => setFormData({ ...formData, business_license: e.target.value })}
                      />
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading ? '...' : t.submit}
                  </button>
                </div>
              </>
            ) : (
              <div>
                <p className={`text-sm text-gray-600 mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
                  {t.otpMessage}
                </p>
                <input
                  type="text"
                  placeholder={t.otpPlaceholder}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary mb-4"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                />
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors duration-200 mb-4"
                >
                  {t.verifyButton}
                </button>
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="w-full text-gray-600 text-sm hover:text-gray-900"
                >
                  {t.resendOtp}
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to={`/login/${userType}`}
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                {t.loginLink}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}