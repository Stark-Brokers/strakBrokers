import { useState, useEffect } from 'react'
import { FiCalendar, FiClock, FiMapPin, FiCheck, FiX, FiChevronDown, FiHome, FiUser, FiEye } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import bookingAPI from '../../services/bookingAPI'
import { toast } from 'react-hot-toast'

// Custom Saudi Riyal Icon component
const SaudiRiyalIcon = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-4 h-4 ${className}`}
  >
    <text x="5" y="17" fontSize="14" fontWeight="bold">﷼</text>
  </svg>
)

export default function TourRequests({ language }) {
  const navigate = useNavigate()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openStatusMenu, setOpenStatusMenu] = useState(null)
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
        setRequests(response.data.items)
        // Fetch details for each request
        response.data.items.forEach(request => {
          fetchRequestDetails(request.booking_id)
        })
      } else {
        setRequests([])
        toast.error('Invalid response format from server')
      }
    } catch (error) {
      console.error('Failed to fetch tour requests:', error)
      setError(error.message || 'Failed to fetch tour requests')
      toast.error(error.message || 'Failed to fetch tour requests')
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

  const content = {
    en: {
      title: 'Tour Requests',
      noRequests: 'No tour requests',
      changeStatus: 'Change Status',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        rejected: 'Rejected',
        cancelled: 'Cancelled',
        accepted: 'Accepted'
      },
      propertyInfo: 'Property Information',
      renterInfo: 'Renter Information',
      confirmStatusChange: 'Are you sure you want to change the status to',
      errorLoading: 'Error loading requests',
      tryAgain: 'Try Again',
      price: 'Price',
      type: 'Type',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      area: 'Area',
      currency: 'SAR',
      sqm: 'm²',
      viewProperty: 'View Property'
    },
    ar: {
      title: 'طلبات الجولات',
      noRequests: 'لا توجد طلبات جولات',
      changeStatus: 'تغيير الحالة',
      status: {
        pending: 'قيد الانتظار',
        confirmed: 'مؤكد',
        rejected: 'مرفوض',
        cancelled: 'ملغي',
        accepted: 'مقبول'
      },
      propertyInfo: 'معلومات العقار',
      renterInfo: 'معلومات المستأجر',
      confirmStatusChange: 'هل أنت متأكد أنك تريد تغيير الحالة إلى',
      errorLoading: 'خطأ في تحميل الطلبات',
      tryAgain: 'حاول مرة أخرى',
      price: 'السعر',
      type: 'النوع',
      bedrooms: 'غرف النوم',
      bathrooms: 'الحمامات',
      area: 'المساحة',
      currency: 'ريال',
      sqm: 'م²',
      viewProperty: 'عرض العقار'
    }
  }

  const t = content[language]

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'accepted':
        return <FiCheck className="w-4 h-4" />
      case 'rejected':
      case 'cancelled':
        return <FiX className="w-4 h-4" />
      default:
        return null
    }
  }

  const handleStatusChange = async (requestId, newStatus) => {
    const statusText = t.status[newStatus.toLowerCase()];
    const confirmMessage = language === 'ar'
      ? t.confirmStatusChange.replace('{status}', statusText)
      : `${t.confirmStatusChange} ${statusText}?`;

    if (window.confirm(confirmMessage)) {
      try {
        const response = await bookingAPI.changeBookingStatus(requestId, newStatus)
        if (response.success) {
          toast.success('Status updated successfully')
          setOpenStatusMenu(null)
          fetchTourRequests()
        }
      } catch (error) {
        console.error('Failed to update status:', error)
        toast.error(error.message || 'Failed to update status')
      }
    }
  }

  const getAvailableStatuses = (currentStatus) => {
    const allStatuses = ['pending', 'confirmed', 'rejected', 'accepted', 'cancelled']
    return allStatuses.filter(status => status !== currentStatus?.toLowerCase())
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center justify-center min-h-[200px] text-center">
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchTourRequests}
            className="px-4 py-2 bg-[#BE092B] text-white rounded-lg hover:bg-[#8a1328] transition-colors"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <div className="space-y-6">
        {!Array.isArray(requests) || requests.length === 0 ? (
          <p className="text-gray-500 text-center py-8">{t.noRequests}</p>
        ) : (
          requests.map(request => {
            const details = detailedRequests[request.booking_id]
            return (
              <div
                key={request.booking_id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Property Image */}
                  <div className="w-full md:w-40 h-40 md:h-auto">
                    <img
                      src={details?.unit?.images?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
                      alt={request.unit_title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Request Details */}
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{request.unit_title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <FiUser className="text-[#BE092B]" />
                          <span>{request.renter_name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          {t.status[request.status?.toLowerCase()] || request.status}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => setOpenStatusMenu(openStatusMenu === request.booking_id ? null : request.booking_id)}
                            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border rounded-md"
                          >
                            {t.changeStatus}
                            <FiChevronDown className={`transition-transform ${openStatusMenu === request.booking_id ? 'rotate-180' : ''}`} />
                          </button>

                          {openStatusMenu === request.booking_id && (
                            <div className="absolute right-0 mt-2 py-1 w-40 bg-white rounded-md shadow-lg z-50 border transform -translate-y-1">
                              {getAvailableStatuses(request.status).map(status => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(request.booking_id, status)}
                                  className="w-full text-start px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  {status === 'confirmed' || status === 'accepted' ? (
                                    <FiCheck className="w-3.5 h-3.5 text-green-600" />
                                  ) : status === 'rejected' || status === 'cancelled' ? (
                                    <FiX className="w-3.5 h-3.5 text-red-600" />
                                  ) : null}
                                  {t.status[status]}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-[#BE092B]" />
                        <span>
                          {new Date(request.booking_date).toLocaleDateString(
                            language === 'ar' ? 'ar-SA' : 'en-US'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiClock className="text-[#BE092B]" />
                        <span>
                          {new Date(request.booking_date).toLocaleTimeString(
                            language === 'ar' ? 'ar-SA' : 'en-US',
                            { hour: '2-digit', minute: '2-digit' }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-[#BE092B]" />
                        <span>{request.address}</span>
                      </div>
                    </div>

                    {details?.unit && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <SaudiRiyalIcon className="text-[#BE092B]" />
                          <span>{details.unit.price} {t.currency}</span>
                        </div>
                        {details.unit.number_bedroom > 0 && (
                          <div>
                            <span className="font-medium">{details.unit.number_bedroom}</span> {t.bedrooms}
                          </div>
                        )}
                        {details.unit.number_bathroom > 0 && (
                          <div>
                            <span className="font-medium">{details.unit.number_bathroom}</span> {t.bathrooms}
                          </div>
                        )}
                        {details.unit.area && (
                          <div>
                            <span className="font-medium">{details.unit.area}</span> {t.sqm}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          const details = detailedRequests[request.booking_id];
                          console.log('Details:', details);
                          console.log('Property ID:', details?.unit?.id);
                          if (details?.unit?.id) {
                            navigate(`/properties/${details.unit.id}`);
                          } else {
                            toast.error('Property details not found');
                          }
                        }}
                        className="p-2 text-gray-600 hover:text-gray-900"
                        title={t.viewProperty}
                      >
                        <FiEye />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
} 