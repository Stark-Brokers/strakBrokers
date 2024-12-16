import { useState, useCallback, useEffect, useMemo } from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '80vh'
};

// Riyadh center coordinates
const center = {
    lat: 24.7136,
    lng: 46.6753
};

const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: false,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
}

// Declare libraries outside component to prevent unnecessary re-renders
const libraries = ['places'];

// Create a memoized loader configuration
const createLoaderOptions = (googleMapsApiKey) => ({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries,
    // Remove language option from here as it causes reloading issues
});

export default function MapView({ language }) {
    const loaderOptions = useMemo(
        () => createLoaderOptions(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
        []
    );

    const { isLoaded, loadError } = useJsApiLoader(loaderOptions);
    const [map, setMap] = useState(null);

    // Update map language when language prop changes
    useEffect(() => {
        if (map) {
            map.setOptions({ language: language === 'ar' ? 'ar' : 'en' });
        }
    }, [language, map]);

    // Cleanup function to handle unmounting
    useEffect(() => {
        return () => {
            if (map) {
                setMap(null);
            }
        };
    }, [map]);

    const onLoad = useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        map.setOptions({ language: language === 'ar' ? 'ar' : 'en' });
        setMap(map);
    }, [language]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    // Handle loading error
    if (loadError) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-red-500">
                    {language === 'ar'
                        ? 'عذراً، حدث خطأ في تحميل الخريطة'
                        : 'Sorry, there was an error loading the map'}
                </div>
            </div>
        );
    }

    // Handle loading state
    if (!isLoaded) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-80px)]">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                    ...mapOptions,
                    language: language === 'ar' ? 'ar' : 'en'
                }}
            >
            </GoogleMap>
        </div>
    );
} 