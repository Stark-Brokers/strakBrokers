import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Profile({ language, userType }) {
  const navigate = useNavigate();
  const { user, token, loading: authLoading, logout, updateAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    business_name: '',
    business_license: '',
    address: '',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login/' + userType);
      return;
    }
    loadProfile();
  }, [token, userType]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.getUserProfile();
      console.log('👤 Profile data:', response.data);

      if (response.success && response.data) {
        updateAuth(null, response.data);
        setFormData(response.data);
      } else if (response.status === 401) {
        await logout();
        navigate('/login/' + userType, {
          state: { message: 'Session expired. Please login again.' }
        });
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('❌ Profile error:', err);
      setError('Unable to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(formData);
      console.log('👤 Updated profile data:', response.data);

      if (response.success && response.data) {
        updateAuth(null, response.data);
        setEditMode(false);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('❌ Update profile error:', err);
      setError('Unable to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const content = {
    en: {
      title: 'Profile',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email',
      type: 'Account Type',
      businessName: 'Business Name',
      businessLicense: 'Business License',
      address: 'Address',
      memberSince: 'Member Since',
      loading: 'Loading profile...',
      retry: 'Retry',
      noData: 'No profile data available',
      types: {
        owner: 'Property Owner',
        renter: 'Renter'
      },
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      profileDetails: 'Profile Details',
      businessDetails: 'Business Details',
      accountDetails: 'Account Details',
    },
    ar: {
      title: 'الملف الشخصي',
      fullName: 'الاسم الكامل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      type: 'نوع الحساب',
      businessName: 'اسم الشركة',
      businessLicense: 'الرخصة التجارية',
      address: 'العنوان',
      memberSince: 'تاريخ الإنضمام',
      loading: 'جاري تحميل الملف الشخصي...',
      retry: 'إعادة المحاولة',
      noData: 'لا توجد بيانات متاحة',
      types: {
        owner: 'مالك عقار',
        renter: 'مستأجر'
      },
      edit: 'تعديل',
      save: 'حفظ',
      cancel: 'إلغاء',
      profileDetails: 'تفاصيل الملف الشخصي',
      businessDetails: 'تفاصيل العمل',
      accountDetails: 'تفاصيل الحساب',
    }
  };

  const t = content[language];

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadProfile}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  const profileData = user || authUser;

  if (!profileData) {
    return (
      <div className="text-center py-8">
        {t.noData}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className={`text-2xl font-bold mb-8 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">{t.profileDetails}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fullName}
              </label>
              {editMode ? (
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <div className="mt-1 text-gray-900">{profileData.full_name}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone}
              </label>
              {editMode ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              ) : (
                <div className="mt-1 text-gray-900 font-mono">
                  {profileData.phone}
                </div>
              )}
            </div>

            {profileData.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.email}
                </label>
                {editMode ? (
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="mt-1 text-gray-900">{profileData.email}</div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Business Details */}
        {profileData.type === 'owner' && (
          <section className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">{t.businessDetails}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.businessName}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="business_name"
                    name="business_name"
                    value={formData.business_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="mt-1 text-gray-900">
                    {profileData.business_name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.businessLicense}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="business_license"
                    name="business_license"
                    value={formData.business_license}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="mt-1 text-gray-900">
                    {profileData.business_license}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.address}
                </label>
                {editMode ? (
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                ) : (
                  <div className="mt-1 text-gray-900">{profileData.address}</div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Account Details */}
        <section className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">{t.accountDetails}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.type}
              </label>
              <div className="mt-1 text-gray-900">{t.types[profileData.type]}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.memberSince}
              </label>
              <div className="mt-1 text-gray-900">{profileData.created_at}</div>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="md:col-span-2 flex justify-end gap-4">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData(profileData);
                }}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 text-lg font-medium"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 text-lg font-medium"
              >
                {loading ? '...' : t.save}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover text-lg font-medium"
            >
              {t.edit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
} 