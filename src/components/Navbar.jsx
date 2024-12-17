import { useState, useEffect } from 'react';
import { HiHome, HiUserGroup, HiUserCircle } from 'react-icons/hi';
import { BiCategory } from 'react-icons/bi';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import settingsAPI from '../services/settingsAPI';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showLoginOptions, setShowLoginOptions] = useState(false);
  const [logo, setLogo] = useState('');
  const [logoLoading, setLogoLoading] = useState(true);
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLogoLoading(true);
        const response = await settingsAPI.getSettings();
        const logoUrl = settingsAPI.getSettingValue(response, 'site_logo');
        if (logoUrl) {
          setLogo(logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLogoLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = {
    en: [
      { text: 'Home', icon: <HiHome className="text-xl" />, path: '/' },
      { text: 'Properties', icon: <BiCategory className="text-xl" />, path: '/properties/available' },
      { text: 'Map', icon: <FaMapMarkedAlt className="text-xl" />, path: '/map' },
      { text: 'Customer Service', icon: <HiUserGroup className="text-xl" />, path: '/customer-service' },
    ],
    ar: [
      { text: 'الرئيسية', icon: <HiHome className="text-xl" />, path: '/' },
      { text: 'العقارات', icon: <BiCategory className="text-xl" />, path: '/properties/available' },
      { text: 'الخريطة', icon: <FaMapMarkedAlt className="text-xl" />, path: '/map' },
      { text: 'خدمة العملاء', icon: <HiUserGroup className="text-xl" />, path: '/customer-service' },
    ]
  };

  const userMenuItems = {
    en: {
      renter: [
        { text: 'My Profile', path: '/renter/profile' },
        { text: 'My Tours', path: '/renter/tours' },
        { text: 'Saved Properties', path: '/renter/saved' },
        { text: 'Logout', action: handleLogout }
      ],
      owner: [
        { text: 'My Profile', path: '/owner/profile' },
        { text: 'My Properties', path: '/owner/properties' },
        { text: 'Add Property', path: '/owner/properties/add' },
        { text: 'Tour Requests', path: '/owner/requests' },
        { text: 'Logout', action: handleLogout }
      ]
    },
    ar: {
      renter: [
        { text: 'ملفي الشخصي', path: '/renter/profile' },
        { text: 'جولاتي', path: '/renter/tours' },
        { text: 'العقارات المحفوظة', path: '/renter/saved' },
        { text: 'تسجيل الخروج', action: handleLogout }
      ],
      owner: [
        { text: 'ملفي الشخصي', path: '/owner/profile' },
        { text: 'عقاراتي', path: '/owner/properties' },
        { text: 'إضافة عقار', path: '/owner/properties/add' },
        { text: 'طلبات الجولات', path: '/owner/requests' },
        { text: 'تسجيل الخروج', action: handleLogout }
      ]
    }
  };

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      navigate(item.path);
      setIsProfileMenuOpen(false);
    }
  };

  const getUserMenuItems = () => {
    if (!user || !user.type || !userMenuItems[language][user.type]) {
      return [];
    }
    return userMenuItems[language][user.type];
  };

  return (
    <nav className={`bg-white shadow-md sticky top-0 z-50 ${language === 'ar' ? 'font-arabic' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Language Toggle - Left */}
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 ${language === 'en'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1 ${language === 'ar'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
            >
              AR
            </button>
          </div>

          {/* Navigation Menu - Center */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-4">
            {navItems[language].map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 transition-colors ${location.pathname === item.path
                  ? 'text-primary font-semibold'
                  : 'text-gray-700 hover:text-primary'
                  }`}
              >
                {item.icon}
                <span>
                  {item.text}
                </span>
              </Link>
            ))}
          </div>

          {/* Logo and User - Right */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <span className="text-sm truncate max-w-[100px]">
                    {user.full_name}
                  </span>
                  <HiUserCircle className="w-8 h-8 text-gray-600" />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {getUserMenuItems().map((item, index) => (
                      <button
                        key={index}
                        onClick={() => handleMenuItemClick(item)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {item.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowLoginOptions(!showLoginOptions)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover"
                >
                  {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
                </button>

                {/* Login Options Dropdown */}
                {showLoginOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/login/renter"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      {language === 'ar' ? 'دخول كمستأجر' : 'Login as Renter'}
                    </Link>
                    <Link
                      to="/login/owner"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowLoginOptions(false)}
                    >
                      {language === 'ar' ? 'دخول كمالك' : 'Login as Owner'}
                    </Link>
                  </div>
                )}
              </div>
            )}
            <Link to="/">
              {logoLoading ? (
                <div className="h-14 md:h-16 w-32 bg-gray-100 animate-pulse rounded"></div>
              ) : (
                <img src={logo} alt="Logo" className="h-14 md:h-16 w-auto" />
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-full bg-white shadow-lg z-50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems[language].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>
                    {item.text}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;