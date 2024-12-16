import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiTrash2, FiEye } from 'react-icons/fi'
import bookingAPI from '../../services/bookingAPI'

export default function Tours({ language }) {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [detailedRequests, setDetailedRequests] = useState({})

  useEffect(() => {
    fetchTourRequests()
  }, [])

  const fetchTourRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bookingAPI.getBookingRequests()

      if (response?.success && response?.data?.items) {
        console.log('Tour requests:', response.data.items)
        setRequests(response.data.items)
        response.data.items.forEach(request => {
          fetchRequestDetails(request.booking_id)
        })
      } else {
        setRequests([])
      }
    } catch (error) {
      console.error('Failed to fetch tour requests:', error)
      setError(t.errorFetching)
    } finally {
      setLoading(false)
    }
  }

  const fetchRequestDetails = async (bookingId) => {
    try {
      const response = await bookingAPI.getBookingDetails(bookingId)
      if (response?.success && response?.data) {
        setDetailedRequests(prev => ({
          ...prev,
          [bookingId]: response.data
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch details for booking ${bookingId}:`, error)
    }
  }

  const handleDelete = async (bookingId) => {
    if (!window.confirm(t.confirmDelete)) {
      return;
    }

    try {
      const response = await bookingAPI.deleteBookingRequest(bookingId);

      if (response.success) {
        setRequests(prevRequests => prevRequests.filter(request => request.booking_id !== bookingId));
      } else {
        throw new Error(response.message || t.deleteError);
      }
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleViewProperty = (unitId) => {
    navigate(`/properties/${unitId}`)
  }

  const content = {
    en: {
      title: 'My Tour Requests',
      noRequests: 'No tour requests found',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
        cancelled: 'Cancelled'
      },
      actions: 'Actions',
      cancel: 'Cancel',
      viewProperty: 'View Property',
      confirmDelete: 'Are you sure you want to cancel this tour request?',
      deleteSuccess: 'Tour request cancelled successfully',
      deleteError: 'Failed to cancel tour request',
      errorFetching: 'Failed to fetch tour requests'
    },
    ar: {
      title: 'طلبات جولاتي',
      noRequests: 'لا توجد طلبات جولات',
      status: {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        rejected: 'مرفوض',
        cancelled: 'ملغي'
      },
      actions: 'الإجراءات',
      cancel: 'إلغاء',
      viewProperty: 'عرض العقار',
      confirmDelete: 'هل أنت متأكد من رغبتك في إلغاء طلب الجولة هذا؟',
      deleteSuccess: 'تم إلغاء طلب الجولة بنجاح',
      deleteError: 'فشل في إلغاء طلب الجولة',
      errorFetching: 'فشل في تحميل طلبات الجولات'
    }
  }

  const t = content[language]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheck className="w-4 h-4" />
      case 'rejected':
      case 'cancelled':
        return <FiX className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.noRequests}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => {
            const details = detailedRequests[request.booking_id]
            const bookingDate = new Date(request.booking_date)

            return (
              <div
                key={request.booking_id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="w-full md:w-40 h-40 md:h-auto">
                    <img
                      src={details?.unit?.images?.[0]?.url || 'https://placehold.co/600x400/png/white?text=Property+Image'}
                      alt={details?.unit?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{details?.unit?.title || 'Loading...'}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {t.status[request.status]}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" />
                        <span>{new Date(bookingDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-gray-400" />
                        <span>{new Date(bookingDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-gray-400" />
                        <span>{details?.unit?.address || 'Loading...'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap justify-between items-center mt-2 pt-2 border-t border-gray-100">
                      <div className="text-primary font-bold text-sm">
                        {details?.unit?.price} SAR
                      </div>
                      <div className="flex gap-3">
                        {request.status !== 'cancelled' && request.status !== 'rejected' && (
                          <button
                            onClick={() => handleDelete(request.booking_id)}
                            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                          >
                            <FiTrash2 className="w-4 h-4" />
                            {t.cancel}
                          </button>
                        )}
                        <button
                          onClick={() => handleViewProperty(request.unit_id)}
                          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                        >
                          <FiEye className="w-4 h-4" />
                          {t.viewProperty}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
} 
