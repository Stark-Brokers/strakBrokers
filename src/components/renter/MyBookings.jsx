import { useState } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX } from 'react-icons/fi'

export default function MyBookings({ language }) {
  const [bookings, setBookings] = useState([
    {
      id: 1,
      propertyTitle: 'Modern Apartment in Al Olaya',
      date: '2024-03-20',
      time: '14:00',
      status: 'confirmed', // confirmed, cancelled, completed
      location: 'Riyadh, Al Olaya District',
      price: '8,500',
      image: 'https://placehold.co/600x400/png/white?text=Property+Image'
    },
    {
      id: 2,
      propertyTitle: 'Luxury Villa with Pool',
      date: '2024-03-25',
      time: '11:00',
      status: 'pending',
      location: 'Riyadh, Al Nakheel',
      price: '25,000',
      image: 'https://placehold.co/600x400/png/white?text=Property+Image'
    },
    // Add more mock bookings as needed
  ])

  const content = {
    en: {
      title: 'My Bookings',
      upcoming: 'Upcoming Bookings',
      past: 'Past Bookings',
      noBookings: 'No bookings found',
      cancel: 'Cancel Booking',
      reschedule: 'Reschedule',
      status: {
        confirmed: 'Confirmed',
        pending: 'Pending',
        cancelled: 'Cancelled',
        completed: 'Completed'
      },
      price: 'Price',
      viewProperty: 'View Property'
    },
    ar: {
      title: 'حجوزاتي',
      upcoming: 'الحجوزات القادمة',
      past: 'الحجوزات السابقة',
      noBookings: 'لا توجد حجوزات',
      cancel: 'إلغاء الحجز',
      reschedule: 'إعادة جدولة',
      status: {
        confirmed: 'مؤكد',
        pending: 'قيد الانتظار',
        cancelled: 'ملغي',
        completed: 'مكتمل'
      },
      price: 'السعر',
      viewProperty: 'عرض العقار'
    }
  }

  const t = content[language]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheck className="w-4 h-4" />
      case 'cancelled':
        return <FiX className="w-4 h-4" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <div className="space-y-8">
        {/* Upcoming Bookings */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.upcoming}
          </h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500">{t.noBookings}</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="w-full md:w-48 h-48 md:h-auto">
                      <img
                        src={booking.image}
                        alt={booking.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{booking.propertyTitle}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {t.status[booking.status]}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-400" />
                          <span>{new Date(booking.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiClock className="text-gray-400" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiMapPin className="text-gray-400" />
                          <span>{booking.location}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-between items-center">
                        <div className="text-primary font-bold">
                          {booking.price} SAR
                        </div>
                        <div className="flex gap-3">
                          {booking.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => {/* Handle cancel */}}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                {t.cancel}
                              </button>
                              <button
                                onClick={() => {/* Handle reschedule */}}
                                className="text-sm text-primary hover:text-primary-hover"
                              >
                                {t.reschedule}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {/* Navigate to property */}}
                            className="text-sm text-gray-600 hover:text-gray-900"
                          >
                            {t.viewProperty}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Bookings */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.past}
          </h2>
          {/* Similar structure for past bookings */}
        </section>
      </div>
    </div>
  )
} 