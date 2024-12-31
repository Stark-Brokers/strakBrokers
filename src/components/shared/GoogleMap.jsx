import { useCallback } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';
import { defaultCenter, mapOptions } from '../../config/googleMapsConfig';

export default function GoogleMapComponent({
    onLocationSelect,
    initialLocation,
    isEditable = true,
    language = 'en'
}) {
    const handleMarkerDragEnd = useCallback((event) => {
        if (!isEditable) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
            location: { lat, lng },
            language: language === 'ar' ? 'ar' : 'en'  // Set geocoder language
        }, (results, status) => {
            onLocationSelect({
                latitude: lat,
                longitude: lng,
                address: status === 'OK' && results[0]
                    ? results[0].formatted_address
                    : language === 'ar' ? 'لم يتم العثور على عنوان' : 'Address not found'
            });
        });
    }, [isEditable, language, onLocationSelect]);

    const handleMapClick = useCallback((event) => {
        if (!isEditable) return;

        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({
            location: { lat, lng },
            language: language === 'ar' ? 'ar' : 'en'  // Set geocoder language
        }, (results, status) => {
            onLocationSelect({
                latitude: lat,
                longitude: lng,
                address: status === 'OK' && results[0]
                    ? results[0].formatted_address
                    : language === 'ar' ? 'لم يتم العثور على عنوان' : 'Address not found'
            });
        });
    }, [isEditable, language, onLocationSelect]);

    const onLoad = useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds(initialLocation || defaultCenter);
        map.fitBounds(bounds);
    }, [initialLocation]);

    return (
        <GoogleMap
            mapContainerClassName="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-300"
            center={initialLocation || defaultCenter}
            zoom={15}
            options={{
                ...mapOptions,
                language: language === 'ar' ? 'ar' : 'en'
            }}
            onLoad={onLoad}
            onClick={handleMapClick}
        >
            <MarkerF
                position={initialLocation || defaultCenter}
                draggable={isEditable}
                onDragEnd={handleMarkerDragEnd}
                animation={window.google.maps.Animation.DROP}
                title={language === 'ar' ? 'موقع العقار' : 'Property Location'}
            />
        </GoogleMap>
    );
} 
