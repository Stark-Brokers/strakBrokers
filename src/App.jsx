import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Login from './components/auth/Login';
import AvailableProperties from './components/properties/AvailableProperties'
import PropertyDetails from './components/properties/PropertyDetails'
import RenterLayout from './components/renter/RenterLayout'
import Profile from './components/renter/Profile'
import Tours from './components/renter/Tours'
import SavedProperties from './components/renter/SavedProperties'
import MyBookings from './components/renter/MyBookings'
import MapView from './components/categories/MapView'
import CustomerService from './components/categories/CustomerService'
import Home from './components/Home';

// Import Owner Components
import OwnerLayout from './components/owner/OwnerLayout'
import OwnerProfile from './components/owner/Profile'
import MyProperties from './components/owner/MyProperties'
import PropertyForm from './components/owner/PropertyForm'
import TourRequests from './components/owner/TourRequests'
import OwnerSettings from './components/owner/Settings'

// Add this import
import Register from './components/auth/Register';
import { Toaster } from 'react-hot-toast';

function AppContent() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home language={language} />} />
          <Route path="/properties/available" element={<AvailableProperties language={language} />} />
          <Route path="/properties/:id" element={<PropertyDetails language={language} />} />
          <Route path="/map" element={<MapView language={language} />} />
          <Route path="/customer-service" element={<CustomerService language={language} />} />

          {/* Auth Routes */}
          <Route path="/login">
            <Route path="renter" element={<Login language={language} userType="renter" />} />
            <Route path="owner" element={<Login language={language} userType="owner" />} />
          </Route>

          {/* Register Routes */}
          <Route path="/register">
            <Route path="renter" element={<Register language={language} userType="renter" />} />
            <Route path="owner" element={<Register language={language} userType="owner" />} />
          </Route>

          {/* Renter Routes */}
          <Route path="/renter" element={<RenterLayout language={language} />}>
            <Route path="profile" element={<Profile language={language} />} />
            <Route path="tours" element={<Tours language={language} />} />
            <Route path="bookings" element={<MyBookings language={language} />} />
            <Route path="saved" element={<SavedProperties language={language} />} />
          </Route>

          {/* Owner Routes */}
          <Route path="/owner" element={<OwnerLayout language={language} />}>
            <Route path="profile" element={<OwnerProfile language={language} />} />
            <Route path="properties" element={<MyProperties language={language} />} />
            <Route path="properties/add" element={<PropertyForm language={language} />} />
            <Route path="properties/edit/:id" element={<PropertyForm language={language} />} />
            <Route path="requests" element={<TourRequests language={language} />} />
            <Route path="settings" element={<OwnerSettings language={language} />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </>
  );
}

export default App;