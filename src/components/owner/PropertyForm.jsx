import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiUpload, FiX } from 'react-icons/fi'
import { propertyAPI } from '../../services/api'

export default function PropertyForm({ language }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [propertyTypes, setPropertyTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    price: '',
    number_bedroom: '',
    number_bathroom: '',
    area: '',
    city: '',
    district: '',
    street: '',
    building_number: '',
    features: [],
    image: []
  })
  const [submitStatus, setSubmitStatus] = useState({ success: false, message: '' })
  const [errors, setErrors] = useState({})
  const [previewImages, setPreviewImages] = useState([])

  const content = {
    en: {
      title: id ? 'Edit Property' : 'Add New Property',
      propertyDetails: 'Property Details',
      propertyType: 'Property Type',
      location: 'Location',
      specifications: 'Specifications',
      amenities: 'Amenities',
      additionalFeatures: 'Additional Features',
      images: 'Property Images',
      submit: id ? 'Update Property' : 'Add Property',
      cancel: 'Cancel',
      categories: {
        'Amenities': 'Amenities',
        'Additional Features': 'Additional Features'
      },
      features: {
        'feature 1': 'Parking',
        'Feature 2': 'Swimming Pool'
      },
      fields: {
        title: 'Property Title',
        description: 'Description',
        type: 'Type',
        price: 'Price (SAR)',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms',
        area: 'Area (m²)',
        location: 'Location',
        yearBuilt: 'Year Built',
        furnished: 'Furnished',
        address: 'Property Address',
        city: 'City',
        district: 'District',
        street: 'Street Name',
        building_number: 'Building Number'
      },
      types: {
        apartment: 'Apartment',
        villa: 'Villa',
        office: 'Office',
        shop: 'Shop',
        land: 'Land'
      },
      locations: {
        riyadh: 'Riyadh',
        jeddah: 'Jeddah',
        dammam: 'Dammam',
        khobar: 'Khobar'
      },
      views: {
        'sea view': 'Sea View',
        'city view': 'City View',
        'garden view': 'Garden View',
        'street view': 'Street View',
        'mall view': 'Mall View'
      },
      amenityOptions: {
        'parking': 'Parking',
        'swimming pool': 'Swimming Pool',
        'gym': 'Gym',
        '24/7 security': '24/7 Security',
        'elevator': 'Elevator',
        'garden': 'Garden',
        'central ac': 'Central AC',
        'balcony': 'Balcony',
        'maid\'s room': 'Maid\'s Room',
        'storage room': 'Storage Room',
        'kitchen appliances': 'Kitchen Appliances',
        'internet': 'Internet',
        'satellite/cable tv': 'Satellite/Cable TV',
        'intercom': 'Intercom',
        'maintenance': 'Maintenance',
        'nearby mosque': 'Nearby Mosque',
        'shopping centers': 'Shopping Centers',
        'schools nearby': 'Schools Nearby',
        'pets allowed': 'Pets Allowed',
        'sea view': 'Sea View',
        'city view': 'City View',
        'garden view': 'Garden View',
        'street view': 'Street View',
        'mall view': 'Mall View'
      },
      dragDrop: 'Drag and drop images here, or click to select',
      maxFiles: 'Maximum 10 images'
    },
    ar: {
      title: id ? 'تعديل العقار' : 'إضافة عقار جديد',
      propertyDetails: 'تفاصيل العقار',
      propertyType: 'نوع العقار',
      location: 'الموقع',
      specifications: 'المواصفات',
      amenities: 'المميزات',
      additionalFeatures: 'مميزات إضافية',
      images: 'صور العقار',
      submit: id ? 'تحديث العقار' : 'إضافة العقار',
      cancel: 'إلغاء',
      categories: {
        'Amenities': 'المرافق',
        'Additional Features': 'مميزات إضافية'
      },
      features: {
        'feature 1': 'موقف سيارات',
        'Feature 2': 'مسبح'
      },
      fields: {
        title: 'عنوان العقار',
        description: 'الوصف',
        type: 'النوع',
        price: 'السعر (ريال)',
        bedrooms: 'غرف النوم',
        bathrooms: 'دورات المياه',
        area: 'المساحة (م²)',
        location: 'الموقع',
        yearBuilt: 'سنة البناء',
        furnished: 'مفروش',
        address: 'عنوان العقار',
        city: 'المدينة',
        district: 'الحي',
        street: 'اسم الشارع',
        building_number: 'رقم المبنى'
      },
      types: {
        apartment: 'شقة',
        villa: 'فيلا',
        office: 'مكتب',
        shop: 'محل',
        land: 'أرض'
      },
      locations: {
        riyadh: 'الرياض',
        jeddah: 'جدة',
        dammam: 'الدمام',
        khobar: 'الخبر'
      },
      views: {
        'sea view': 'إطلالة بحرية',
        'city view': 'إطلالة على المدينة',
        'garden view': 'إطلالة على الحديقة',
        'street view': 'إطلالة على الشارع',
        'mall view': 'إطلالة على المول'
      },
      amenityOptions: {
        'parking': 'موقف سيارات',
        'swimming pool': 'مسبح',
        'gym': 'صالة رياضية',
        '24/7 security': 'حراسة أمنية 24/7',
        'elevator': 'مصعد',
        'garden': 'حديقة',
        'central ac': 'تكييف مركزي',
        'balcony': 'شرفة',
        'maid\'s room': 'غرفة خادمة',
        'storage room': 'غرفة تخزين',
        'kitchen appliances': 'أجهزة مطبخ',
        'internet': 'إنترنت',
        'satellite/cable tv': 'قنوات فضائية/تلفاز',
        'intercom': 'اتصال داخلي',
        'maintenance': 'صيانة',
        'nearby mosque': 'مسجد قريب',
        'shopping centers': 'مراكز تسوق قريبة',
        'schools nearby': 'مدارس قريبة',
        'pets allowed': 'يسمح بالحيوانات الأليفة',
        'sea view': 'إطلالة بحرية',
        'city view': 'إطلالة على المدينة',
        'garden view': 'إطلالة على الحديقة',
        'street view': 'إطلالة على الشارع',
        'mall view': 'إطلالة على المول'
      },
      dragDrop: 'اسحب وأفلت الصور هنا، أو انقر للاختيار',
      maxFiles: 'الحد الأقصى 10 صور',
      cities: {
        riyadh: 'الرياض',
        jeddah: 'جدة',
        mecca: 'مكة المكرمة',
        medina: 'المدينة المنورة',
        dammam: 'الدمام',
        khobar: 'الخبر',
        dhahran: 'الظهران',
        jubail: 'الجبيل',
        taif: 'الطائف',
        abha: 'أبها'
      }
    }
  }

  const t = content[language]

  useEffect(() => {
    fetchInitialData()
    if (id) {
      fetchPropertyData()
    }
  }, [id])

  const fetchInitialData = async () => {
    try {
      const [typesResponse, categoriesResponse] = await Promise.all([
        propertyAPI.getPropertyTypes(),
        propertyAPI.getFeatures()
      ])

      if (typesResponse?.data) {
        setPropertyTypes(typesResponse.data)
      }
      if (categoriesResponse?.data) {
        setCategories(categoriesResponse.data)
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      setErrors(prev => ({
        ...prev,
        submit: language === 'ar'
          ? 'فشل في تحميل البيانات الأولية'
          : 'Failed to load initial data'
      }))
    }
  }

  const fetchPropertyData = async () => {
    try {
      setLoading(true)
      const response = await propertyAPI.getPropertyById(id)
      if (response?.data) {
        const propertyData = response.data
        let city = '', district = '', street = '', building_number = '';
        if (propertyData.address) {
          const addressParts = propertyData.address.split(', ');
          if (addressParts.length >= 4) {
            [building_number, street, district, city] = addressParts;
          }
        }

        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          type: propertyData.type || '',
          price: propertyData.price || '',
          number_bedroom: propertyData.number_bedroom || '',
          number_bathroom: propertyData.number_bathroom || '',
          area: propertyData.area || '',
          city,
          district,
          street,
          building_number,
          features: propertyData.features?.map(f => f.id) || [],
          image: propertyData.images?.map(img => img.url) || []
        })

        // Set preview images for existing images
        setPreviewImages(propertyData.images?.map(img => img.url) || [])
      }
    } catch (error) {
      console.error('Failed to fetch property:', error)
      setErrors(prev => ({
        ...prev,
        submit: language === 'ar'
          ? 'فشل في تحميل بيانات العقار'
          : 'Failed to load property data'
      }))
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    // Validate file count
    if (files.length + formData.image.length > 10) {
      setErrors(prev => ({
        ...prev,
        image: language === 'ar'
          ? 'الحد الأقصى 10 صور'
          : 'Maximum 10 images allowed'
      }))
      return
    }

    // Validate file types and sizes
    const validFiles = []
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const newPreviews = []
    const invalidFiles = []

    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (invalid type)`)
        continue
      }

      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (too large, max 5MB)`)
        continue
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      validFiles.push(file)
      newPreviews.push(previewUrl)
    }

    if (invalidFiles.length > 0) {
      setErrors(prev => ({
        ...prev,
        image: `Invalid files: ${invalidFiles.join(', ')}`
      }))
    }

    if (validFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        image: [...prev.image, ...validFiles]
      }))
      setPreviewImages(prev => [...prev, ...newPreviews])
      setErrors(prev => ({ ...prev, image: undefined }))
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index)
    }))
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      // Validate required fields
      const validationErrors = {}

      if (!formData.title?.trim()) validationErrors.title = 'The title field is required.'
      if (!formData.price) validationErrors.price = 'The price field is required.'
      if (!formData.type) validationErrors.type = 'The type field is required.'
      if (!formData.area) validationErrors.area = 'The area field is required.'
      if (!formData.city) validationErrors.city = 'City is required.'
      if (!formData.district) validationErrors.district = 'District is required.'
      if (!formData.street) validationErrors.street = 'Street name is required.'
      if (!formData.building_number) validationErrors.building_number = 'Building number is required.'
      if (!id && !formData.image?.length) validationErrors.image = 'At least one image is required.'

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        return
      }

      // Combine address fields
      const fullAddress = [
        formData.building_number,
        formData.street,
        formData.district,
        formData.city
      ].filter(Boolean).join(', ')

      // Create FormData instance
      const submitFormData = new FormData()

      // Add basic fields
      submitFormData.append('title', formData.title.trim())
      submitFormData.append('description', formData.description?.trim() || '')
      submitFormData.append('type', formData.type)
      submitFormData.append('price', parseFloat(formData.price))
      submitFormData.append('area', parseFloat(formData.area))
      submitFormData.append('address', fullAddress)

      // Add features as array
      if (formData.features && formData.features.length > 0) {
        formData.features.forEach(featureId => {
          submitFormData.append('features[]', featureId)
        })
      }

      // Add images as array with proper naming
      if (formData.image && formData.image.length > 0) {
        formData.image.forEach((image, index) => {
          if (image instanceof File) {
            submitFormData.append(`image[${index}]`, image)
          } else if (typeof image === 'string' && image.startsWith('http')) {
            // Keep existing image URLs
            submitFormData.append(`existing_images[]`, image)
          }
        })
      }

      // Add optional fields if they have valid values
      const bedroomValue = parseInt(formData.number_bedroom)
      if (bedroomValue && bedroomValue > 0) {
        submitFormData.append('number_bedroom', bedroomValue)
      }

      const bathroomValue = parseInt(formData.number_bathroom)
      if (bathroomValue && bathroomValue > 0) {
        submitFormData.append('number_bathroom', bathroomValue)
      }

      const response = id
        ? await propertyAPI.updateProperty(id, submitFormData)
        : await propertyAPI.createProperty(submitFormData)

      if (response.success) {
        setSubmitStatus({
          success: true,
          message: language === 'ar'
            ? (id ? 'تم تحديث العقار بنجاح' : 'تم إضافة العقار بنجاح')
            : (id ? 'Property updated successfully' : 'Property added successfully')
        })

        setTimeout(() => navigate('/owner/properties'), 2000)
      }
    } catch (error) {
      console.error('Form submission error:', error)

      if (error.error) {
        const apiErrors = {}
        error.error.forEach(err => {
          apiErrors[err.field] = err.messages
        })
        setErrors(apiErrors)
      } else {
        setErrors({
          submit: language === 'ar'
            ? 'حدث خطأ أثناء حفظ العقار. يرجى المحاولة مرة أخرى.'
            : 'An error occurred while saving the property. Please try again.'
        })
      }

      setSubmitStatus({
        success: false,
        message: language === 'ar'
          ? (id ? 'حدث خطأ أثناء تحديث العقار' : 'حدث خطأ أثناء حفظ العقار')
          : (id ? 'Failed to update property' : 'Failed to save property')
      })
    } finally {
      setLoading(false)
    }
  }

  const FieldError = ({ error }) => {
    if (!error) return null
    return <p className="mt-1 text-sm text-red-600">{error}</p>
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className={`text-2xl font-bold mb-6 ${language === 'ar' ? 'font-arabic' : ''}`}>
        {t.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Property Details */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.propertyDetails}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.title}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value })
                  // Clear error when field is updated
                  setErrors(prev => ({ ...prev, title: undefined }))
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary ${errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.description}
              </label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.type}
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">{t.fields.type}</option>
                {propertyTypes.map(type => (
                  <option key={type} value={type}>{t.types[type]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.price}
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.specifications}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bedrooms}
                <span className="text-gray-400 ml-1">(Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.number_bedroom}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only set the value if it's greater than 0
                  if (value && parseInt(value) > 0) {
                    setFormData({ ...formData, number_bedroom: value });
                  } else {
                    setFormData({ ...formData, number_bedroom: '' });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.bathrooms}
                <span className="text-gray-400 ml-1">(Optional)</span>
              </label>
              <input
                type="number"
                min="1"
                value={formData.number_bathroom}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only set the value if it's greater than 0
                  if (value && parseInt(value) > 0) {
                    setFormData({ ...formData, number_bathroom: value });
                  } else {
                    setFormData({ ...formData, number_bathroom: '' });
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.area}
              </label>
              <input
                type="number"
                required
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* Replace the old address field with this new Location section */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.location}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.city}
              </label>
              <select
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">{language === 'ar' ? 'اختر المدينة' : 'Select City'}</option>
                {Object.entries(t.cities || {
                  riyadh: language === 'ar' ? 'الرياض' : 'Riyadh',
                  jeddah: language === 'ar' ? 'جدة' : 'Jeddah',
                  dammam: language === 'ar' ? 'الدمام' : 'Dammam',
                  khobar: language === 'ar' ? 'الخبر' : 'Khobar',
                  mecca: language === 'ar' ? 'مكة المكرمة' : 'Mecca',
                  medina: language === 'ar' ? 'المدينة المنورة' : 'Medina',
                  taif: language === 'ar' ? 'الطائف' : 'Taif',
                  abha: language === 'ar' ? 'أبها' : 'Abha'
                }).map(([key, value]) => (
                  <option key={key} value={value}>{value}</option>
                ))}
              </select>
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.district}
              </label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder={language === 'ar' ? 'أدخل اسم الحي' : 'Enter district name'}
              />
              {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.street}
              </label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder={language === 'ar' ? 'أدخل اسم الشارع' : 'Enter street name'}
              />
              {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.fields.building_number}
              </label>
              <input
                type="text"
                required
                value={formData.building_number}
                onChange={(e) => setFormData({ ...formData, building_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder={language === 'ar' ? 'أدخل رقم المبنى' : 'Enter building number'}
              />
              {errors.building_number && <p className="mt-1 text-sm text-red-600">{errors.building_number}</p>}
            </div>
          </div>
        </section>

        {/* Features Section */}
        {categories.map(category => (
          <section key={category.id} className="space-y-4">
            <h2 className={`text-xl font-semibold ${language === 'ar' ? 'font-arabic' : ''}`}>
              {t.categories[category.name]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {category.features.map(feature => {
                // Get the translated feature name using lowercase name for consistency
                const featureName = t.amenityOptions[feature.name.toLowerCase()];

                return (
                  <label key={feature.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature.id)}
                      onChange={(e) => {
                        const newFeatures = e.target.checked
                          ? [...formData.features, feature.id]
                          : formData.features.filter(id => id !== feature.id);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{featureName}</span>
                  </label>
                );
              })}
            </div>
          </section>
        ))}

        {/* Images */}
        <section>
          <h2 className={`text-xl font-semibold mb-4 ${language === 'ar' ? 'font-arabic' : ''}`}>
            {t.images}
          </h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="images"
            />
            <label
              htmlFor="images"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FiUpload className="w-8 h-8 text-gray-400" />
              <span className="text-gray-600">{t.dragDrop}</span>
              <span className="text-sm text-gray-500">
                {language === 'ar' ? 'الحد الأقصى 10 صور' : 'Maximum 10 images'}
              </span>
            </label>
          </div>

          {formData.image.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {formData.image.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={previewImages[index]}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/owner/properties')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                <span>{language === 'ar' ? 'يرجى الانتظار...' : 'Please wait...'}</span>
              </>
            ) : (
              t.submit
            )}
          </button>
        </div>
      </form>

      {/* Status Messages */}
      {(submitStatus.message || loading) && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${loading ? 'bg-blue-100 text-blue-800' :
          submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          <div className="flex items-center gap-3">
            {loading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                <span>{language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
              </>
            ) : (
              <>
                <span>{submitStatus.message}</span>
                {!submitStatus.success && (
                  <button
                    onClick={handleSubmit}
                    className="ml-3 text-sm underline hover:no-underline"
                  >
                    {language === 'ar' ? 'حاول مرة أخرى' : 'Try Again'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {Object.keys(errors).length > 0 && (
        <div className="text-red-500 text-sm mt-4 space-y-1">
          {Object.entries(errors).map(([field, message]) => (
            <p key={field} className="flex items-center gap-2">
              <span>•</span>
              <span>{message}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
} 