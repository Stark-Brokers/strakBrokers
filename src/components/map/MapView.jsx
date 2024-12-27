import { useState, useCallback, useEffect, useMemo } from 'react'
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { propertyAPI } from '../../services/api';
import { FiMaximize, FiFilter } from 'react-icons/fi';
import { IoBedOutline, IoWaterOutline, IoLocationOutline } from "react-icons/io5";
import MapViewFilters from './MapViewFilters';

const containerStyle = {
    width: '100vw',
    height: 'calc(100vh - 80px)',
    position: 'relative',
    left: '50%',
    right: '50%',
    marginLeft: '-50vw',
    marginRight: '-50vw'
};

// Riyadh center coordinates (default fallback)
const defaultCenter = {
    lat: 24.7136,
    lng: 46.6753
};

const mapOptions = {
    disableDefaultUI: window.innerWidth < 768,
    zoomControl: window.innerWidth >= 768,
    streetViewControl: window.innerWidth >= 768,
    mapTypeControl: window.innerWidth >= 768,
    fullscreenControl: false,
    gestureHandling: 'greedy',
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
}

const libraries = ['places'];

const createLoaderOptions = (googleMapsApiKey) => ({
    id: 'google-map-script',
    googleMapsApiKey,
    libraries,
});

// Add geocoding service
const geocodeAddress = async (address) => {
    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve, reject) => {
        geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                resolve({
                    lat: location.lat(),
                    lng: location.lng()
                });
            } else {
                reject(new Error(`Geocoding failed: ${status}`));
            }
        });
    });
};

// Helper function to format address
const formatAddress = (address, language) => {
    if (!address) return '';

    // Split the address by commas
    const parts = address.split(',').map(part => part.trim());

    // Remove the Plus Code if it exists (e.g., PM7G+C4M)
    const filteredParts = parts.filter(part => !part.includes('+'));

    // For Saudi addresses, we typically want: District, City
    const district = filteredParts[0];
    const city = filteredParts[1];

    if (language === 'ar') {
        return `${district}، ${city}`;
    }
    return `${district}, ${city}`;
};

// Add translations
const content = {
    en: {
        propertyTypes: {
            apartment: 'Apartment',
            villa: 'Villa',
            office: 'Office',
            shop: 'Shop',
            land: 'Land'
        },
        viewDetails: 'View Details',
        yourLocation: 'Your Location',
        loadingError: 'Sorry, there was an error loading the map',
        locationError: 'Could not get your location. Showing Riyadh map.',
        filterProperties: 'Filter Properties'
    },
    ar: {
        propertyTypes: {
            apartment: 'شقة',
            villa: 'فيلا',
            office: 'مكتب',
            shop: 'محل',
            land: 'أرض'
        },
        viewDetails: 'عرض التفاصيل',
        yourLocation: 'موقعك الحالي',
        loadingError: 'عذراً، حدث خطأ في تحميل الخريطة',
        locationError: 'تعذر تحديد موقعك. عرض خريطة الرياض.',
        filterProperties: 'تصفية العقارات'
    }
};

export default function MapView({ language }) {
    const navigate = useNavigate();
    const [map, setMap] = useState(null);
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [center, setCenter] = useState(defaultCenter);
    const [userLocationError, setUserLocationError] = useState(null);
    const [showUserLocation, setShowUserLocation] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});

    const loaderOptions = useMemo(
        () => createLoaderOptions(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
        []
    );

    const { isLoaded, loadError } = useJsApiLoader(loaderOptions);

    const t = content[language];

    // Add user location icon
    const userLocationIcon = useMemo(() => isLoaded ? {
        path: "M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z",
        fillColor: "#4285F4",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
        scale: 1.2,
        anchor: new window.google.maps.Point(12, 12)
    } : null, [isLoaded]);

    // Add property icon definition
    const propertyIcon = useMemo(() => isLoaded ? {
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
        fillColor: "#BE092B",
        fillOpacity: 1,
        strokeWeight: 1.5,
        strokeColor: "#FFFFFF",
        scale: 1.3,
        anchor: new window.google.maps.Point(12, 22)
    } : null, [isLoaded]);

    // Get user's location
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('User location found:', userLocation);
                    setCenter(userLocation);
                },
                (error) => {
                    console.warn('Error getting location:', error);
                    setUserLocationError(error.message);
                    // Keep using default Riyadh coordinates
                }
            );
        } else {
            console.warn('Geolocation is not supported by this browser');
            setUserLocationError('Geolocation is not supported by this browser');
        }
    }, []);

    // Fetch properties
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await propertyAPI.getProperties();
                console.log('Raw API response:', response);

                if (response?.data) {
                    let propertyData = Array.isArray(response.data) ? response.data :
                        response.data.items ? response.data.items :
                            response.data.data ? response.data.data : [];

                    // Add coordinates to properties
                    const propertiesWithCoords = await Promise.all(
                        propertyData.map(async (property) => {
                            try {
                                if (property.address) {
                                    const coords = await geocodeAddress(property.address);
                                    return {
                                        ...property,
                                        latitude: coords.lat,
                                        longitude: coords.lng
                                    };
                                }
                                return property;
                            } catch (error) {
                                console.warn(`Failed to geocode address for property ${property.id}:`, error);
                                return property;
                            }
                        })
                    );

                    console.log('Properties with coordinates:', propertiesWithCoords);
                    setProperties(propertiesWithCoords);
                } else {
                    setProperties([]);
                    console.warn('No properties data found in response');
                }
            } catch (error) {
                console.error('Failed to fetch properties:', error);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch properties when the map is loaded
        if (isLoaded) {
            fetchProperties();
        }
    }, [isLoaded]); // Add isLoaded to dependencies

    // Update map language when language prop changes
    useEffect(() => {
        if (map) {
            map.setOptions({ language: language === 'ar' ? 'ar' : 'en' });
        }
    }, [language, map]);

    // Cleanup function
    useEffect(() => {
        return () => {
            if (map) {
                setMap(null);
            }
        };
    }, [map]);

    const onLoad = useCallback((map) => {
        if (properties.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();
            properties.forEach(property => {
                if (property.latitude && property.longitude) {
                    bounds.extend({
                        lat: parseFloat(property.latitude),
                        lng: parseFloat(property.longitude)
                    });
                }
            });
            map.fitBounds(bounds);
        } else {
            map.setCenter(center);
            map.setZoom(12);
        }
        map.setOptions({ language: language === 'ar' ? 'ar' : 'en' });
        setMap(map);
    }, [language, properties, center]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const handleMarkerClick = (property) => {
        setSelectedProperty(property);
    };

    const handleInfoWindowClose = () => {
        setSelectedProperty(null);
    };

    // Apply filters locally
    const applyFilters = useCallback(() => {
        console.log('Applying filters:', filters);
        let filtered = [...properties];

        if (filters.type && filters.type !== '') {
            filtered = filtered.filter(property =>
                property.type?.toLowerCase() === filters.type.toLowerCase()
            );
        }

        if (filters.city && filters.city !== '') {
            filtered = filtered.filter(property => {
                const cityName = filters.city.toLowerCase();
                const address = property.address?.toLowerCase() || '';
                return address.includes(cityName);
            });
        }

        if (filters.price_min && !isNaN(parseFloat(filters.price_min))) {
            filtered = filtered.filter(property =>
                property.price && parseFloat(property.price) >= parseFloat(filters.price_min)
            );
        }

        if (filters.price_max && !isNaN(parseFloat(filters.price_max))) {
            filtered = filtered.filter(property =>
                property.price && parseFloat(property.price) <= parseFloat(filters.price_max)
            );
        }

        if (filters.bedrooms && !isNaN(parseInt(filters.bedrooms))) {
            filtered = filtered.filter(property =>
                property.number_bedroom && parseInt(property.number_bedroom) === parseInt(filters.bedrooms)
            );
        }

        if (filters.bathrooms && !isNaN(parseInt(filters.bathrooms))) {
            filtered = filtered.filter(property =>
                property.number_bathroom && parseInt(property.number_bathroom) === parseInt(filters.bathrooms)
            );
        }

        if (filters.area_min && !isNaN(parseFloat(filters.area_min))) {
            filtered = filtered.filter(property =>
                property.area && parseFloat(property.area) >= parseFloat(filters.area_min)
            );
        }

        if (filters.area_max && !isNaN(parseFloat(filters.area_max))) {
            filtered = filtered.filter(property =>
                property.area && parseFloat(property.area) <= parseFloat(filters.area_max)
            );
        }

        setFilteredProperties(filtered);
    }, [filters, properties]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const handleApplyFilters = useCallback((newFilters) => {
        console.log('Setting new filters:', newFilters);
        setFilters(newFilters);
    }, []);

    if (loadError) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="text-red-500">
                    {t.loadingError}
                </div>
            </div>
        );
    }

    if (!isLoaded || loading) {
        return (
            <div className="h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            {/* Filter Button */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            >
                <FiFilter className={`w-5 h-5 ${showFilters ? 'text-[#BE092B]' : 'text-gray-600'}`} />
            </button>

            {/* Map Filters */}
            <MapViewFilters
                language={language}
                onFilterChange={handleApplyFilters}
                showFilters={showFilters}
            />

            {/* User location error message */}
            {userLocationError && (
                <div className="absolute top-4 right-4 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg shadow-sm">
                    {t.locationError}
                </div>
            )}

            {/* Map Component */}
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
                {/* User location marker */}
                <MarkerF
                    position={center}
                    icon={userLocationIcon}
                    onClick={() => setShowUserLocation(!showUserLocation)}
                />
                {showUserLocation && (
                    <InfoWindowF
                        position={center}
                        onCloseClick={() => setShowUserLocation(false)}
                    >
                        <div className="text-sm font-medium">
                            {t.yourLocation}
                        </div>
                    </InfoWindowF>
                )}

                {/* Property markers */}
                {Array.isArray(filteredProperties) && filteredProperties.map((property) => {
                    const lat = parseFloat(property?.latitude);
                    const lng = parseFloat(property?.longitude);

                    if (!isNaN(lat) && !isNaN(lng)) {
                        return (
                            <MarkerF
                                key={property.id}
                                position={{ lat, lng }}
                                onClick={() => handleMarkerClick(property)}
                                icon={propertyIcon}
                            />
                        );
                    }
                    return null;
                })}

                {selectedProperty && (
                    <InfoWindowF
                        position={{
                            lat: parseFloat(selectedProperty.latitude),
                            lng: parseFloat(selectedProperty.longitude)
                        }}
                        onCloseClick={handleInfoWindowClose}
                        options={{
                            pixelOffset: new window.google.maps.Size(0, -40),
                            maxWidth: window.innerWidth < 768 ? 220 : 300
                        }}
                    >
                        <div className="!overflow-hidden">
                            <div className={`w-full ${window.innerWidth < 768 ? 'max-w-[200px]' : 'max-w-[280px]'}`}>
                                <div className={`relative ${window.innerWidth < 768 ? 'w-[200px] h-[100px]' : 'w-[280px] h-[140px]'} mb-1.5 group`}>
                                    <img
                                        src={selectedProperty.images?.[currentImageIndex]?.url || 'https://placehold.co/300x150?text=No+Image'}
                                        alt={`${selectedProperty.title} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    {selectedProperty.images && selectedProperty.images.length > 1 && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                                            {selectedProperty.images.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCurrentImageIndex(index);
                                                    }}
                                                    className={`w-1 h-1 rounded-full transition-all ${index === currentImageIndex
                                                        ? 'bg-white scale-110'
                                                        : 'bg-white/50 hover:bg-white/75'
                                                        }`}
                                                    aria-label={`View image ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-semibold text-xs line-clamp-1 flex-1">{selectedProperty.title}</h3>
                                        <div className="bg-[#BE092B]/10 text-[#BE092B] px-1 rounded text-[8px] font-medium whitespace-nowrap">
                                            {t.propertyTypes[selectedProperty.type?.toLowerCase()] || selectedProperty.type}
                                        </div>
                                    </div>
                                    {selectedProperty.address && (
                                        <div className="flex items-start gap-0.5 text-[8px] text-gray-600">
                                            <IoLocationOutline className="text-[#BE092B] mt-0.5 flex-shrink-0 w-2.5 h-2.5" />
                                            <span className="line-clamp-1">{formatAddress(selectedProperty.address, language)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                        {selectedProperty.number_bedroom > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <IoBedOutline className="text-[#BE092B] w-2.5 h-2.5" />
                                                <span>{selectedProperty.number_bedroom}</span>
                                            </div>
                                        )}
                                        {selectedProperty.number_bathroom > 0 && (
                                            <div className="flex items-center gap-0.5">
                                                <IoWaterOutline className="text-[#BE092B] w-2.5 h-2.5" />
                                                <span>{selectedProperty.number_bathroom}</span>
                                            </div>
                                        )}
                                        {selectedProperty.area && (
                                            <div className="flex items-center gap-0.5">
                                                <FiMaximize className="text-[#BE092B] w-2.5 h-2.5" />
                                                <span>{selectedProperty.area}m²</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-1.5">
                                    <div className="text-[#BE092B] font-bold text-xs whitespace-nowrap">
                                        {selectedProperty.price} SAR
                                    </div>
                                    <button
                                        onClick={() => navigate(`/properties/${selectedProperty.id}`)}
                                        className="px-1.5 py-0.5 bg-[#BE092B] text-white text-[10px] rounded hover:bg-[#9C0722] transition-colors whitespace-nowrap"
                                    >
                                        {t.viewDetails}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </InfoWindowF>
                )}
            </GoogleMap>
        </div>
    );
} 