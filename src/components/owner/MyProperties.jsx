import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiTrash2, FiEye, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

const PropertyCard = ({ property, onDelete, onStatusUpdate, translations }) => {
  const navigate = useNavigate();
  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  if (!property) return null;

  const handleEdit = () => {
    navigate(`/owner/properties/edit/${property.id}`);
  };

  // Group features by category
  const groupedFeatures = {
    amenities: property.features?.filter(f => f.id <= 19) || [],
    additionalFeatures: property.features?.filter(f => f.id >= 20) || []
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center p-4 border-b">
        <div className="relative w-24 h-24">
          <img
            src={property.images?.[0]?.url || 'https://placehold.co/100x100?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover rounded"
          />
          {property.images?.length > 1 && (
            <span className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
              +{property.images.length - 1}
            </span>
          )}
        </div>
        <div className="flex-1 ml-4">
          <h3 className="font-semibold text-lg">{property.title}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-2 py-0.5 rounded-full text-xs ${statusColor[property.status] || 'bg-gray-100 text-gray-800'}`}>
              {property.status}
            </span>
            <span>•</span>
            <span>{property.type}</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Specifications */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">{translations.area}</span>
            <p className="font-medium">{property.area} {translations.sqm}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">{translations.price || 'Price'}</span>
            <p className="font-medium">{property.price} {translations.currency}</p>
          </div>
          {property.number_bedroom > 0 && (
            <div>
              <span className="text-sm text-gray-500">{translations.bedrooms}</span>
              <p className="font-medium">{property.number_bedroom}</p>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div>
              <span className="text-sm text-gray-500">{translations.bathrooms}</span>
              <p className="font-medium">{property.number_bathroom}</p>
            </div>
          )}
        </div>

        {/* Features by Category */}
        {property.features?.length > 0 && (
          <div className="space-y-4">
            {/* Amenities */}
            {groupedFeatures.amenities.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{translations.categories.amenities}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupedFeatures.amenities.map(feature => (
                    <div
                      key={feature.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {translations.amenities[feature.name.toLowerCase()] || feature.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Features */}
            {groupedFeatures.additionalFeatures.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">{translations.categories.additionalFeatures}</h4>
                <div className="flex flex-wrap gap-2">
                  {groupedFeatures.additionalFeatures.map(feature => (
                    <div
                      key={feature.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {translations.amenities[feature.name.toLowerCase()] || feature.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="p-2 text-gray-600 hover:text-gray-900"
            title={translations.view}
          >
            <FiEye />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:text-blue-800"
            title={translations.edit}
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => onDelete(property.id)}
            className="p-2 text-red-600 hover:text-red-800"
            title={translations.delete}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyProperties({ language }) {
  const navigate = useNavigate()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15
  })

  const content = {
    en: {
      title: 'My Properties',
      addProperty: 'Add Property',
      noProperties: 'No properties found',
      deleteConfirm: 'Are you sure you want to delete this property?',
      view: 'View Property',
      edit: 'Edit',
      delete: 'Delete',
      area: 'Area',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      features: 'Features',
      currency: 'SAR',
      sqm: 'm²',
      price: 'Price',
      status: {
        available: 'Available',
        booked: 'Booked'
      },
      categories: {
        amenities: 'Amenities',
        additionalFeatures: 'Additional Features'
      },
      confirmStatusUpdate: 'Are you sure you want to change the status to',
      pagination: {
        showing: 'Showing',
        of: 'of',
        properties: 'properties',
        page: 'Page',
        next: 'Next',
        previous: 'Previous'
      },
      amenities: {
        'parking': 'Parking',
        'swimming pool': 'Swimming Pool',
        'gym': 'Gym',
        '24/7 security': '24/7 Security',
        'elevator': 'Elevator',
        'garden': 'Garden',
        'central ac': 'Central AC',
        'balcony': 'Balcony',
        'maid\'s room': 'Maid\'s Room',
        'storage room': 'Storage Room',
        'kitchen appliances': 'Kitchen Appliances',
        'internet': 'Internet',
        'satellite/cable tv': 'Satellite/Cable TV',
        'intercom': 'Intercom',
        'maintenance': 'Maintenance',
        'nearby mosque': 'Nearby Mosque',
        'shopping centers': 'Shopping Centers',
        'schools nearby': 'Schools Nearby',
        'pets allowed': 'Pets Allowed',
        'sea view': 'Sea View',
        'city view': 'City View',
        'garden view': 'Garden View',
        'street view': 'Street View',
        'mall view': 'Mall View'
      }
    },
    ar: {
      title: 'عقاراتي',
      addProperty: 'إضافة عقار',
      noProperties: 'لا توجد عقارات',
      deleteConfirm: 'هل أنت متأكد من حذف هذا العقار؟',
      view: 'عرض العقار',
      edit: 'تعديل',
      delete: 'حذف',
      area: 'المساحة',
      bedrooms: 'غرف النوم',
      bathrooms: 'الحمامات',
      features: 'المميزات',
      currency: 'ريال',
      sqm: 'م²',
      price: 'السعر',
      status: {
        available: 'متاح',
        booked: 'محجوز'
      },
      categories: {
        amenities: 'المرافق',
        additionalFeatures: 'مميزات إضافية'
      },
      confirmStatusUpdate: 'هل أنت متأكد من تغيير الحالة إلى',
      pagination: {
        showing: 'عرض',
        of: 'من',
        properties: 'عقار',
        page: 'صفحة',
        next: 'التالي',
        previous: 'السابق'
      },
      amenities: {
        'parking': 'موقف سيارات',
        'swimming pool': 'مسبح',
        'gym': 'صالة رياضية',
        '24/7 security': 'حراسة أمنية 24/7',
        'elevator': 'مصعد',
        'garden': 'حديقة',
        'central ac': 'تكييف مركزي',
        'balcony': 'شرفة',
        'maid\'s room': 'غرفة خادمة',
        'storage room': 'غرفة تخزين',
        'kitchen appliances': 'أجهزة مطبخ',
        'internet': 'إنترنت',
        'satellite/cable tv': 'قنوات فضائية/تلفاز',
        'intercom': 'اتصال داخلي',
        'maintenance': 'صيانة',
        'nearby mosque': 'مسجد قريب',
        'shopping centers': 'مراكز تسوق قريبة',
        'schools nearby': 'مدارس قريبة',
        'pets allowed': 'يسمح بالحيوانات الأليفة',
        'sea view': 'إطلالة بحرية',
        'city view': 'إطلالة على المدينة',
        'garden view': 'إطلالة على الحديقة',
        'street view': 'إطلالة على الشارع',
        'mall view': 'إطلالة على المول'
      }
    }
  }

  const t = content[language]

  useEffect(() => {
    fetchProperties()
  }, [pagination.currentPage])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getOwnerProperties(pagination.currentPage)
      console.log('Properties response:', response)

      if (response?.data) {
        setProperties(response.data.items)
        setPagination({
          currentPage: response.data.currentPage,
          lastPage: response.data.lastPage,
          total: response.data.total,
          perPage: response.data.perPage
        })
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: newPage }))
    }
  }

  const handleDelete = async (propertyId) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await propertyAPI.deleteProperty(propertyId)
        setProperties(properties.filter(p => p.id !== propertyId))
      } catch (error) {
        console.error('Failed to delete property:', error)
      }
    }
  }

  const handleBookingStatusUpdate = async (propertyId, currentStatus) => {
    const newStatus = currentStatus === 'available' ? 'booked' : 'available'
    const confirmMessage = `${t.confirmStatusUpdate} ${t.status[newStatus]}?`

    if (window.confirm(confirmMessage)) {
      try {
        await propertyAPI.updatePropertyStatus(propertyId, newStatus)
        setProperties(properties.map(property =>
          property.id === propertyId
            ? { ...property, is_booked: newStatus === 'booked' ? 1 : 0 }
            : property
        ))
      } catch (error) {
        console.error('Failed to update property status:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className={`text-xl md:text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
          {t.title}
        </h1>
        <button
          onClick={() => navigate('/owner/properties/add')}
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
        >
          {t.addProperty}
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>{t.noProperties}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onDelete={handleDelete}
                onStatusUpdate={handleBookingStatusUpdate}
                translations={t}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              {t.pagination.showing} {((pagination.currentPage - 1) * pagination.perPage) + 1}-
              {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} {t.pagination.of} {pagination.total} {t.pagination.properties}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <FiChevronLeft className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
              <span>
                {t.pagination.page} {pagination.currentPage} {t.pagination.of} {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
              >
                <FiChevronRight className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
} 