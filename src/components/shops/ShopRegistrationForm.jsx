import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  MapPinIcon,
  XMarkIcon,
  PlusIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

// Days of week for opening hours
const DAYS_OF_WEEK = [
  { value: 0, label: 'อาทิตย์' },
  { value: 1, label: 'จันทร์' },
  { value: 2, label: 'อังคาร' },
  { value: 3, label: 'พุธ' },
  { value: 4, label: 'พฤหัสบดี' },
  { value: 5, label: 'ศุกร์' },
  { value: 6, label: 'เสาร์' }
];

const ShopRegistrationForm = ({ initialData = null, onSubmit, onCancel, isEditMode = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_range: '',
    average_price_per_person: '',
    category: '',
    location: {
      latitude: 13.7563,
      longitude: 100.5018
    },
    address: {
      full_address: '',
      house_number: '',
      moo: '',
      soi: '',
      district: '',
      province: '',
      subdistrict: '',
      postal_code: ''
    },
    phone: '',
    images: [],
    has_air_purifier: false,
    has_fresh_air_system: false,
    openingHours: DAYS_OF_WEEK.map(day => ({
      day_of_week: day.value,
      is_open: true,
      open_time: '10:00',
      close_time: '22:00'
    }))
  });

  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Address data from API
  const [addressData, setAddressData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  
  // Store types and cuisines from API (like PlaceRegistration.tsx)
  const [storeTypes, setStoreTypes] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [showTypePopup, setShowTypePopup] = useState(false);
  const [showCuisinePopup, setShowCuisinePopup] = useState(false);

  // Fetch store types and cuisines on mount
  useEffect(() => {
    const fetchTypesAndCuisines = async () => {
      try {
        const [typesRes, cuisinesRes] = await Promise.all([
          axios.get('https://api.arkaddee.com/api/store-types'),
          axios.get('https://api.arkaddee.com/api/cuisines')
        ]);
        setStoreTypes(typesRes.data.data || []);
        setCuisineTypes(cuisinesRes.data.data || []);
      } catch (error) {
        console.error('Error fetching types and cuisines:', error);
      }
    };
    fetchTypesAndCuisines();
  }, []);

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      
      // Load existing images
      if (initialData.images && initialData.images.length > 0) {
        const previews = initialData.images.map(img => {
          if (img.startsWith('http')) {
            return img;
          } else if (img.startsWith('/uploads')) {
            return `https://api.arkaddee.com${img}`;
          }
          return img;
        });
        setImagePreviews(previews);
      }
    }
  }, [initialData]);

  // Fetch provinces from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoadingAddress(true);
        const response = await axios.get('https://api.arkaddee.com/api/addresses/provinces');
        console.log('Provinces loaded:', response.data.length);
        setAddressData(response.data);
      } catch (error) {
        console.error('Error fetching provinces:', error);
        alert('ไม่สามารถโหลดข้อมูลที่อยู่ได้ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setLoadingAddress(false);
      }
    };
    fetchProvinces();
  }, []);

  // Get available districts based on selected province
  const availableDistricts = selectedProvince?.amphure || [];
  
  // Get available subdistricts based on selected district
  const availableSubDistricts = selectedDistrict?.tambon || [];

  // Handle type selection
  const selectType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  // Handle cuisine selection
  const selectCuisine = (cuisineId) => {
    if (selectedCuisines.includes(cuisineId)) {
      setSelectedCuisines(selectedCuisines.filter(id => id !== cuisineId));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisineId]);
    }
  };

  // Get filtered cuisines based on selected types
  const getFilteredCuisines = () => {
    if (selectedTypes.length === 0) return [];
    return cuisineTypes.filter(cuisine => 
      selectedTypes.includes(cuisine.store_type_id)
    );
  };

  // Remove type
  const removeType = (typeId) => {
    setSelectedTypes(selectedTypes.filter(id => id !== typeId));
    // Also remove associated cuisines
    const associatedCuisines = cuisineTypes
      .filter(c => c.store_type_id === typeId)
      .map(c => c.id);
    setSelectedCuisines(selectedCuisines.filter(id => !associatedCuisines.includes(id)));
  };

  // Remove cuisine
  const removeCuisine = (cuisineId) => {
    setSelectedCuisines(selectedCuisines.filter(id => id !== cuisineId));
  };

  // Get selected type/cuisine objects
  const selectedTypeObjects = storeTypes.filter(t => selectedTypes.includes(t.id));
  const selectedCuisineObjects = cuisineTypes.filter(c => selectedCuisines.includes(c.id));

  // Handle province selection
  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const province = addressData.find(p => p.name_th === provinceName);
    
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        province: provinceName,
        district: '',
        subdistrict: '',
        postal_code: ''
      }
    }));
  };

  // Handle district selection
  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const district = availableDistricts.find(d => d.name_th === districtName);
    
    setSelectedDistrict(district);
    setSelectedSubDistrict(null);

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        district: districtName,
        subdistrict: '',
        postal_code: ''
      }
    }));
  };

  // Handle subdistrict selection
  const handleSubDistrictChange = (e) => {
    const subDistrictName = e.target.value;
    const subDistrict = availableSubDistricts.find(s => s.name_th === subDistrictName);
    
    setSelectedSubDistrict(subDistrict);

    // Auto-fill postal code
    const postalCode = subDistrict?.zip_code || '';

    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        subdistrict: subDistrictName,
        postal_code: postalCode
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleOpeningHourChange = (dayIndex, field, value) => {
    setFormData(prev => {
      const newHours = [...prev.openingHours];
      newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
      return { ...prev, openingHours: newHours };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check total images
    const totalImages = formData.images.length + files.length;
    if (totalImages > 5) {
      alert(`สามารถอัพโหลดได้สูงสุด 5 รูป (คุณมีรูปอยู่แล้ว ${formData.images.length} รูป)`);
      return;
    }

    // Check file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversized = files.filter(f => f.size > maxSize);
    if (oversized.length > 0) {
      alert('มีไฟล์ที่มีขนาดเกิน 5MB กรุณาเลือกไฟล์ใหม่');
      return;
    }

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อร้าน';
    if (!formData.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทร';
    if (selectedTypes.length === 0) newErrors.category = 'กรุณาเลือกประเภทสถานที่';
    if (!formData.address.province) newErrors.province = 'กรุณาเลือกจังหวัด';
    if (!formData.address.district) newErrors.district = 'กรุณาเลือกอำเภอ';
    if (!formData.address.subdistrict) newErrors.subdistrict = 'กรุณาเลือกตำบล';
    if (!formData.address.house_number.trim()) newErrors.house_number = 'กรุณากรอกบ้านเลขที่';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setSubmitting(true);

    // Pass types and cuisines to parent
    const submitData = {
      ...formData,
      types: selectedTypes,
      cuisines: selectedCuisines
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Submit error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Information */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">ข้อมูลพื้นฐาน</h3>
        
        <div className="space-y-4">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ชื่อร้าน <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="เช่น คาเฟ่ในสวน"
            />
            {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียด</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="บรรยากาศและจุดเด่นของร้าน..."
            />
          </div>

          {/* Store Types */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทสถานที่ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTypePopup(!showTypePopup)}
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-left ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  เลือกประเภทสถานที่
                </button>
                
                {/* Selected Types Tags */}
                {selectedTypeObjects.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedTypeObjects.map(type => (
                      <span
                        key={type.id}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
                      >
                        {type.name}
                        <button
                          type="button"
                          onClick={() => removeType(type.id)}
                          className="ml-2 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Type Dropdown */}
                {showTypePopup && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {storeTypes.map(type => (
                      <div
                        key={type.id}
                        onClick={() => selectType(type.id)}
                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 flex justify-between items-center ${
                          selectedTypes.includes(type.id) ? 'bg-indigo-50' : ''
                        }`}
                      >
                        <span>{type.name}</span>
                        {selectedTypes.includes(type.id) && (
                          <span className="text-indigo-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.category}</p>}
            </div>
          </div>

          {/* Cuisines (only show if types selected) */}
          {selectedTypes.length > 0 && getFilteredCuisines().length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียดสถานที่
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCuisinePopup(!showCuisinePopup)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-left"
                  >
                    เลือกรายละเอียดสถานที่
                  </button>
                  
                  {/* Selected Cuisines Tags */}
                  {selectedCuisineObjects.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedCuisineObjects.map(cuisine => (
                        <span
                          key={cuisine.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                        >
                          {cuisine.name}
                          <button
                            type="button"
                            onClick={() => removeCuisine(cuisine.id)}
                            className="ml-2 hover:text-green-900"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* Cuisine Dropdown */}
                  {showCuisinePopup && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {getFilteredCuisines().map(cuisine => (
                        <div
                          key={cuisine.id}
                          onClick={() => selectCuisine(cuisine.id)}
                          className={`px-4 py-2 cursor-pointer hover:bg-green-50 flex justify-between items-center ${
                            selectedCuisines.includes(cuisine.id) ? 'bg-green-50' : ''
                          }`}
                        >
                          <span>{cuisine.name}</span>
                          {selectedCuisines.includes(cuisine.id) && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ช่วงราคา</label>
              <select
                name="price_range"
                value={formData.price_range}
                onChange={handleInputChange}
                className="w-full px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                <option value="">เลือก</option>
                <option value="฿">฿ (ถูก)</option>
                <option value="฿฿">฿฿ (ปานกลาง)</option>
                <option value="฿฿฿">฿฿฿ (แพง)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาเฉลี่ย</label>
              <input
                type="number"
                name="average_price_per_person"
                value={formData.average_price_per_person}
                onChange={handleInputChange}
                className="w-full px-2 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                placeholder="บาท"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทร <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0812345678"
            />
            {errors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">ที่อยู่ร้านค้า</h3>
        
        {loadingAddress && (
          <div className="text-center py-4 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
            <p className="text-sm">กำลังโหลดข้อมูลที่อยู่...</p>
          </div>
        )}

        <div className="space-y-4">
          {/* House Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              บ้านเลขที่ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address.house_number"
              value={formData.address.house_number}
              onChange={handleInputChange}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.house_number ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="123"
            />
            {errors.house_number && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.house_number}</p>}
          </div>

          {/* Moo & Soi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หมู่ที่</label>
              <input
                type="text"
                name="address.moo"
                value={formData.address.moo}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ซอย</label>
              <input
                type="text"
                name="address.soi"
                value={formData.address.soi}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="สุขุมวิท 11"
              />
            </div>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จังหวัด <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedProvince?.name_th || ''}
              onChange={handleProvinceChange}
              disabled={loadingAddress}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 ${
                errors.province ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">เลือกจังหวัด</option>
              {addressData.map((province) => (
                <option key={province.id} value={province.name_th}>
                  {province.name_th}
                </option>
              ))}
            </select>
            {errors.province && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.province}</p>}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อำเภอ/เขต <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedDistrict?.name_th || ''}
              onChange={handleDistrictChange}
              disabled={!selectedProvince || loadingAddress}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 ${
                errors.district ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">เลือกอำเภอ/เขต</option>
              {availableDistricts.map((district) => (
                <option key={district.id} value={district.name_th}>
                  {district.name_th}
                </option>
              ))}
            </select>
            {errors.district && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.district}</p>}
          </div>

          {/* Subdistrict */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ตำบล/แขวง <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedSubDistrict?.name_th || ''}
              onChange={handleSubDistrictChange}
              disabled={!selectedDistrict || loadingAddress}
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 ${
                errors.subdistrict ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">เลือกตำบล/แขวง</option>
              {availableSubDistricts.map((subdistrict) => (
                <option key={subdistrict.id} value={subdistrict.name_th}>
                  {subdistrict.name_th}
                </option>
              ))}
            </select>
            {errors.subdistrict && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.subdistrict}</p>}
          </div>

          {/* Postal Code (Auto-fill) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รหัสไปรษณีย์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address.postal_code}
              readOnly
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              placeholder="จะถูกกรอกอัตโนมัติเมื่อเลือกตำบล"
            />
            <p className="mt-1 text-xs text-gray-500">
              ✨ รหัสไปรษณีย์จะถูกกรอกอัตโนมัติเมื่อคุณเลือกตำบล
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">พิกัดที่ตั้ง</h3>
        
        <div className="space-y-4">
          {/* Google Maps Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps Link (แนะนำ)
            </label>
            <input
              type="text"
              placeholder="วาง Google Maps link ที่นี่ เช่น https://maps.app.goo.gl/xxx หรือ https://www.google.com/maps/@13.7563,100.5018,17z"
              className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              onPaste={(e) => {
                const link = e.clipboardData.getData('text');
                
                // Extract coordinates from various Google Maps formats
                let lat, lng;
                
                // Format 1: @13.7563,100.5018
                const match1 = link.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                if (match1) {
                  lat = parseFloat(match1[1]);
                  lng = parseFloat(match1[2]);
                }
                
                // Format 2: place/xxx/@13.7563,100.5018
                const match2 = link.match(/place\/[^\/]+\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                if (match2) {
                  lat = parseFloat(match2[1]);
                  lng = parseFloat(match2[2]);
                }
                
                // Format 3: q=13.7563,100.5018
                const match3 = link.match(/q=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
                if (match3) {
                  lat = parseFloat(match3[1]);
                  lng = parseFloat(match3[2]);
                }
                
                if (lat && lng) {
                  setFormData(prev => ({
                    ...prev,
                    location: { latitude: lat, longitude: lng }
                  }));
                  alert(`✅ ดึงพิกัดสำเร็จ!\nละติจูด: ${lat}\nลองจิจูด: ${lng}`);
                } else {
                  alert('❌ ไม่พบพิกัดใน link นี้\nกรุณาตรวจสอบ link อีกครั้ง');
                }
              }}
            />
            <p className="mt-1 text-xs text-gray-500">
              💡 วาง Google Maps link เพื่อดึงพิกัดอัตโนมัติ หรือกรอกละติจูด/ลองจิจูดด้านล่าง
            </p>
          </div>

          {/* Manual Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ละติจูด</label>
              <input
                type="number"
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleInputChange}
                step="0.000001"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ลองจิจูด</label>
              <input
                type="number"
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleInputChange}
                step="0.000001"
                className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Preview Link */}
          <div className="bg-blue-50 rounded-lg p-3 text-sm">
            <p className="text-blue-900 font-medium mb-1">🗺️ พิกัดปัจจุบัน:</p>
            <a
              href={`https://www.google.com/maps/@${formData.location.latitude},${formData.location.longitude},17z`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {formData.location.latitude.toFixed(6)}, {formData.location.longitude.toFixed(6)}
            </a>
          </div>
        </div>
      </div>

      {/* Opening Hours */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">เวลาเปิด-ปิด</h3>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">วัน</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">เวลาเปิด</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">เวลาปิด</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">เปิดทำการ</th>
              </tr>
            </thead>
            <tbody>
              {formData.openingHours.map((hour, idx) => {
                const day = DAYS_OF_WEEK.find(d => d.value === hour.day_of_week);
                return (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{day.label}</td>
                    
                    <td className="px-4 py-3 text-center">
                      <input
                        type="time"
                        value={hour.open_time}
                        onChange={(e) => handleOpeningHourChange(idx, 'open_time', e.target.value)}
                        disabled={!hour.is_open}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                      />
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <input
                        type="time"
                        value={hour.close_time}
                        onChange={(e) => handleOpeningHourChange(idx, 'close_time', e.target.value)}
                        disabled={!hour.is_open}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400 text-sm"
                      />
                    </td>
                    
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hour.is_open}
                        onChange={(e) => handleOpeningHourChange(idx, 'is_open', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3">
          {formData.openingHours.map((hour, idx) => {
            const day = DAYS_OF_WEEK.find(d => d.value === hour.day_of_week);
            return (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-gray-900">{day.label}</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-xs text-gray-600">เปิดทำการ</span>
                    <input
                      type="checkbox"
                      checked={hour.is_open}
                      onChange={(e) => handleOpeningHourChange(idx, 'is_open', e.target.checked)}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                  </label>
                </div>
                
                {hour.is_open && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">เวลาเปิด</label>
                      <input
                        type="time"
                        value={hour.open_time}
                        onChange={(e) => handleOpeningHourChange(idx, 'open_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">เวลาปิด</label>
                      <input
                        type="time"
                        value={hour.close_time}
                        onChange={(e) => handleOpeningHourChange(idx, 'close_time', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Images */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">รูปภาพร้านค้า</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Preview Images */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {imagePreviews.length < 5 && (
              <div>
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600 cursor-pointer"
                >
                  <PhotoIcon className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">อัปโหลด</span>
                </label>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            * อัปโหลดได้สูงสุด 5 รูป (รูปละไม่เกิน 5MB)
          </p>
        </div>
      </div>

      {/* Equipment */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">อุปกรณ์</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="has_air_purifier"
              checked={formData.has_air_purifier}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm sm:text-base text-gray-700">มีเครื่องฟอกอากาศ</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="has_fresh_air_system"
              checked={formData.has_fresh_air_system}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm sm:text-base text-gray-700">มีระบบระบายอากาศสด</span>
          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
        >
          {submitting ? 'กำลังบันทึก...' : isEditMode ? 'บันทึกการแก้ไข' : 'ลงทะเบียนร้านค้า'}
        </button>
      </div>
    </form>
  );
};

export default ShopRegistrationForm;