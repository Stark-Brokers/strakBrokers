import React, { useState, useEffect } from 'react'
import favoritesAPI from '../../services/favoritesAPI'
import { FiHeart, FiMaximize } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline, IoLocationOutline } from "react-icons/io5"
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../shared/LoadingSpinner'
import { toast } from 'react-hot-toast'

const translations = {
  en: {
    savedProperties: 'Saved Properties',
    from: 'From',
    sar: 'SAR',
    viewDetails: 'View Details',
    noSavedProperties: 'No saved properties yet',
    browseProperties: 'Browse Properties',
    viewAvailableProperties: 'View Available Properties',
    failedToLoad: 'Failed to load saved properties',
    removedFromFavorites: 'Property removed from favorites',
    failedToUpdate: 'Failed to update favorites',
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
    savedProperties: 'العقارات المحفوظة',
    from: 'من',
    sar: 'ريال',
    viewDetails: 'عرض التفاصيل',
    noSavedProperties: 'لا توجد عقارات محفوظة',
    browseProperties: 'تصفح العقارات',
    viewAvailableProperties: 'عرض العقارات المتاحة',
    failedToLoad: 'فشل تحميل العقارات المحفوظة',
    removedFromFavorites: 'تمت إزالة العقار من المفضلة',
    failedToUpdate: 'فشل تحديث المفضلة',
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

// Memoized Property Card Component
const PropertyCard = React.memo(({ property, onRemoveFromFavorites, language }) => {
  const navigate = useNavigate()
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const t = translations[language]

  const handleFavorite = async (e) => {
    e.stopPropagation()
    if (favoriteLoading) return

    try {
      setFavoriteLoading(true)
      await favoritesAPI.removeFromFavorites(property.id)
      onRemoveFromFavorites(property.id)
      toast.success(t.removedFromFavorites)
    } catch (error) {
      console.error('Failed to remove from favorites:', error)
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem('token')
        toast.error(
          language === 'ar'
            ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى'
            : 'Session expired. Please login again'
        )
        setTimeout(() => navigate('/login/renter'), 1500)
      } else {
        toast.error(t.failedToUpdate)
      }
    } finally {
      setFavoriteLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={property.images?.[0]?.url || 'https://placehold.co/600x400?text=No+Image'}
          alt={property.title}
          className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        />
        <button
          className={`absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          onClick={handleFavorite}
          disabled={favoriteLoading}
        >
          <FiHeart className="w-5 h-5 text-[#BE092B] fill-current" />
        </button>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold line-clamp-2 text-gray-800">
              {property.title}
            </h3>
          </div>
          {property.address && (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="flex items-center gap-1">
                <IoLocationOutline className="text-[#BE092B]" />
                <span>{property.address}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-4 text-gray-600">
          {property.number_bedroom > 0 && (
            <div className="flex items-center gap-1">
              <IoBedOutline className="text-[#BE092B]" />
              <span>{property.number_bedroom}</span>
            </div>
          )}
          {property.number_bathroom > 0 && (
            <div className="flex items-center gap-1">
              <IoWaterOutline className="text-[#BE092B]" />
              <span>{property.number_bathroom}</span>
            </div>
          )}
          {property.area && (
            <div className="flex items-center gap-1">
              <FiMaximize className="text-[#BE092B]" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>

        {property.features?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.features.slice(0, 3).map(feature => (
              <span
                key={feature.id}
                className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full border border-gray-100"
              >
                {t.amenities[feature.name.toLowerCase()] || feature.name}
              </span>
            ))}
            {property.features.length > 3 && (
              <span className="text-xs text-gray-500">
                +{property.features.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <span className="text-gray-500 text-sm">{t.from}</span>
            <p className="text-[#BE092B] font-bold text-xl">
              {property.price} {t.sar}
            </p>
          </div>
          <button
            onClick={() => navigate(`/properties/${property.id}`)}
            className="px-4 py-2 bg-[#BE092B]/90 text-white rounded-lg hover:bg-[#8a1328] transition-colors"
          >
            {t.viewDetails}
          </button>
        </div>
      </div>
    </div>
  )
})

PropertyCard.displayName = 'PropertyCard'

const SavedProperties = ({ language = 'en' }) => {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const t = translations[language]

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        setLoading(true)
        const response = await favoritesAPI.getFavorites()
        setFavorites(response.data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching saved properties:', err)
        setError(t.failedToLoad)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedProperties()
  }, [language])

  const handleRemoveFromFavorites = (unitId) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== unitId))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <p className="text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate('/properties')}
          className="text-theme hover:text-theme-dark transition-colors"
        >
          {t.viewAvailableProperties}
        </button>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-600">
        <FiHeart className="w-16 h-16 mb-4 text-gray-400" />
        <p className="text-lg mb-4">{t.noSavedProperties}</p>
        <button
          onClick={() => navigate('/properties')}
          className="text-theme hover:text-theme-dark transition-colors"
        >
          {t.browseProperties}
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className={`text-2xl font-semibold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.savedProperties}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onRemoveFromFavorites={handleRemoveFromFavorites}
            language={language}
          />
        ))}
      </div>
    </div>
  )
}

export default SavedProperties