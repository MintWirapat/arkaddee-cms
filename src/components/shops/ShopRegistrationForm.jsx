import React, { useState, useEffect } from 'react';
import {
  PhotoIcon,
  MapPinIcon,
  XMarkIcon,
  PlusIcon,
  CloudArrowUpIcon,
  CheckCircleIcon
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

// ✅ AddressForm Component
const AddressForm = ({ formData, setFormData, errors = {} }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    loadProvinces();
  }, []);

  const loadProvinces = async () => {
    try {
      setLoadingAddress(true);
      console.log('📥 Loading provinces...');
      const response = await axios.get('https://api.arkaddee.com/api/addresses/provinces');
      // API returns data directly (not wrapped in .data)
      const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
      console.log('✅ Provinces loaded:', data.length);
      setProvinces(data);
    } catch (error) {
      console.error('❌ Error loading provinces:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const province = provinces.find(p => p.name_th === provinceName);
    
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

  const handleDistrictChange = (e) => {
    const districtName = e.target.value;
    const province = provinces.find(p => p.name_th === formData.address?.province);
    const district = province?.amphure?.find(d => d.name_th === districtName);
    
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

  const handleSubDistrictChange = (e) => {
    const subdistrictName = e.target.value;
    const province = provinces.find(p => p.name_th === formData.address?.province);
    const district = province?.amphure?.find(d => d.name_th === formData.address?.district);
    const subdistrict = district?.tambon?.find(t => t.name_th === subdistrictName);
    
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        subdistrict: subdistrictName,
        postal_code: subdistrict?.zip_code || ''
      }
    }));
  };

  const handleLocationChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="space-y-4">
      {/* บ้านเลขที่ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">บ้านเลขที่ <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="เช่น 123/4"
          value={formData.address?.house_number || ''}
          onChange={(e) => handleAddressChange('house_number', e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.house_number ? 'border-red-500' : 'border-gray-300'}`}
        />
        {errors.house_number && <p className="text-red-500 text-sm mt-1">{errors.house_number}</p>}
      </div>

      {/* หมู่ที่ & ซอย */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">หมู่ที่</label>
          <input type="text" placeholder="เช่น 2" value={formData.address?.moo || ''} onChange={(e) => handleAddressChange('moo', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ซอย</label>
          <input type="text" placeholder="เช่น ซอย 123" value={formData.address?.soi || ''} onChange={(e) => handleAddressChange('soi', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition" />
        </div>
      </div>

      {/* จังหวัด */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">จังหวัด <span className="text-red-500">*</span></label>
        <select value={formData.address?.province || ''} onChange={handleProvinceChange} disabled={loadingAddress || provinces.length === 0} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white ${errors.province ? 'border-red-500' : 'border-gray-300'} ${loadingAddress ? 'opacity-50' : ''}`}>
          <option value="">เลือกจังหวัด</option>
          {provinces.map((prov) => (<option key={prov.id} value={prov.name_th}>{prov.name_th}</option>))}
        </select>
        {errors.province && <p className="text-red-500 text-sm mt-1">{errors.province}</p>}
      </div>

      {/* อำเภอ/เขต */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ/เขต <span className="text-red-500">*</span></label>
        {(() => {
          const province = provinces.find(p => p.name_th === formData.address?.province);
          const availableDistricts = province?.amphure || [];
          return (
            <select value={formData.address?.district || ''} onChange={handleDistrictChange} disabled={!formData.address?.province || loadingAddress} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white ${errors.district ? 'border-red-500' : 'border-gray-300'} ${!formData.address?.province || loadingAddress ? 'opacity-50' : ''}`}>
              <option value="">เลือกอำเภอ/เขต</option>
              {availableDistricts.map((dist) => (<option key={dist.id} value={dist.name_th}>{dist.name_th}</option>))}
            </select>
          );
        })()}
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      {/* ตำบล/แขวง */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ตำบล/แขวง <span className="text-red-500">*</span></label>
        {(() => {
          const province = provinces.find(p => p.name_th === formData.address?.province);
          const district = province?.amphure?.find(d => d.name_th === formData.address?.district);
          const availableSubDistricts = district?.tambon || [];
          return (
            <select value={formData.address?.subdistrict || ''} onChange={handleSubDistrictChange} disabled={!formData.address?.district || loadingAddress} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition appearance-none bg-white ${errors.subdistrict ? 'border-red-500' : 'border-gray-300'} ${!formData.address?.district || loadingAddress ? 'opacity-50' : ''}`}>
              <option value="">เลือกตำบล/แขวง</option>
              {availableSubDistricts.map((subdist) => (<option key={subdist.id} value={subdist.name_th}>{subdist.name_th}</option>))}
            </select>
          );
        })()}
        {errors.subdistrict && <p className="text-red-500 text-sm mt-1">{errors.subdistrict}</p>}
      </div>

      {/* รหัสไปรษณีย์ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">รหัสไปรษณีย์</label>
        <input type="text" placeholder="เช่น 50140" value={formData.address?.postal_code || ''} readOnly className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed" />
        <p className="mt-1 text-xs text-gray-500">✨ รหัสไปรษณีย์จะถูกกรอกอัตโนมัติเมื่อคุณเลือกตำบล/แขวง</p>
      </div>

      {/* เบอร์โทร & พิกัด (Latitude & Longitude) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">เบอร์โทร <span className="text-red-500">*</span></label>
          <input type="tel" placeholder="เช่น 0895605487" value={formData.phone || ''} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Latitude <span className="text-red-500">*</span></label>
          <input type="number" step="0.0000001" placeholder="18.7221619" value={formData.location?.latitude || ''} onChange={(e) => handleLocationChange('latitude', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.latitude ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Longitude <span className="text-red-500">*</span></label>
          <input type="number" step="0.0000001" placeholder="99.04523792" value={formData.location?.longitude || ''} onChange={(e) => handleLocationChange('longitude', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition ${errors.longitude ? 'border-red-500' : 'border-gray-300'}`} />
          {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
        </div>
      </div>

      {/* Preview Location */}
      {formData.location?.latitude && formData.location?.longitude && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-3">📍 ที่อยู่</p>
              
              {/* บ้านเลขที่ */}
              <div className="mb-2">
                <p className="text-xs font-medium text-blue-700 text-opacity-60">บ้านเลขที่:</p>
                <p className="text-sm text-blue-900">{formData.address?.house_number || '-'} {formData.address?.moo ? `หมู่ ${formData.address.moo}` : ''} {formData.address?.soi || ''}</p>
              </div>

              {/* เบอร์โทร */}
              {formData.phone && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-blue-700 text-opacity-60">เบอร์โทร:</p>
                  <p className="text-sm text-blue-600 font-semibold">{formData.phone}</p>
                </div>
              )}

              {/* ที่อยู่เต็ม */}
              <div className="mb-3">
                <p className="text-xs font-medium text-blue-700 text-opacity-60">ที่อยู่เต็ม:</p>
                <p className="text-sm text-blue-900">{formData.address?.subdistrict || '-'} {formData.address?.district || '-'} {formData.address?.province || '-'} {formData.address?.postal_code || '-'}</p>
              </div>

              {/* พิกัด */}
              <div className="mb-4">
                <p className="text-xs font-medium text-blue-700 text-opacity-60">พิกัด:</p>
                <p className="text-sm text-blue-600 font-mono">Lat: {formData.location.latitude}, Long: {formData.location.longitude}</p>
              </div>

              {/* Google Maps Button */}
              <a 
                href={`https://maps.google.com/?q=${formData.location.latitude},${formData.location.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
              >
                <MapPinIcon className="w-4 h-4" />
                เปิดใน Google Maps
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ShopRegistrationForm = ({ initialData = null, onSubmit, onCancel, onApprove, approving = false, isEditMode = false }) => {
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
    isApproved: false, // ✅ เพิ่มสถานะการอนุมัติ (false = pending/0, true = approved/1)
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

  // Advanced image upload states
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [loading, setLoading] = useState(false);

  // Address data from API
  const [addressData, setAddressData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Store types and cuisines from API
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
      console.log('📥 Loading initial data:', initialData);

      // Merge with existing formData instead of replacing
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));

      // Clear validation errors in edit mode
      setErrors({});
      console.log('✅ Validation errors cleared');


      // Load existing images for edit mode
      if (initialData.images && initialData.images.length > 0) {
        const existingImageData = initialData.images.map(img => {

          
          return img;

         
        });

        setExistingImages(existingImageData);
        
        setImagePreviews(existingImageData.map(img => img.url));
      }

      // Load types and cuisines if available
      if (initialData.types && initialData.types.length > 0) {
        const typeIds = initialData.types
          .filter(t => t !== null && t !== undefined)
          .map(t => typeof t === 'number' ? t : t.id);
        setSelectedTypes(typeIds);
        console.log('✅ Types loaded:', typeIds);
      }

      if (initialData.cuisines && initialData.cuisines.length > 0) {
        const cuisineIds = initialData.cuisines
          .filter(c => c !== null && c !== undefined)
          .map(c => typeof c === 'number' ? c : c.id);
        setSelectedCuisines(cuisineIds);
        console.log('✅ Cuisines loaded:', cuisineIds);
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

  // ✅ NEW: Sync address selections when both addressData and formData are ready
  useEffect(() => {
    // Only run in edit mode when we have both addressData and address values
    if (!initialData || addressData.length === 0) return;
    
    const { province, district, subdistrict } = formData.address;
    
    if (!province) return; // No address data to sync

    console.log('🏠 Syncing address selections:', { province, district, subdistrict });

    // Find and set province
    const provinceObj = addressData.find(p => p.name_th === province);
    if (provinceObj) {
      setSelectedProvince(provinceObj);
      console.log('✅ Province set:', province);

      // Find and set district
      if (district && provinceObj.amphure) {
        const districtObj = provinceObj.amphure.find(d => d.name_th === district);
        if (districtObj) {
          setSelectedDistrict(districtObj);
          console.log('✅ District set:', district);

          // Find and set subdistrict
          if (subdistrict && districtObj.tambon) {
            const subdistrictObj = districtObj.tambon.find(t => t.name_th === subdistrict);
            if (subdistrictObj) {
              setSelectedSubDistrict(subdistrictObj);
              console.log('✅ Subdistrict set:', subdistrict);
            }
          }
        }
      }
    }
  }, [addressData, formData.address.province, formData.address.district, formData.address.subdistrict, initialData]);

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

  // Advanced image handling
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const newPreviews = [];
    const newFiles = [];

    for (const file of files) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`ไฟล์ ${file.name} มีขนาดใหญ่เกิน 5MB`);
        continue;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`ไฟล์ ${file.name} ไม่ใช่รูปภาพ`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      newFiles.push(file);
      newPreviews.push({
        file: file,
        url: previewUrl,
        name: file.name,
        uploaded: false,
        uploadedUrl: null,
        isExisting: false
      });
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    const updatedPreviews = [...previews, ...newPreviews];

    setSelectedFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0 && existingImages.length === 0) {
      alert('กรุณาเลือกรูปภาพอย่างน้อย 1 รูป');
      return;
    }

    setLoading(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // Skip if already uploaded
        if (previews[i].uploaded) {
          uploadedUrls.push(previews[i].uploadedUrl);
          continue;
        }

        const formData = new FormData();
        formData.append('image', file);

        setUploadProgress(prev => ({ ...prev, [i]: 0 }));

        const response = await fetch('https://api.arkaddee.com/api/upload/image', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const result = await response.json();


        const imageUrl = result.url || result.data?.url || result.imageUrl;

        console.log('Extracted image URL for', file.name, ':', imageUrl);

        if (!imageUrl) {
          throw new Error(`No URL returned for ${file.name}`);
        }


        uploadedUrls.push(imageUrl);

        console.log('✅ Uploaded', file.name, 'to', uploadedUrls);


        setPreviews(prev => {
          const updated = prev.map((p, idx) =>
            idx === i ? { ...p, uploaded: true, uploadedUrl: imageUrl } : p
          );
          return updated;
        });

        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }

      setUploadedImages(uploadedUrls);
      alert('✅ อัปโหลดรูปภาพสำเร็จ!');

    } catch (error) {
      console.error('❌ Upload error:', error);
      alert('❌ เกิดข้อผิดพลาดในการอัปโหลด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removePreview = (index) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const getAllImages = () => {
    // Normalize existing images to relative paths
    const existing = existingImages.map(img => {
      const url = typeof img === 'string' ? img : img.url;
      // Remove domain prefix if present
      if (url.startsWith('https://api.arkaddee.com')) {
        return url.replace('https://api.arkaddee.com', '');
      }
      return url;
    });

    // ✅ FIX: ดึง uploaded URLs จาก previews (ไม่ใช่จาก uploadedImages state)
    const newUploaded = previews
      .filter(p => p.uploaded && p.uploadedUrl)
      .map(p => p.uploadedUrl);

    const allImages = [...existing, ...newUploaded];

    return allImages;
  };

  // Legacy image handling (keep for compatibility)
  const handleImageUpload = handleFileSelect;

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

  // ✅ Handler สำหรับ toggle approval switch
  const handleToggleApproval = () => {
    console.log('🔄 Toggling approval status...');
    setFormData(prev => ({
      ...prev,
      isApproved: !prev.isApproved
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setSubmitting(true);
    
    // Get all images (existing + newly uploaded)
    const allImages = getAllImages();
    console.log('📸 All images to submit:', allImages);

    // ✅ Transform address data: nested → flattened
    const flattenedFormData = {
      ...formData,
      // ✅ Flatten address fields to top level
      house_number: formData.address?.house_number || '',
      moo: formData.address?.moo || '',
      soi: formData.address?.soi || '',
      district: formData.address?.district || '',
      subdistrict: formData.address?.subdistrict || '',
      province: formData.address?.province || '',
      postal_code: formData.address?.postal_code || '',
      // ✅ Keep location nested but ensure values
      location: {
        latitude: formData.location?.latitude || 0,
        longitude: formData.location?.longitude || 0
      },
      // ✅ Replace nested address with flattened version
      address: {
        house_number: formData.address?.house_number || '',
        moo: formData.address?.moo || '',
        soi: formData.address?.soi || '',
        district: formData.address?.district || '',
        subdistrict: formData.address?.subdistrict || '',
        province: formData.address?.province || '',
        postal_code: formData.address?.postal_code || ''
      },
      types: selectedTypes,
      cuisines: selectedCuisines,
      images: allImages
    };

    console.log('🚀 Submitting flattened data:', flattenedFormData);
    console.log('📍 Address part:', {
      house_number: flattenedFormData.house_number,
      moo: flattenedFormData.moo,
      soi: flattenedFormData.soi,
      subdistrict: flattenedFormData.subdistrict,
      district: flattenedFormData.district,
      province: flattenedFormData.province,
      postal_code: flattenedFormData.postal_code
    });

    try {
      await onSubmit(flattenedFormData);
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
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
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
                  className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 text-left ${errors.category ? 'border-red-500' : 'border-gray-300'
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
                        className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 flex justify-between items-center ${selectedTypes.includes(type.id) ? 'bg-indigo-50' : ''
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
          {selectedTypes.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  รายละเอียดสถานที่
                </label>

                {/* Show message if no cuisines available */}
                {getFilteredCuisines().length === 0 ? (
                  <div className="text-sm text-gray-500 py-2">
                    ไม่มีรายละเอียดสถานที่สำหรับประเภทที่เลือก
                  </div>
                ) : (
                  <>
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
                              className={`px-4 py-2 cursor-pointer hover:bg-green-50 flex justify-between items-center ${selectedCuisines.includes(cuisine.id) ? 'bg-green-50' : ''
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
                  </>
                )}
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
              className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder="0812345678"
            />
            {errors.phone && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Address Information - using AddressForm Component */}
      <div className="card p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">📍 ที่อยู่ร้านค้า</h3>
        <AddressForm 
          formData={formData} 
          setFormData={setFormData}
          errors={errors}
        />
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
              {parseFloat(formData.location.latitude).toFixed(6)}, {parseFloat(formData.location.longitude).toFixed(6)}
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
          {/* Image Previews Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Existing Images */}
            {existingImages.map((img, index) => (
              
              console.log('Existing image URL:', img),

              <div key={`existing-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-green-200">
                <img

                  src={'https://api.arkaddee.com'+ img}
                  alt={`Existing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ✓ อัปโหลดแล้ว
                </div>
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* New Image Previews */}
            {previews.map((preview, index) => (
              <div key={`preview-${index}`} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={preview.uploaded && preview.uploadedUrl
                    ? `https://api.arkaddee.com${preview.uploadedUrl}`
                    : preview.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {preview.uploaded ? (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    ✓ อัปโหลดแล้ว
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                    รอการอัปโหลด
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
                {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                    {uploadProgress[index]}%
                  </div>
                )}
              </div>
            ))}

            {/* Upload Button */}
            <div>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center text-gray-500 hover:text-indigo-600 cursor-pointer"
              >
                <PhotoIcon className="w-8 h-8 mb-2" />
                <span className="text-sm font-medium">เลือกรูป</span>
              </label>
            </div>
          </div>

          {/* Upload Button */}
          {selectedFiles.length > 0 && (
            <button
              type="button"
              onClick={uploadImages}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  กำลังอัปโหลด...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="w-5 h-5" />
                  อัปโหลดรูปภาพ ({selectedFiles.length} รูป)
                </>
              )}
            </button>
          )}

          <p className="text-xs text-gray-500">
            * อัปโหลดได้สูงสุด 5MB ต่อรูป | รองรับ JPG, PNG, WebP
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
            <span className="text-sm sm:text-base text-gray-700">เครื่องฟอกอากาศ</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              name="has_fresh_air_system"
              checked={formData.has_fresh_air_system}
              onChange={handleCheckboxChange}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="text-sm sm:text-base text-gray-700">เครื่องระบายอากาศ</span>
          </label>
        </div>
      </div>

      {/* Approval Status & Submit Buttons */}
      <div className="flex flex-col gap-4">
        {/* ✅ สวิตช์อนุมัติร้านค้า (edit mode only) */}
        {isEditMode && onApprove && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">สถานะการอนุมัติ</p>
                  <p className="text-sm text-gray-600">เปิดใช้เพื่อให้ร้านค้าแสดงบนแอป</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={handleToggleApproval}
                disabled={approving}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  approving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  formData.isApproved ? 'bg-green-500' : 'bg-gray-300'
                }`}
                title={formData.isApproved ? 'คลิกเพื่อปิดการอนุมัติ' : 'คลิกเพื่อเปิดการอนุมัติ'}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    formData.isApproved ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {/* Status Display */}
            <div className="mt-3 text-sm">
              <p className="text-gray-700">
                สถานะปัจจุบัน: <span className={`font-bold ${formData.isApproved ? 'text-green-600' : 'text-red-600'}`}>
                  {formData.isApproved ? 'อนุมัติ  ✓' : 'รอการอนุมัติ '}
                </span>
              </p>
            </div>
          </div>
        )}

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
      </div>
    </form>
  );
};

export default ShopRegistrationForm;