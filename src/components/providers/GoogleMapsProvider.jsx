import { useLoadScript } from '@react-google-maps/api';
import { loadScriptProps } from '../../config/googleMapsConfig';

export default function GoogleMapsProvider({ children }) {
    const { isLoaded, loadError } = useLoadScript(loadScriptProps);

    if (loadError) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">
                    Failed to load Google Maps. Please try again later.
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