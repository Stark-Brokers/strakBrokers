import { useState, useEffect, memo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { propertyAPI } from '../../services/api'
import favoritesAPI from '../../services/favoritesAPI'
import PropertyFilters from './PropertyFilters'
import { FiHeart, FiMaximize, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi'
import { IoBedOutline, IoWaterOutline, IoLocationOutline } from "react-icons/io5"
import React from 'react';
import { toast } from 'react-hot-toast';

const content = {
    en: {
        title: 'Available Properties',
        showFilters: 'Show Filters',
        hideFilters: 'Hide Filters',
        noProperties: 'No properties available',
        noMatches: 'No properties found matching your search criteria',
        tryAdjusting: 'Try adjusting your filters or',
        resetAll: 'reset all filters',
        filters: {
            type: 'Property Type',
            price: 'Price Range',
            area: 'Area Range',
            location: 'Location',
            bedrooms: 'Bedrooms',
            bathrooms: 'Bathrooms',
            features: 'Features'
        },
        propertyTypes: {
            apartment: 'Apartment',
            villa: 'Villa',
            office: 'Office',
            shop: 'Shop',
            land: 'Land'
        },
        currency: 'SAR',
        sqm: 'm²',
        apply: 'Apply Filters',
        reset: 'Reset Filters',
        from: 'From',
        viewDetails: 'View Details',
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
        title: 'العقارات المتاحة',
        showFilters: 'إظهار الفلاتر',
        hideFilters: 'إخفاء الفلاتر',
        noProperties: 'لا تجد عقارات متاحة',
        noMatches: 'لا توجد عقارات تطابق معايير البحث',
        tryAdjusting: 'حاول تعديل الفلاتر أو',
        resetAll: 'إعادة تعيين جميع الفلاتر',
        filters: {
            type: 'نوع العقار',
            price: 'نطاق السعر',
            area: 'نطاق المساحة',
            location: 'الموقع',
            bedrooms: 'غرف النوم',
            bathrooms: 'دورات المياه',
            features: 'المميزات'
        },
        propertyTypes: {
            apartment: 'شقة',
            villa: 'فيلا',
            office: 'مكتب',
            shop: 'محل',
            land: 'أرض'
        },
        currency: 'ريال',
        sqm: 'م²',
        apply: 'تطبيق الفلاتر',
        reset: 'إعادة تعيين',
        from: 'من',
        viewDetails: 'عرض التفاصيل',
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
};

// Memoized Property Card Component
const PropertyCard = memo(({ property, language, onNavigate }) => {
    const t = content[language];
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const navigate = useNavigate();

    const handleFavorite = async (e) => {
        e.stopPropagation();
        if (favoriteLoading) return;

        // Check if user is logged in by looking for token
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
            setFavoriteLoading(true);
            if (isFavorite) {
                const response = await favoritesAPI.removeFromFavorites(property.id);
                if (response.success) {
                    setIsFavorite(false);
                    toast.success(language === 'ar' ? 'تم إزالة العقار من المفضلة' : 'Property removed from favorites');
                }
            } else {
                const response = await favoritesAPI.addToFavorites(property.id);
                if (response.success) {
                    setIsFavorite(true);
                    toast.success(language === 'ar' ? 'تم إضافة العقار إلى المفضلة' : 'Property added to favorites');
                }
            }
        } catch (error) {
            console.error('Failed to update favorite status:', error);
            if (error.response?.status === 401) {
                // Clear token and redirect to login
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
        } finally {
            setFavoriteLoading(false);
        }
    };

    // Function to get optimized image URL based on screen size and device pixel ratio
    const getOptimizedImageUrl = useCallback((url, size = 'medium') => {
        if (!url) return 'https://placehold.co/600x400?text=No+Image';
        if (url.includes('placehold.co')) return url;

        try {
            const imageUrl = new URL(url);
            const dpr = window.devicePixelRatio || 1;

            // Define sizes based on usage
            const sizes = {
                thumbnail: 200 * dpr,
                small: 400 * dpr,
                medium: 600 * dpr,
                large: 800 * dpr
            };

            // Add optimization parameters
            imageUrl.searchParams.set('w', sizes[size]);
            imageUrl.searchParams.set('q', '75'); // Quality
            imageUrl.searchParams.set('auto', 'format'); // Auto format selection
            imageUrl.searchParams.set('fit', 'crop'); // Maintain aspect ratio
            return imageUrl.toString();
        } catch (e) {
            console.error('Error optimizing image URL:', e);
            return url;
        }
    }, []);

    // Generate blur hash placeholder
    const getPlaceholderUrl = useCallback((url) => {
        if (!url) return 'https://placehold.co/600x400?text=No+Image';
        try {
            const imageUrl = new URL(url);
            imageUrl.searchParams.set('w', '50'); // Tiny size for placeholder
            imageUrl.searchParams.set('q', '30'); // Low quality for placeholder
            imageUrl.searchParams.set('blur', '20'); // Add blur effect
            return imageUrl.toString();
        } catch (e) {
            return url;
        }
    }, []);

    // Get property type label
    const getPropertyTypeLabel = (type) => {
        return t.propertyTypes[type] || type;
    };

    return (
        <div
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer"
            onClick={() => onNavigate(property.id)}
        >
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                {/* Blur placeholder */}
                {!imageLoaded && !imageError && (
                    <img
                        src={getPlaceholderUrl(property.images?.[0]?.url)}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover filter blur-lg transform scale-105"
                        aria-hidden="true"
                    />
                )}

                {/* Main image with progressive loading */}
                <img
                    src={getOptimizedImageUrl(property.images?.[0]?.url, 'small')}
                    alt={property.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageError(true)}
                    srcSet={`
                        ${getOptimizedImageUrl(property.images?.[0]?.url, 'thumbnail')} 200w,
                        ${getOptimizedImageUrl(property.images?.[0]?.url, 'small')} 400w,
                        ${getOptimizedImageUrl(property.images?.[0]?.url, 'medium')} 600w,
                        ${getOptimizedImageUrl(property.images?.[0]?.url, 'large')} 800w
                    `}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />

                {/* Error state */}
                {imageError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                            <div className="text-gray-400 mb-2">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-sm text-gray-500">Image not available</span>
                        </div>
                    </div>
                )}

                {/* Favorite button */}
                <button
                    className={`absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleFavorite}
                    disabled={favoriteLoading}
                >
                    <FiHeart className={`w-5 h-5 transition-colors ${isFavorite ? 'text-[#BE092B] fill-current' : 'text-[#BE092B]'}`} />
                </button>
            </div>

            <div className="p-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold line-clamp-2 text-gray-800">
                            {property.title}
                        </h3>
                        <span className="text-sm text-gray-500">
                            • {getPropertyTypeLabel(property.type)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        {property.address && (
                            <div className="flex items-center gap-1">
                                <IoLocationOutline className="text-[#BE092B]" />
                                <span>{property.address}</span>
                            </div>
                        )}
                    </div>
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
                            {property.price} {t.currency}
                        </p>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNavigate(property.id);
                        }}
                        className="px-4 py-2 bg-[#BE092B]/90 text-white rounded-lg hover:bg-[#8a1328] transition-colors"
                    >
                        {t.viewDetails}
                    </button>
                </div>
            </div>
        </div>
    );
});

PropertyCard.displayName = 'PropertyCard';

export default function AvailableProperties({ language }) {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalItems, setTotalItems] = useState(0);
    const [filters, setFilters] = useState({
        type: '',
        price_min: '',
        price_max: '',
        area_min: '',
        area_max: '',
        bedrooms: '',
        features: [],
        location: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const createSearchParams = useCallback((page, filters) => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('per_page', 15);
        params.append('status', 'available');

        Object.entries(filters).forEach(([key, value]) => {
            // Skip empty values
            if (value === undefined ||
                value === null ||
                value === '' ||
                (Array.isArray(value) && value.length === 0)
            ) {
                return;
            }

            // Handle features array
            if (key === 'features' && Array.isArray(value)) {
                value.forEach(featureId => params.append('features[]', featureId));
                return;
            }

            // Handle price filters
            if (key === 'price_min' || key === 'price_max') {
                const numValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
                if (!isNaN(numValue) && numValue > 0) {
                    params.append(key, numValue);
                }
                return;
            }

            // Handle area filters
            if (key === 'area_min' || key === 'area_max') {
                const numValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
                if (!isNaN(numValue) && numValue > 0) {
                    params.append(key, numValue);
                }
                return;
            }

            // Handle bedrooms - ensure exact match
            if (key === 'bedrooms') {
                // Value should already be a number from PropertyFilters
                if (typeof value === 'number' && value >= 0) {
                    params.append(key, value);
                }
                return;
            }

            // Handle other string values
            params.append(key, value.toString().trim());
        });

        // Log the final params for debugging
        console.log('Search Params:', Object.fromEntries(params.entries()));
        return params;
    }, []);

    const fetchProperties = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params = createSearchParams(page, filters);
            const response = await propertyAPI.getAvailableProperties(params);

            console.log('API Response:', {
                total: response.data.total,
                currentPage: response.data.currentPage,
                lastPage: response.data.lastPage,
                perPage: response.data.perPage,
                itemsCount: response.data.items?.length
            });

            if (!response?.data?.items || response.data.items.length === 0) {
                setProperties([]);
                setTotalItems(0);
                setTotalPages(1);
                setCurrentPage(1);

                const hasActiveFilters = Object.keys(filters).some(key =>
                    filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
                );

                if (hasActiveFilters) {
                    setError(content[language].noMatches);
                }
                return;
            }

            const { items, total, currentPage, lastPage, perPage } = response.data;

            setProperties(items);
            setTotalItems(total || 0);
            setTotalPages(lastPage || 1);
            setCurrentPage(currentPage || page);
            setError(null);

            console.log('Updated State:', {
                totalItems: total,
                currentPage: currentPage,
                totalPages: lastPage,
                itemsCount: items.length
            });

        } catch (error) {
            console.error('Pagination error:', error);
            if (error.response?.status === 404 && error.response?.data?.message === 'No data found') {
                setProperties([]);
                setTotalItems(0);
                setTotalPages(1);
                setCurrentPage(1);

                const hasActiveFilters = Object.keys(filters).some(key =>
                    filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
                );

                if (hasActiveFilters) {
                    setError(content[language].noMatches);
                }
            } else {
                setError(
                    language === 'ar'
                        ? 'عذراً، حدث خطأ أثناء تحميل العقارات. يرجى المحاولة مرة أخرى.'
                        : 'Sorry, there was an error loading properties. Please try again.'
                );
            }
        } finally {
            setLoading(false);
        }
    }, [filters, language, createSearchParams]);

    useEffect(() => {
        // Reset to first page when filters change
        setCurrentPage(1);
        fetchProperties(1);
    }, [filters, fetchProperties]);

    const handleNavigate = useCallback((id) => {
        navigate(`/properties/${id}`);
    }, [navigate]);

    const handleApplyFilters = useCallback((newFilters) => {
        console.log('Received filters:', newFilters);

        // Clean up and format filter values
        const cleanFilters = Object.entries(newFilters).reduce((acc, [key, value]) => {
            // Skip undefined/null values
            if (value === undefined || value === null) {
                return { ...acc, [key]: '' };
            }

            // Handle price values
            if (key === 'price_min' || key === 'price_max') {
                const numValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
                return { ...acc, [key]: !isNaN(numValue) && numValue > 0 ? numValue : '' };
            }

            // Handle area values
            if (key === 'area_min' || key === 'area_max') {
                const numValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
                return { ...acc, [key]: !isNaN(numValue) && numValue > 0 ? numValue : '' };
            }

            // Handle bedrooms - keep as number if it is one
            if (key === 'bedrooms') {
                return { ...acc, [key]: typeof value === 'number' ? value : '' };
            }

            // Handle arrays (features)
            if (Array.isArray(value)) {
                return { ...acc, [key]: value };
            }

            // Handle string values
            return { ...acc, [key]: value.toString().trim() };
        }, {});

        console.log('Cleaned filters:', cleanFilters);
        setCurrentPage(1);
        setFilters(cleanFilters);
    }, []);

    const handlePageChange = useCallback((newPage) => {
        if (newPage < 1 || newPage > totalPages) return;
        setCurrentPage(newPage);
        fetchProperties(newPage);
    }, [totalPages, fetchProperties]);

    const resetFilters = useCallback(() => {
        const emptyFilters = {
            type: '',
            price_min: '',
            price_max: '',
            area_min: '',
            area_max: '',
            bedrooms: '',
            features: [],
            location: ''
        };
        setFilters(emptyFilters);
        setCurrentPage(1);
        setError(null);
        // Force a new fetch with empty filters
        fetchProperties(1);
    }, [fetchProperties]);

    const t = content[language];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-64 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold ${language === 'ar' ? 'font-arabic' : ''}`}>
                    {t.title}
                </h1>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="bg-primary text-white rounded-lg text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2"
                >
                    {showFilters ? t.hideFilters : t.showFilters}
                </button>
            </div>

            {showFilters && (
                <div className="mb-8">
                    <PropertyFilters
                        language={language}
                        activeFilters={filters}
                        onFilterChange={handleApplyFilters}
                    />
                </div>
            )}

            {/* Show error message in a non-blocking banner */}
            {error && error.includes('error loading') && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => fetchProperties(currentPage)}
                            className="text-primary hover:text-primary-dark underline ml-4"
                        >
                            {language === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
                        </button>
                    </div>
                </div>
            )}

            {/* Show properties or empty state */}
            {properties.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    {Object.keys(filters).some(key =>
                        filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
                    ) ? (
                        <>
                            <p className="text-gray-500 mb-2">{t.noMatches}</p>
                            <p className="text-gray-400">
                                {t.tryAdjusting}{' '}
                                <button
                                    onClick={resetFilters}
                                    className="text-primary hover:text-primary-dark underline focus:outline-none"
                                >
                                    {t.resetAll}
                                </button>
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-500">{t.noProperties}</p>
                    )}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {properties.map(property => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                language={language}
                                onNavigate={handleNavigate}
                            />
                        ))}
                    </div>

                    {/* Updated Pagination UI */}
                    <div className="flex justify-center items-center gap-4 mt-8 py-4 border-t border-gray-100">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border ${currentPage === 1
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            aria-label="Previous page"
                        >
                            <FiChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">
                                {language === 'ar' ? 'صفحة' : 'Page'}
                            </span>
                            <span className="font-medium text-gray-900">
                                {currentPage}
                            </span>
                            <span className="text-gray-400">/</span>
                            <span className="text-gray-600">
                                {totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`flex items-center justify-center w-10 h-10 rounded-lg border ${currentPage === totalPages
                                ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400'
                                }`}
                            aria-label="Next page"
                        >
                            <FiChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
} 