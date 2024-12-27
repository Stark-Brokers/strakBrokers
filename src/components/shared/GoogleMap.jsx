import { useEffect, useRef, useState } from 'react';

export default function GoogleMap({
    onLocationSelect,
    initialLocation,
    isEditable = true,
    language = 'en'
}) {
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    const defaultLocation = {
        lat: 24.7136,
        lng: 46.6753
    };

    useEffect(() => {
        const initMap = () => {
            if (!window.google?.maps || !mapRef.current) return;

            const location = initialLocation || defaultLocation;
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: location,
                zoom: 15,
                mapTypeControl: false,
                fullscreenControl: false,
                streetViewControl: false,
                styles: [

                    {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }],
                    },
                ],
            });

            const markerInstance = new window.google.maps.Marker({
                position: location,
                map: mapInstance,
                draggable: isEditable,
                animation: window.google.maps.Animation.DROP,
                title: language === 'ar' ? 'موقع العقار' : 'Property Location'
            });

            if (isEditable) {
                const handleLocationChange = (lat, lng) => {
                    getAddress(lat, lng);
                };

                markerInstance.addListener('dragend', (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    handleLocationChange(lat, lng);
                });

                mapInstance.addListener('click', (event) => {
                    const lat = event.latLng.lat();
                    const lng = event.latLng.lng();
                    markerInstance.setPosition(event.latLng);
                    handleLocationChange(lat, lng);
                });
            }

            setMap(mapInstance);
            setMarker(markerInstance);

            if (initialLocation) {
                getAddress(initialLocation.lat, initialLocation.lng);
            }
        };

        if (window.google?.maps) {
            initMap();
        } else {
            window.initGoogleMaps = initMap;
        }

        return () => {
            if (marker) marker.setMap(null);
            if (map) setMap(null);
        };
    }, [initialLocation, isEditable, language]);

    const getAddress = (lat, lng) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            onLocationSelect({
                latitude: lat,
                longitude: lng,
                address: status === 'OK' && results[0]
                    ? results[0].formatted_address
                    : language === 'ar' ? 'لم يتم العثور على عنوان' : 'Address not found'
            });
        });
    };

    return (
        <div
            ref={mapRef}
            className="w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-300"
        />
    );
} 