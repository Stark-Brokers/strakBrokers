import { useState, useEffect } from 'react';
import settingsAPI from '../services/settingsAPI';
import {
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter
} from 'react-icons/fa6';

export default function Footer({ language }) {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [logo, setLogo] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await settingsAPI.getSettings();
        setSettings(response);
        const logoUrl = settingsAPI.getSettingValue(response, 'site_logo');
        if (logoUrl) {
          setLogo(logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const getSocialIcon = (key) => {
    const iconClasses = "w-5 h-5";

    switch (key.toLowerCase()) {
      case 'linkedin':
        return <FaLinkedinIn className={iconClasses} />;
      case 'twitter':
      case 'x':
        return <FaXTwitter className={iconClasses} />;
      case 'instagram':
        return <FaInstagram className={iconClasses} />;
      case 'facebook':
        return <FaFacebookF className={iconClasses} />;
      case 'whatsapp':
        return <FaWhatsapp className={iconClasses} />;
      default:
        return null;
    }
  };

  const getSocialLabel = (key) => {
    switch (key.toLowerCase()) {
      case 'linkedin':
        return language === 'ar' ? 'لينكد إن' : 'LinkedIn';
      case 'twitter':
      case 'x':
        return language === 'ar' ? 'تويتر' : 'Twitter';
      case 'instagram':
        return language === 'ar' ? 'انستغرام' : 'Instagram';
      case 'facebook':
        return language === 'ar' ? 'فيسبوك' : 'Facebook';
      case 'whatsapp':
        return language === 'ar' ? 'واتساب' : 'WhatsApp';
      default:
        return key;
    }
  };

  return (
    <footer className="bg-white mt-auto py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between">
          {/* Logo - Left */}
          <div className="mb-6 md:mb-0">
            <img
              src={logo}
              alt="Footer Logo"
              className="h-32 md:h-40 w-auto"
            />
          </div>

          {/* Copyright - Center */}
          <div className="text-center mb-6 md:mb-0">
            <p className={`text-sm text-gray-600 ${language === 'ar' ? 'font-arabic' : ''}`}>
              {language === 'ar'
                ? `© ${currentYear} ستارك للوساطة العقارية جميع الحقوق محفوظة.`
                : `© ${currentYear} Stark Brokers All rights reserved.`}
            </p>
          </div>

          {/* Social Media Icons - Right */}
          <div className="flex items-center gap-4">
            {settings?.data?.social_media?.map((social) => {
              const icon = getSocialIcon(social.key);
              if (!icon) return null;

              return (
                <a
                  key={social.id}
                  href={social.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 hover:bg-[#BE092B] hover:text-white transition-all duration-300"
                  aria-label={getSocialLabel(social.key)}
                  title={getSocialLabel(social.key)}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
