import { LoadScriptNext } from '@react-google-maps/api';

export const libraries = ['places'];

export const defaultCenter = {
    lat: 24.7136,
    lng: 46.6753
};

export const mapOptions = {
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
};

export const loadScriptProps = {
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
    id: 'google-map-script',
    language: 'ar',
    region: 'SA'
}; 