import { useState, useEffect } from 'react'
import { FiMessageCircle, FiPhone, FiMail, FiClock, FiLoader } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import contactUsAPI from '../services/contactUsAPI'
import settingsAPI from '../services/settingsAPI'

export default function CustomerService({ language }) {
    const [activeTab, setActiveTab] = useState('contact')
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [settings, setSettings] = useState(null)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.getSettings();
                setSettings(response);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };

        fetchSettings();
    }, []);

    const content = {
        en: {
            title: 'Customer Service',
            subtitle: 'We\'re here to help',
            contact: 'Contact Us',
            faq: 'FAQ',
            support: 'Support Hours',
            email: settingsAPI.getSettingValue(settings, 'support_email') || 'Loading...',
            phone: settingsAPI.getSettingValue(settings, 'support_phone') || 'Loading...',
            hours: '24/7 Support',
            form: {
                name: 'Full Name',
                email: 'Email',
                message: 'Message',
                submit: 'Send Message'
            },
            validation: {
                required: 'This field is required',
                email: 'Please enter a valid email address',
                minLength: 'This field must be at least {min} characters',
                maxLength: 'This field must not exceed {max} characters'
            },
            success: 'Message sent successfully!',
            error: 'Failed to send message. Please try again.',
            faqItems: [
                {
                    q: 'How do I schedule a property viewing?',
                    a: 'You can schedule a viewing by clicking the "Book a Tour" button on any property listing.'
                },
                {
                    q: 'What documents do I need for renting?',
                    a: 'Typically, you\'ll need valid ID, proof of income, and employment verification.'
                }
            ]
        },
        ar: {
            title: 'خدمة العملاء',
            subtitle: 'نحن هنا للمساعدة',
            contact: 'اتصل بنا',
            faq: 'الأسئلة الشائعة',
            support: 'ساعات الدعم',
            email: settingsAPI.getSettingValue(settings, 'support_email') || 'جاري التحمي��...',
            phone: settingsAPI.getSettingValue(settings, 'support_phone') || 'جاري التحميل...',
            hours: 'دعم على مدار الساعة',
            form: {
                name: 'الاسم الكامل',
                email: 'البريد الإلكتروني',
                message: 'الرسالة',
                submit: 'إرسال الرسالة'
            },
            validation: {
                required: 'هذا الحقل مطلوب',
                email: 'يرجى إدخال بريد إلكتروني صحيح',
                minLength: 'يجب أن يحتوي هذا الحقل على {min} أحرف على الأقل',
                maxLength: 'يجب ألا يتجاوز هذا الحقل {max} حرفًا'
            },
            success: 'تم إرسال الرسالة بنجاح!',
            error: 'فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
            faqItems: [
                {
                    q: 'كيف يمكنني جدولة معاينة العقار؟',
                    a: 'يمكنك جدولة معاينة بالنقر على زر "حجز جولة" في أي قائمة عقارية.'
                },
                {
                    q: 'ما المستندات المطلوبة للإيجار؟',
                    a: 'عادةً، ستحتاج إلى هوية سارية، وإثبات دخل، وتحقق من التوظيف.'
                }
            ]
        }
    }

    const t = content[language]

    const validateForm = () => {
        const newErrors = {}

        // Name validation
        if (!formData.full_name.trim()) {
            newErrors.full_name = t.validation.required
        } else if (formData.full_name.length < 3) {
            newErrors.full_name = t.validation.minLength.replace('{min}', '3')
        } else if (formData.full_name.length > 50) {
            newErrors.full_name = t.validation.maxLength.replace('{max}', '50')
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim()) {
            newErrors.email = t.validation.required
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = t.validation.email
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = t.validation.required
        } else if (formData.message.length < 10) {
            newErrors.message = t.validation.minLength.replace('{min}', '10')
        } else if (formData.message.length > 500) {
            newErrors.message = t.validation.maxLength.replace('{max}', '500')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        try {
            const response = await contactUsAPI.sendMessage(formData, language)

            if (response.success) {
                toast.success(t.success)
                // Reset form
                setFormData({
                    full_name: '',
                    email: '',
                    message: ''
                })
            } else {
                throw new Error(response.message || t.error)
            }
        } catch (error) {
            console.error('Contact form submission error:', error)

            if (error.status === 422 && error.errors) {
                // Validation errors from backend
                const backendErrors = {}
                error.errors.forEach(err => {
                    backendErrors[err.field] = err.messages
                })
                setErrors(backendErrors)
                toast.error(t.validation.error)
            } else {
                // Other errors
                toast.error(error.message || t.error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className={`text-3xl font-bold mb-4 ${language === 'ar' ? 'font-arabic' : ''
                    }`}>
                    {t.title}
                </h1>
                <p className="text-gray-600">{t.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiPhone className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.phone}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiMail className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.email}</h3>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <FiClock className="w-8 h-8 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{t.hours}</h3>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="flex border-b">
                    <button
                        className={`flex-1 px-6 py-3 text-center ${activeTab === 'contact'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600'
                            }`}
                        onClick={() => setActiveTab('contact')}
                    >
                        {t.contact}
                    </button>
                    <button
                        className={`flex-1 px-6 py-3 text-center ${activeTab === 'faq'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-600'
                            }`}
                        onClick={() => setActiveTab('faq')}
                    >
                        {t.faq}
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'contact' ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.name}
                                </label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.full_name
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                                        }`}
                                    disabled={loading}
                                />
                                {errors.full_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.email}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                                        }`}
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t.form.message}
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.message
                                        ? 'border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
                                        }`}
                                    disabled={loading}
                                ></textarea>
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading && <FiLoader className="w-4 h-4 animate-spin" />}
                                {t.form.submit}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {t.faqItems.map((item, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold mb-2">{item.q}</h3>
                                    <p className="text-gray-600">{item.a}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 