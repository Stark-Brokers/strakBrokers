import { useState } from 'react'
import { FiCheck, FiX } from 'react-icons/fi'

// First, let's create a mapping of feature names to their IDs
const FEATURE_IDS = {
    parking: 1,
    swimming_pool: 2,
    gym: 3,
    security: 4,
    elevator: 5,
    garden: 6,
    central_ac: 7,
    balcony: 8,
    maid_room: 9,
    storage: 10,
    kitchen_appliances: 11,
    internet: 12,
    satellite: 13,
    intercom: 14,
    maintenance: 15,
    mosque: 16,
    shopping: 17,
    schools: 18,
    pets_allowed: 19,
    sea_view: 20,
    city_view: 21,
    garden_view: 22,
    street_view: 23,
    mall_view: 24
};

export default function PropertyFilters({ language, activeFilters = {}, onFilterChange }) {
    const [localFilters, setLocalFilters] = useState({
        type: activeFilters.type || '',
        price_min: activeFilters.price_min || '',
        price_max: activeFilters.price_max || '',
        area_min: activeFilters.area_min || '',
        area_max: activeFilters.area_max || '',
        bedrooms: activeFilters.bedrooms || '',
        features: activeFilters.features || [],
        location: activeFilters.location || ''
    });

    // Add state for validation errors
    const [errors, setErrors] = useState({});

    // Validation function
    const validateFilters = (filters) => {
        const newErrors = {};

        // Price range validation
        if (filters.price_min && filters.price_max) {
            const minPrice = parseFloat(filters.price_min);
            const maxPrice = parseFloat(filters.price_max);

            if (!isNaN(minPrice) && !isNaN(maxPrice) && minPrice > maxPrice) {
                newErrors.price = language === 'ar'
                    ? 'يجب أن يكون الحد الأدنى للسعر أقل من الحد الأقصى'
                    : 'Minimum price should be less than maximum price';
            }
        }

        // Area range validation
        if (filters.area_min && filters.area_max) {
            const minArea = parseFloat(filters.area_min);
            const maxArea = parseFloat(filters.area_max);

            if (!isNaN(minArea) && !isNaN(maxArea) && minArea > maxArea) {
                newErrors.area = language === 'ar'
                    ? 'يجب أن تكون المساحة الدنيا أقل من المساحة القصوى'
                    : 'Minimum area should be less than maximum area';
            }
        }

        // Validate numeric values and ranges
        if (filters.price_min && (isNaN(parseFloat(filters.price_min)) || parseFloat(filters.price_min) < 0)) {
            newErrors.price_min = language === 'ar' ? 'يجب أن يكون الرقم صالحًا وموجبًا' : 'Must be a valid positive number';
        }
        if (filters.price_max && (isNaN(parseFloat(filters.price_max)) || parseFloat(filters.price_max) < 0)) {
            newErrors.price_max = language === 'ar' ? 'يجب أن يكون الرقم صالحًا وموجبًا' : 'Must be a valid positive number';
        }
        if (filters.area_min && (isNaN(parseFloat(filters.area_min)) || parseFloat(filters.area_min) < 0)) {
            newErrors.area_min = language === 'ar' ? 'يجب أن يكون الرقم صالحًا وموجبًا' : 'Must be a valid positive number';
        }
        if (filters.area_max && (isNaN(parseFloat(filters.area_max)) || parseFloat(filters.area_max) < 0)) {
            newErrors.area_max = language === 'ar' ? 'يجب أن يكون الرقم صالحًا وموجبًا' : 'Must be a valid positive number';
        }

        return newErrors;
    };

    const content = {
        en: {
            propertyType: 'Property Type',
            priceRange: 'Price Range',
            bedrooms: 'Bedrooms',
            amenities: 'Amenities',
            location: 'Location',
            area: 'Area (m²)',
            types: {
                all: 'All Types',
                apartment: 'Apartment',
                villa: 'Villa',
                office: 'Office',
                shop: 'Shop',
                land: 'Land'
            },
            priceRanges: {
                all: 'Any Price',
                '0-5000': 'Up to 5,000 SAR',
                '5000-10000': '5,000 - 10,000 SAR',
                '10000-15000': '10,000 - 15,000 SAR',
                '15000-20000': '15,000 - 20,000 SAR',
                '20000-30000': '20,000 - 30,000 SAR',
                '30000-50000': '30,000 - 50,000 SAR',
                '50000-100000': '50,000 - 100,000 SAR',
                '100000': 'Above 100,000 SAR'
            },
            bedroomOptions: {
                all: 'Any',
                '0': 'Studio',
                '1': '1 Bedroom',
                '2': '2 Bedrooms',
                '3': '3 Bedrooms',
                '4': '4+ Bedrooms'
            },
            locations: {
                all: 'All Locations',
                riyadh: 'Riyadh',
                jeddah: 'Jeddah',
                dammam: 'Dammam',
                khobar: 'Khobar'
            },
            amenityOptions: {
                central_ac: 'Central AC',
                parking: 'Parking',
                swimming_pool: 'Swimming Pool',
                gym: 'Gym',
                security: '24/7 Security',
                elevator: 'Elevator',
                balcony: 'Balcony',
                garden: 'Garden',
                maid_room: "Maid's Room",
                storage: 'Storage Room',
                furnished: 'Furnished',
                kitchen_appliances: 'Kitchen Appliances',
                internet: 'Internet',
                satellite: 'Satellite/Cable TV',
                intercom: 'Intercom',
                maintenance: 'Maintenance',
                mosque: 'Nearby Mosque',
                shopping: 'Shopping Centers',
                schools: 'Schools Nearby',
                pets_allowed: 'Pets Allowed'
            },
            customRange: 'Custom Range',
            minPrice: 'Min Price',
            maxPrice: 'Max Price',
            apply: 'Apply',
            back: 'Back',
            reset: 'Reset Filters',
            areaRanges: {
                all: 'Any Size',
                '0-100': 'Up to 100 m²',
                '100-200': '100 - 200 m²',
                '200-300': '200 - 300 m²',
                '300-500': '300 - 500 m²',
                '500-1000': '500 - 1,000 m²',
                '1000': 'Above 1,000 m²'
            },
            minArea: 'Min Area',
            maxArea: 'Max Area',
            sqm: 'm²'
        },
        ar: {
            propertyType: 'نوع العقار',
            priceRange: 'نطاق السعر',
            bedrooms: 'غرف النوم',
            amenities: 'المميزات',
            location: 'الموقع',
            area: 'المساحة (م²)',
            types: {
                all: 'جميع الأنواع',
                apartment: 'شقة',
                villa: 'فيلا',
                office: 'مكتب',
                shop: 'محل',
                land: 'أرض'
            },
            priceRanges: {
                all: 'أي سعر',
                '0-5000': 'أقل من 5,000 ريال',
                '5000-10000': '5,000 - 10,000 ريال',
                '10000-15000': '10,000 - 15,000 ريال',
                '15000-20000': '15,000 - 20,000 ريال',
                '20000-30000': '20,000 - 30,000 ريال',
                '30000-50000': '30,000 - 50,000 ريال',
                '50000-100000': '50,000 - 100,000 ريال',
                '100000': 'أكثر من 100,000 ريال'
            },
            bedroomOptions: {
                all: 'الكل',
                '0': 'استوديو',
                '1': 'غرفة نوم',
                '2': 'غرفتين نوم',
                '3': '3 غرف نوم',
                '4': '4+ غرف نوم'
            },
            locations: {
                all: 'كل المواقع',
                riyadh: 'الرياض',
                jeddah: 'جدة',
                dammam: 'الدمام',
                khobar: 'الخبر'
            },
            amenityOptions: {
                central_ac: 'تكييف مركزي',
                parking: 'موقف سيارات',
                swimming_pool: 'مسبح',
                gym: 'صالة رياضية',
                security: 'أمن 24/7',
                elevator: 'مصعد',
                balcony: 'شرفة',
                garden: 'حديقة',
                maid_room: 'غرفة خادمة',
                storage: 'غرفة تخزين',
                furnished: 'مفروش',
                kitchen_appliances: 'أجهزة مطبخ',
                internet: 'إنترنت',
                satellite: 'قنوات فضائية',
                intercom: 'تصال داخلي',
                maintenance: 'صيانة',
                mosque: 'مسجد قريب',
                shopping: 'مراكز تسوق',
                schools: 'مدارس قريبة',
                pets_allowed: 'يسمح بالحيوانات الأليفة'
            },
            customRange: 'نطاق مخصص',
            minPrice: 'السعر الأدنى',
            maxPrice: 'السعر الأعلى',
            apply: 'تطبيق',
            back: 'رجوع',
            reset: 'إعادة تعيين',
            areaRanges: {
                all: 'أي مساحة',
                '0-100': 'حتى 100 م²',
                '100-200': '100 - 200 م²',
                '200-300': '200 - 300 م²',
                '300-500': '300 - 500 م²',
                '500-1000': '500 - 1,000 م²',
                '1000': 'أكثر من 1,000 م²'
            },
            minArea: 'الحد الأدنى للمساحة',
            maxArea: 'الحد الأقصى للمساحة',
            sqm: 'م²'
        }
    }

    const t = content[language]

    const handleLocalChange = (key, value) => {
        // Clear error when user starts typing
        setErrors(prev => ({ ...prev, [key]: undefined }));

        // Handle numeric inputs
        if (['price_min', 'price_max', 'area_min', 'area_max'].includes(key)) {
            // Remove non-numeric characters except decimal point
            value = value.toString().replace(/[^\d.]/g, '');
        }

        // Special handling for bedrooms
        if (key === 'bedrooms') {
            // If value is empty string (All option), keep it as empty string
            if (value === '') {
                setLocalFilters(prev => ({ ...prev, [key]: value }));
                return;
            }
            // Otherwise convert to number
            const numValue = parseInt(value);
            if (!isNaN(numValue)) {
                setLocalFilters(prev => ({ ...prev, [key]: numValue }));
                return;
            }
        }

        setLocalFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleApplyFilters = () => {
        // Validate filters before applying
        const validationErrors = validateFilters(localFilters);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous errors
        setErrors({});

        try {
            const apiFilters = {
                ...localFilters,
                // Convert string values to numbers where needed
                price_min: localFilters.price_min ? parseFloat(localFilters.price_min.toString().replace(/,/g, '')) : '',
                price_max: localFilters.price_max ? parseFloat(localFilters.price_max.toString().replace(/,/g, '')) : '',
                area_min: localFilters.area_min ? parseFloat(localFilters.area_min) : '',
                area_max: localFilters.area_max ? parseFloat(localFilters.area_max) : '',
                // Keep bedrooms as is since we handled it in handleLocalChange
                bedrooms: localFilters.bedrooms,
                features: localFilters.features
            };

            // Remove empty values
            const cleanFilters = Object.entries(apiFilters).reduce((acc, [key, value]) => {
                if (value === undefined ||
                    value === null ||
                    value === '' ||
                    (Array.isArray(value) && value.length === 0)
                ) {
                    return acc;
                }
                return { ...acc, [key]: value };
            }, {});

            onFilterChange(cleanFilters);
        } catch (error) {
            console.error('Error applying filters:', error);
            setErrors({
                general: language === 'ar'
                    ? 'حدث خطأ أثناء تطبيق الفلاتر'
                    : 'Error applying filters'
            });
        }
    };

    const handleFeatureToggle = (featureKey) => {
        const featureId = FEATURE_IDS[featureKey];
        if (!featureId) return; // Skip if ID not found

        const newFeatures = localFilters.features.includes(featureId)
            ? localFilters.features.filter(id => id !== featureId)
            : [...localFilters.features, featureId];

        handleLocalChange('features', newFeatures);
    };

    const resetFilters = () => {
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

        // Reset local state
        setLocalFilters(emptyFilters);
        setErrors({});

        // Notify parent component with clean empty filters
        const cleanEmptyFilters = {
            type: '',
            price_min: undefined,
            price_max: undefined,
            area_min: undefined,
            area_max: undefined,
            bedrooms: undefined,
            features: [],
            location: ''
        };

        onFilterChange(cleanEmptyFilters);
    };

    // Error message component
    const ErrorMessage = ({ error }) => {
        if (!error) return null;
        return (
            <p className="text-red-500 text-sm mt-1">{error}</p>
        );
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Property Type */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                        }`}>
                        {t.propertyType}
                    </h3>
                    <select
                        value={localFilters.type}
                        onChange={(e) => handleLocalChange('type', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        <option value="">{t.types.all}</option>
                        {Object.entries(t.types).filter(([key]) => key !== 'all').map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                        }`}>
                        {t.priceRange}
                    </h3>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={t.minPrice}
                                value={localFilters.price_min}
                                onChange={(e) => handleLocalChange('price_min', e.target.value)}
                                className={`w-full p-2 border ${errors.price_min || errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-primary`}
                            />
                            <ErrorMessage error={errors.price_min} />
                        </div>
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={t.maxPrice}
                                value={localFilters.price_max}
                                onChange={(e) => handleLocalChange('price_max', e.target.value)}
                                className={`w-full p-2 border ${errors.price_max || errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-primary`}
                            />
                            <ErrorMessage error={errors.price_max} />
                        </div>
                    </div>
                    {errors.price && <ErrorMessage error={errors.price} />}
                </div>

                {/* Area Range */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                        }`}>
                        {t.area}
                    </h3>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={`${t.minArea} ${t.sqm}`}
                                value={localFilters.area_min}
                                onChange={(e) => handleLocalChange('area_min', e.target.value)}
                                className={`w-full p-2 border ${errors.area_min || errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-primary`}
                            />
                            <ErrorMessage error={errors.area_min} />
                        </div>
                        <div className="w-full">
                            <input
                                type="number"
                                placeholder={`${t.maxArea} ${t.sqm}`}
                                value={localFilters.area_max}
                                onChange={(e) => handleLocalChange('area_max', e.target.value)}
                                className={`w-full p-2 border ${errors.area_max || errors.area ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:border-primary`}
                            />
                            <ErrorMessage error={errors.area_max} />
                        </div>
                    </div>
                    {errors.area && <ErrorMessage error={errors.area} />}
                </div>

                {/* Bedrooms */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                        }`}>
                        {t.bedrooms}
                    </h3>
                    <select
                        value={localFilters.bedrooms}
                        onChange={(e) => handleLocalChange('bedrooms', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        <option value="">{t.bedroomOptions.all}</option>
                        {Object.entries(t.bedroomOptions)
                            .filter(([key]) => key !== 'all')
                            .map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                    </select>
                </div>

                {/* Location */}
                <div>
                    <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                        }`}>
                        {t.location}
                    </h3>
                    <select
                        value={localFilters.location}
                        onChange={(e) => handleLocalChange('location', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    >
                        <option value="">{t.locations.all}</option>
                        {Object.entries(t.locations)
                            .filter(([key]) => key !== 'all')
                            .map(([value, label]) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                    </select>
                </div>
            </div>

            {/* Features */}
            <div className="mt-6">
                <h3 className={`text-lg font-semibold mb-3 ${language === 'ar' ? 'font-arabic' : ''
                    }`}>
                    {t.amenities}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(t.amenityOptions).map(([key, label]) => {
                        const featureId = FEATURE_IDS[key];
                        if (!featureId) return null; // Skip if no matching ID

                        return (
                            <button
                                key={key}
                                onClick={() => handleFeatureToggle(key)}
                                className={`flex items-center justify-center gap-2 p-2 rounded-md border ${localFilters.features.includes(featureId)
                                    ? 'bg-primary text-white border-primary'
                                    : 'border-gray-300 hover:border-primary'
                                    }`}
                            >
                                {localFilters.features.includes(featureId) && <FiCheck />}
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Reset and Apply Buttons */}
            <div className="mt-6 flex flex-col gap-2">
                {errors.general && (
                    <div className="bg-red-50 p-2 rounded-md">
                        <ErrorMessage error={errors.general} />
                    </div>
                )}
                <div className="flex justify-between">
                    <button
                        onClick={resetFilters}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
                    >
                        <FiX />
                        {t.reset}
                    </button>

                    <button
                        onClick={handleApplyFilters}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                    >
                        {t.apply}
                    </button>
                </div>
            </div>
        </div>
    )
} 