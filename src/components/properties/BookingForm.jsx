import { useState } from 'react'
import { FiCalendar, FiClock } from 'react-icons/fi'
import bookingAPI from '../../services/bookingAPI'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

export default function BookingForm({
  language,
  property,
  onClose,
  isReschedule = false,
  initialDate = '',
  initialTime = '',
  onSubmit
}) {
  const [formData, setFormData] = useState({
    date: initialDate,
    time: initialTime
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0]

  // Get date 3 months from now for max date
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 3)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  // Available time slots
  const timeSlots = [
    '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00'
  ]

  const content = {
    en: {
      title: isReschedule ? 'Reschedule Tour' : 'Schedule a Tour',
      subtitle: isReschedule
        ? `Reschedule viewing for ${property?.title}`
        : `Book a viewing for ${property?.title}`,
      date: 'Select Date',
      time: 'Select Time',
      submit: isReschedule ? 'Reschedule Tour' : 'Schedule Tour',
      success: isReschedule ? 'Tour rescheduled successfully!' : 'Tour scheduled successfully!',
      successMessage: 'We will send you a confirmation shortly.',
      close: 'Close',
      error: {
        generic: 'Something went wrong. Please try again.',
        invalidDate: 'Please select a valid date and time.',
        pastDate: 'Selected date and time must be in the future.',
        unavailable: 'This time slot is not available. Please select another time.',
        ownerBooking: 'Property owners cannot book tours. Please switch to a renter account.'
      }
    },
    ar: {
      title: isReschedule ? 'إعادة جدولة الجولة' : 'جدولة جولة',
      subtitle: isReschedule
        ? `إعادة جدولة معاينة لـ ${property?.title}`
        : `حجز معاينة لـ ${property?.title}`,
      date: 'اختر التاريخ',
      time: 'اختر الوقت',
      submit: isReschedule ? 'إعادة جدولة الجولة' : 'جدولة الجولة',
      success: isReschedule ? 'تم إعادة جدولة الجولة بنجاح!' : 'تم جدولة الجولة بنجاح!',
      successMessage: 'سنرسل لك تأكيداً قريباً.',
      close: 'إغلاق',
      error: {
        generic: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        invalidDate: 'يرجى اختيار تاريخ ووقت صحيحين.',
        pastDate: 'يجب أن يكون التاريخ والوقت المحددين في المستقبل.',
        unavailable: 'هذا الموعد غير متاح. يرجى اختيار وقت آخر.',
        ownerBooking: 'لا يمكن لمالكي العقارات حجز جولات. يرجى التبديل إلى حساب مستأجر.'
      }
    }
  }

  const t = content[language]

  const validateDateTime = () => {
    // Validate date and time are selected
    if (!formData.date || !formData.time) {
      setError(t.error.invalidDate)
      return false
    }

    // Combine date and time into booking_date
    const bookingDate = new Date(`${formData.date}T${formData.time}:00`)
    const now = new Date()

    // Check if selected date/time is in the past
    if (bookingDate <= now) {
      setError(t.error.pastDate)
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error(
        language === 'ar'
          ? 'يجب تسجيل الدخول لحجز جولة'
          : 'Please login to book a tour'
      )
      // Show login/register options after a short delay
      setTimeout(() => {
        const shouldLogin = window.confirm(
          language === 'ar'
            ? 'هل تريد تسجيل الدخول أو إنشاء حساب جديد؟'
            : 'Would you like to login or create an account?'
        )
        if (shouldLogin) {
          onClose() // Close the booking form
          navigate('/login/renter')
        }
      }, 1000)
      return
    }

    // Check if user is an owner
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      if (userData?.type === 'owner') {
        toast.error(
          language === 'ar'
            ? 'لا يمكن لمالكي العقارات حجز جولات'
            : 'Property owners cannot book tours'
        )
        setTimeout(() => {
          const shouldSwitch = window.confirm(
            language === 'ar'
              ? 'هل تريد التبديل إلى حساب مستأجر؟'
              : 'Would you like to switch to a renter account?'
          )
          if (shouldSwitch) {
            onClose() // Close the booking form
            navigate('/login/renter')
          }
        }, 1000)
        return
      }
    } catch (error) {
      console.error('Error checking user type:', error)
    }

    if (!validateDateTime()) return

    setLoading(true)
    try {
      // Format the date and time as required by the API (YYYY-MM-DD HH:mm:ss)
      const bookingDate = new Date(`${formData.date}T${formData.time}:00`)
      const formattedDate = bookingDate.toISOString().slice(0, 19).replace('T', ' ')

      const bookingData = {
        unit_id: property.id,
        booking_date: formattedDate
      }

      if (isReschedule && onSubmit) {
        await onSubmit(bookingData)
      } else {
        const response = await bookingAPI.createBookingRequest(bookingData)
        if (response.success) {
          setIsSubmitted(true)
          toast.success(t.success)
          // Close form after success
          setTimeout(() => {
            onClose()
          }, 2000)
        } else {
          throw new Error(response.message || t.error.generic)
        }
      }
    } catch (err) {
      console.error('Booking error:', err)
      setError(err.message || t.error.generic)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">{t.success}</h3>
            <p className="text-gray-600">{t.successMessage}</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-2">{t.title}</h2>
            <p className="text-gray-600 mb-6">{t.subtitle}</p>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t.date}
                </label>
                <div className="relative">
                  <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    required
                    min={today}
                    max={maxDateStr}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value })
                      setError(null)
                    }}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t.time}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-2 text-sm border rounded-lg ${formData.time === time
                        ? 'bg-primary text-white border-primary'
                        : 'border-gray-300 hover:border-primary'
                        }`}
                      onClick={() => {
                        setFormData({ ...formData, time })
                        setError(null)
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !formData.date || !formData.time}
                className="w-full bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '...' : t.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
} 