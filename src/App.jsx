import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import GoogleMapsProvider from './components/providers/GoogleMapsProvider';
import AppContent from './AppContent';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <GoogleMapsProvider>
          <AppContent />
        </GoogleMapsProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}