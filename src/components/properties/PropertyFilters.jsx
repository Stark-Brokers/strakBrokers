import { useState, useEffect } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

// Comprehensive list of Saudi Arabian cities
const MAIN_CITIES = [
    { id: 'riyadh', label: { en: 'Riyadh', ar: 'الرياض' } },
    { id: 'jeddah', label: { en: 'Jeddah', ar: 'جدة' } },
    { id: 'dammam', label: { en: 'Dammam', ar: 'الدمام' } },
];

const OTHER_CITIES = [
    { id: 'mecca', label: { en: 'Mecca', ar: 'مكة المكرمة' } },
    { id: 'medina', label: { en: 'Medina', ar: 'المدينة المنورة' } },
    { id: 'khobar', label: { en: 'Khobar', ar: 'الخبر' } },
    { id: 'dhahran', label: { en: 'Dhahran', ar: 'الظهران' } },
    { id: 'qatif', label: { en: 'Qatif', ar: 'القطيف' } },
    { id: 'jubail', label: { en: 'Jubail', ar: 'الجبيل' } },
    { id: 'hofuf', label: { en: 'Hofuf', ar: 'الهفوف' } },
    { id: 'mubarraz', label: { en: 'Mubarraz', ar: 'المبرز' } },
    { id: 'buraydah', label: { en: 'Buraydah', ar: 'بريدة' } },
    { id: 'unaizah', label: { en: 'Unaizah', ar: 'عنيزة' } },
    { id: 'hail', label: { en: 'Hail', ar: 'حائل' } },
    { id: 'majmaah', label: { en: 'Majmaah', ar: 'المجمعة' } },
    { id: 'kharj', label: { en: 'Al-Kharj', ar: 'الخرج' } },
    { id: 'taif', label: { en: 'Taif', ar: 'الطائف' } },
    { id: 'yanbu', label: { en: 'Yanbu', ar: 'ينبع' } },
    { id: 'rabigh', label: { en: 'Rabigh', ar: 'رابغ' } },
    { id: 'tabuk', label: { en: 'Tabuk', ar: 'تبوك' } },
    { id: 'arar', label: { en: 'Arar', ar: 'عرعر' } },
    { id: 'sakaka', label: { en: 'Sakaka', ar: 'سكاكا' } },
    { id: 'rafha', label: { en: 'Rafha', ar: 'رفحاء' } },
    { id: 'abha', label: { en: 'Abha', ar: 'أبها' } },
    { id: 'khamis-mushait', label: { en: 'Khamis Mushait', ar: 'خميس مشيط' } },
    { id: 'najran', label: { en: 'Najran', ar: 'نجران' } },
    { id: 'jizan', label: { en: 'Jizan', ar: 'جازان' } },
    { id: 'al-bahah', label: { en: 'Al Bahah', ar: 'الباحة' } },
    { id: 'al-qunfudhah', label: { en: 'Al Qunfudhah', ar: 'القنفذة' } },
    { id: 'al-rass', label: { en: 'Al Rass', ar: 'الرس' } },
    { id: 'wadi-ad-dawasir', label: { en: 'Wadi Ad-Dawasir', ar: 'وادي الدواسر' } },
    { id: 'dawadmi', label: { en: 'Dawadmi', ar: 'الدوادمي' } },
    { id: 'zulfi', label: { en: 'Zulfi', ar: 'الزلفي' } },
    { id: 'afif', label: { en: 'Afif', ar: 'عفيف' } },
    { id: 'al-qurayyat', label: { en: 'Al-Qurayyat', ar: 'القريات' } },
    { id: 'al-khafji', label: { en: 'Al-Khafji', ar: 'الخفجي' } },
    { id: 'hafar-al-batin', label: { en: 'Hafar Al-Batin', ar: 'حفر الباطن' } },
    { id: 'al-jubail', label: { en: 'Al Jubail', ar: 'الجبيل' } },
    { id: 'al-khubar', label: { en: 'Al Khubar', ar: 'الخبر' } },
    { id: 'al-qatif', label: { en: 'Al Qatif', ar: 'القطيف' } },
    { id: 'al-ahsa', label: { en: 'Al-Ahsa', ar: 'الأحساء' } }
].sort((a, b) => a.label.en.localeCompare(b.label.en));

const CITIES = [...MAIN_CITIES, ...OTHER_CITIES];

export default function PropertyFilters({ language, onFilterChange, isOpen, onClose }) {
    const [filters, setFilters] = useState({
        type: '',
        priceMin: '',
        priceMax: '',
        areaMin: '',
        areaMax: '',
        bedrooms: '',
        bathrooms: '',
        city: ''
    });

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Apply filters automatically when they change
    useEffect(() => {
        let cleanFilters = {};

        if (filters.type && filters.type !== '') {
            cleanFilters.type = filters.type.toLowerCase();
        }

        if (filters.city && filters.city !== '') {
            cleanFilters.city = filters.city;
        }

        if (filters.priceMin && !isNaN(parseFloat(filters.priceMin))) {
            cleanFilters.price_min = parseFloat(filters.priceMin);
        }

        if (filters.priceMax && !isNaN(parseFloat(filters.priceMax))) {
            cleanFilters.price_max = parseFloat(filters.priceMax);
        }

        if (filters.bedrooms && !isNaN(parseInt(filters.bedrooms))) {
            cleanFilters.bedrooms = parseInt(filters.bedrooms);
        }

        if (filters.bathrooms && !isNaN(parseInt(filters.bathrooms))) {
            cleanFilters.bathrooms = parseInt(filters.bathrooms);
        }

        if (filters.areaMin && !isNaN(parseFloat(filters.areaMin))) {
            cleanFilters.area_min = parseFloat(filters.areaMin);
        }

        if (filters.areaMax && !isNaN(parseFloat(filters.areaMax))) {
            cleanFilters.area_max = parseFloat(filters.areaMax);
        }

        onFilterChange(cleanFilters);
    }, [filters, onFilterChange]);

    const resetFilters = () => {
        setFilters({
            type: '',
            priceMin: '',
            priceMax: '',
            areaMin: '',
            areaMax: '',
            bedrooms: '',
            bathrooms: '',
            city: ''
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="filter-panel" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose}></div>

            {/* Filter Panel */}
            <div className="relative min-h-screen md:min-h-0 flex items-center justify-center p-4">
                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
                    <div className="p-6 space-y-4">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {language === 'ar' ? 'تصفية العقارات' : 'Filter Properties'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Property Type and City */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {language === 'ar' ? 'نوع العقار' : 'Property Type'}
                                </label>
                                <select
                                    value={filters.type}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-[#BE092B] appearance-none"
                                >
                                    <option value="">{language === 'ar' ? 'الكل' : 'All'}</option>
                                    <option value="apartment">{language === 'ar' ? 'شقة' : 'Apartment'}</option>
                                    <option value="villa">{language === 'ar' ? 'فيلا' : 'Villa'}</option>
                                    <option value="office">{language === 'ar' ? 'مكتب' : 'Office'}</option>
                                    <option value="shop">{language === 'ar' ? 'محل' : 'Shop'}</option>
                                    <option value="land">{language === 'ar' ? 'أرض' : 'Land'}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {language === 'ar' ? 'المدينة' : 'City'}
                                </label>
                                <select
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-[#BE092B] appearance-none"
                                >
                                    <option value="">{language === 'ar' ? 'كل المدن' : 'All Cities'}</option>
                                    {CITIES.map(city => (
                                        <option key={city.id} value={city.id}>
                                            {city.label[language === 'ar' ? 'ar' : 'en']}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'السعر' : 'Price Range'}
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder={language === 'ar' ? 'من' : 'Min'}
                                    value={filters.priceMin}
                                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#BE092B] focus:border-[#BE092B] transition-colors [&:not(:placeholder-shown)]:bg-[#BE092B]/5 hover:border-[#BE092B]/30"
                                />
                                <input
                                    type="number"
                                    placeholder={language === 'ar' ? 'إلى' : 'Max'}
                                    value={filters.priceMax}
                                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#BE092B] focus:border-[#BE092B] transition-colors [&:not(:placeholder-shown)]:bg-[#BE092B]/5 hover:border-[#BE092B]/30"
                                />
                            </div>
                        </div>

                        {/* Area Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {language === 'ar' ? 'المساحة' : 'Area'} (m²)
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <input
                                    type="number"
                                    placeholder={language === 'ar' ? 'من' : 'Min'}
                                    value={filters.areaMin}
                                    onChange={(e) => handleFilterChange('areaMin', e.target.value)}
                                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#BE092B] focus:border-[#BE092B] transition-colors [&:not(:placeholder-shown)]:bg-[#BE092B]/5 hover:border-[#BE092B]/30"
                                />
                                <input
                                    type="number"
                                    placeholder={language === 'ar' ? 'إلى' : 'Max'}
                                    value={filters.areaMax}
                                    onChange={(e) => handleFilterChange('areaMax', e.target.value)}
                                    className="w-full bg-white border border-gray-200 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-[#BE092B] focus:border-[#BE092B] transition-colors [&:not(:placeholder-shown)]:bg-[#BE092B]/5 hover:border-[#BE092B]/30"
                                />
                            </div>
                        </div>

                        {/* Rooms */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {language === 'ar' ? 'غرف النوم' : 'Bedrooms'}
                                </label>
                                <select
                                    value={filters.bedrooms}
                                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-[#BE092B] appearance-none"
                                >
                                    <option value="">{language === 'ar' ? 'الكل' : 'All'}</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {language === 'ar' ? 'الحمامات' : 'Bathrooms'}
                                </label>
                                <select
                                    value={filters.bathrooms}
                                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                                    className="w-full rounded-md border border-gray-200 p-2 outline-none focus:border-[#BE092B] appearance-none"
                                >
                                    <option value="">{language === 'ar' ? 'الكل' : 'All'}</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={resetFilters}
                                className="px-4 py-2 text-sm text-[#BE092B] hover:bg-red-50 rounded-md transition-colors flex items-center gap-2"
                            >
                                <FiX className="w-4 h-4" />
                                <span>{language === 'ar' ? 'إعادة تعيين' : 'Reset'}</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                                aria-label={language === 'ar' ? 'إغلاق' : 'Close'}
                            >
                                <FiX className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
