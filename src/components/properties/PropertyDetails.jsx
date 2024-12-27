import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import favoritesAPI from '../../services/favoritesAPI'
import { FiMaximize, FiMapPin, FiHeart, FiArrowLeft } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline } from "react-icons/io5"
import { GoogleMap, MarkerF } from '@react-google-maps/api'
import { defaultCenter, mapOptions } from '../../config/googleMapsConfig'
import BookingForm from './BookingForm'
import { Loader } from '@googlemaps/js-api-loader'
import {
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaShieldAlt,
  FaBuilding,
  FaTree,
  FaSnowflake,
  FaUmbrella,
  FaUser,
  FaBox,
  FaBlender,
  FaWifi,
  FaSatellite,
  FaPhone,
  FaTools,
  FaMosque,
  FaShoppingCart,
  FaGraduationCap,
  FaPaw,
  FaWater,
  FaCity,
  FaLeaf,
  FaRoad,
  FaStore
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const content = {
  en: {
    loading: 'Loading property details...',
    error: 'Failed to load property details',
    description: 'Description',
    features: 'Features',
    amenities: 'Amenities',
    location: 'Location',
    bookTour: 'Book a Tour',
    saveToFavorites: 'Save to Favorites',
    removeFromFavorites: 'Remove from Favorites',
    currency: 'SAR',
    sqm: 'm²',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    area: 'Area',
    propertyTypes: {
      apartment: 'Apartment',
      villa: 'Villa',
      office: 'Office',
      shop: 'Shop',
      land: 'Land'
    },
    categories: {
      'Amenities': 'Amenities',
      'Additional Features': 'Additional Features'
    },
    features_en: {
      1: 'Parking',
      2: 'Swimming Pool',
      3: 'Gym',
      4: '24/7 Security',
      5: 'Elevator',
      6: 'Garden',
      7: 'Central AC',
      8: 'Balcony',
      9: "Maid's Room",
      10: 'Storage Room',
      11: 'Kitchen Appliances',
      12: 'Internet',
      13: 'Satellite/Cable TV',
      14: 'Intercom',
      15: 'Maintenance',
      16: 'Nearby Mosque',
      17: 'Shopping Centers',
      18: 'Schools Nearby',
      19: 'Pets Allowed',
      20: 'Sea View',
      21: 'City View',
      22: 'Garden View',
      23: 'Street View',
      24: 'Mall View'
    },
    propertyLocation: 'Property Location'
  },
  ar: {
    loading: 'جاري تحميل تفاصيل العقار...',
    error: 'فشل في تحميل تفاصي العقار',
    description: 'الوصف',
    features: 'المميزات',
    amenities: 'المرافق',
    location: 'الموقع',
    bookTour: 'حجز جولة',
    saveToFavorites: 'حفظ في المفضلة',
    removeFromFavorites: 'إزالة من المفضلة',
    currency: 'ريال',
    sqm: 'م²',
    bedrooms: 'أرف النوم',
    bathrooms: 'دورات المياه',
    area: 'المساحة',
    propertyTypes: {
      apartment: 'شقة',
      villa: 'فيلا',
      office: 'مكتب',
      shop: 'محل',
      land: 'أرض'
    },
    categories: {
      'Amenities': '��لمرافق',
      'Additional Features': 'مميزات إضافية'
    },
    features_ar: {
      1: 'موقف سيارات',
      2: 'مسبح',
      3: 'صالة رياضية',
      4: 'أمن 24/7',
      5: 'مصعد',
      6: 'حديقة',
      7: 'تكييف مركزي',
      8: 'شرفة',
      9: 'غرفة خادمة',
      10: 'غرفة تخزين',
      11: 'أجهزة مطبخ',
      12: 'خدمة إنترنت',
      13: 'قنوات فضائية',
      14: 'اتصال داخلي',
      15: 'صيانة',
      16: 'مسجد قريب',
      17: 'مراكز تسوق قريبة',
      18: 'مدارس قريبة',
      19: 'يسمح بالحيوانات',
      20: 'إطلالة بحرية',
      21: 'إطلالة على المدينة',
      22: 'إطلالة على الحديقة',
      23: 'إطلالة على الطريق',
      24: 'إطلالة على المول'
    },
    propertyLocation: 'موقع العقار'
  }
}

// Feature icons mapping
const featureIcons = {
  1: FaParking,      // Parking
  2: FaSwimmingPool, // Swimming Pool
  3: FaDumbbell,     // Gym
  4: FaShieldAlt,    // 24/7 Security
  5: FaBuilding,     // Elevator
  6: FaTree,         // Garden
  7: FaSnowflake,    // Central AC
  8: FaUmbrella,     // Balcony
  9: FaUser,         // Maid's Room
  10: FaBox,         // Storage Room
  11: FaBlender,     // Kitchen Appliances
  12: FaWifi,        // Internet
  13: FaSatellite,   // Satellite/Cable TV
  14: FaPhone,       // Intercom
  15: FaTools,       // Maintenance
  16: FaMosque,      // Nearby Mosque
  17: FaShoppingCart, // Shopping Centers
  18: FaGraduationCap, // Schools Nearby
  19: FaPaw,         // Pets Allowed
  20: FaWater,       // Sea View
  21: FaCity,        // City View
  22: FaLeaf,        // Garden View
  23: FaRoad,        // Street View
  24: FaStore        // Mall View
};

export default function PropertyDetails({ language }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [categories, setCategories] = useState([])
  const [coordinates, setCoordinates] = useState(null)

  const t = content[language]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [propertyResponse, categoriesResponse] = await Promise.all([
          propertyAPI.getPropertyDetails(id),
          propertyAPI.getFeatures()
        ])

        if (propertyResponse?.data) {
          setProperty(propertyResponse.data)
        }

        if (categoriesResponse?.data) {
          setCategories(categoriesResponse.data)
        }
      } catch (error) {
        setError(error.message || t.error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, t.error])

  useEffect(() => {
    if (property?.latitude && property?.longitude) {
      setCoordinates({
        lat: parseFloat(property.latitude),
        lng: parseFloat(property.longitude)
      });
    } else if (property?.address && !coordinates) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: property.address }, (results, status) => {
        if (status === 'OK' && results[0]?.geometry?.location) {
          const location = results[0].geometry.location;
          setCoordinates({
            lat: location.lat(),
            lng: location.lng()
          });
        }
      });
    }
  }, [property, coordinates]);

  const handleFavorite = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error(
        language === 'ar'
          ? 'يجب تسجيل الدخول لإضافة العقار إلى المفضلة'
          : 'Please login to add properties to favorites'
      );
      setTimeout(() => {
        const shouldLogin = window.confirm(
          language === 'ar'
            ? 'هل تريد تسجيل الدخول أو إنشاء حساب جديد؟'
            : 'Would you like to login or create an account?'
        );
        if (shouldLogin) {
          navigate('/login/renter');
        }
      }, 1000);
      return;
    }

    try {
      const response = await (isFavorite
        ? favoritesAPI.removeFromFavorites(property.id)
        : favoritesAPI.addToFavorites(property.id));

      if (response.success) {
        setIsFavorite(!isFavorite);
        toast.success(
          language === 'ar'
            ? (isFavorite ? 'تم إزالة العقار من المفضلة' : 'تم إضافة العقار إلى المفضلة')
            : (isFavorite ? 'Property removed from favorites' : 'Property added to favorites')
        );
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        toast.error(
          language === 'ar'
            ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى'
            : 'Session expired. Please login again'
        );
        setTimeout(() => navigate('/login/renter'), 1500);
      } else {
        toast.error(
          language === 'ar'
            ? 'حدث خطأ أثناء تحديث المفضلة'
            : 'Failed to update favorites'
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-500">{error || t.error}</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate('/properties/available')}
        className="flex items-center gap-1.5 text-sm text-[#BE092B] hover:text-[#9C0722] mb-4 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>{language === 'ar' ? 'رجوع' : 'Back'}</span>
      </button>

      {/* Image Gallery */}
      <div className="relative h-[60vh] mb-8 rounded-lg overflow-hidden">
        <img
          src={property.images?.[selectedImage]?.url || 'https://placehold.co/1200x800?text=No+Image'}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {property.images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square rounded-lg overflow-hidden ${selectedImage === index ? 'ring-2 ring-[#BE092B]' : ''
              }`}
          >
            <img
              src={image.url}
              alt={`${property.title} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Property Title, Type and Location */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span>{property.type ? t.propertyTypes[property.type] || property.type : ''}</span>
          {property.type && property.address && <span>•</span>}
          <div className="flex items-center gap-1">
            <FiMapPin className="text-gray-500" />
            <span>{property.address}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Specifications */}
          <div className="flex items-center justify-around p-6 bg-gray-50 rounded-lg mb-8">
            {property.number_bedroom && (
              <div className="flex flex-col items-center flex-1 px-3">
                <IoBedOutline className="h-6 w-6 text-[#BE092B] mb-2" />
                <span className="font-semibold">{property.number_bedroom}</span>
                <span className="text-sm text-gray-500">{t.bedrooms}</span>
              </div>
            )}
            {property.number_bathroom && (
              <div className="flex flex-col items-center flex-1 px-3 border-x border-gray-200">
                <IoWaterOutline className="h-6 w-6 text-[#BE092B] mb-2" />
                <span className="font-semibold">{property.number_bathroom}</span>
                <span className="text-sm text-gray-500">{t.bathrooms}</span>
              </div>
            )}
            {property.area && (
              <div className="flex flex-col items-center flex-1 px-3">
                <FiMaximize className="h-6 w-6 text-[#BE092B] mb-2" />
                <span className="font-semibold">{property.area}</span>
                <span className="text-sm text-gray-500">{t.sqm}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{t.description}</h2>
            <p className="text-gray-600 whitespace-pre-line">{property.description}</p>
          </div>

          {/* Features */}
          {categories.map(category => {
            const categoryFeatures = property.features?.filter(feature => {
              const categoryFeatureIds = category.features.map(f => f.id)
              return categoryFeatureIds.includes(feature.id)
            })

            if (!categoryFeatures?.length) return null

            return (
              <div key={category.id} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {t.categories[category.name] || category.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryFeatures.map(feature => {
                    const FeatureIcon = featureIcons[feature.id]
                    return (
                      <div
                        key={`${category.id}-${feature.id}`}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {FeatureIcon && <FeatureIcon className="text-[#BE092B] w-5 h-5" />}
                        <span className="text-gray-700">
                          {language === 'en'
                            ? t.features_en[feature.id]
                            : t.features_ar[feature.id] || feature.name}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}



          {/* Property Location Map */}
          {coordinates && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{t.propertyLocation}</h2>
              <div className="relative w-full h-[400px]">
                <GoogleMap
                  mapContainerClassName="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-300"
                  center={coordinates}
                  zoom={15}
                  options={{
                    ...mapOptions,
                    language: language === 'ar' ? 'ar' : 'en'
                  }}
                >
                  <MarkerF
                    position={coordinates}
                    animation={window.google.maps.Animation.DROP}
                    title={language === 'ar' ? 'موقع العقار' : 'Property Location'}
                  />
                </GoogleMap>
              </div>
            </div>
          )}
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">
                  {property.price} {t.currency} {language === 'ar' ? 'سنوياً' : 'yearly'}
                </span>
              </div>
              <button
                onClick={handleFavorite}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiHeart
                  className={`w-6 h-6 ${isFavorite ? 'fill-[#BE092B] text-[#BE092B]' : 'text-gray-600'}`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowBookingForm(true)}
              className="w-full bg-[#BE092B] text-white py-3 rounded-lg font-semibold hover:bg-[#9C0722] transition-colors"
            >
              {t.bookTour}
            </button>
          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          property={property}
          onClose={() => setShowBookingForm(false)}
          language={language}
        />
      )}
    </div>
  )
} 