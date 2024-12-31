import { useLoadScript } from '@react-google-maps/api';
import { loadScriptProps } from '../../config/googleMapsConfig';
import { useLanguage } from '../../contexts/LanguageContext';

export default function GoogleMapsProvider({ children }) {
    const { language } = useLanguage();

    const { isLoaded, loadError } = useLoadScript({
        ...loadScriptProps,
        language: language === 'ar' ? 'ar' : 'en'
    });

    if (loadError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    {language === 'ar'
                        ? 'فشل في تحميل خرائط Google. يرجى المحاولة مرة أخرى لاحقاً.'
                        : 'Failed to load Google Maps. Please try again later.'}
                </div>
            </div>
        );
    }


    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return children;
} 