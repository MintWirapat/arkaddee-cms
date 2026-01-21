import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import ShopRegistrationForm from './ShopRegistrationForm';
import api from '../../services/api';
import axios from 'axios';

const ShopEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [storeTypes, setStoreTypes] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [typesRes, cuisinesRes] = await Promise.all([
          axios.get('https://api.arkaddee.com/api/store-types'),
          axios.get('https://api.arkaddee.com/api/cuisines')
        ]);
        
        setStoreTypes(typesRes.data.data || []);
        setCuisineTypes(cuisinesRes.data.data || []);
        
        await fetchShopData(typesRes.data.data, cuisinesRes.data.data);
      } catch (error) {
        console.error('❌ Error fetching initial data:', error);
        setLoading(false);
      }
    };
    
    fetchAll();
  }, [id]);

  // 🔥 FIX: ปรับปรุง transformBackendToForm เพื่อให้ location ถูกต้อง
  const transformBackendToForm = (backendData, allTypes, allCuisines) => {
    console.log('📄 Transforming backend data to form structure...');
    console.log('📥 Backend data:', backendData);
    console.log('📍 Backend location:', {
      latitude: backendData.latitude,
      longitude: backendData.longitude
    });

    let addressComponents = {
      house_number: '',
      moo: '',
      soi: '',
      subdistrict: '',
      district: '',
      province: '',
      postal_code: ''
    };

    if (backendData.address && typeof backendData.address === 'string') {
      console.log('🏠 Parsing address string:', backendData.address);
      
      const addressStr = backendData.address;
      
      // Split by comma and trim, filter out empty strings
      const parts = addressStr.split(',').map(p => p.trim()).filter(p => p !== '');
      
      console.log('📝 Address parts:', parts);
      
      // Parse: "123/4, หมู่ test, แม่ต้าน, ท่าสองยาง, ตาก, 63150"
      // Strategy: Work backwards since postal code is usually last
      
      // parts[0] = "123/4" (house number) - always first
      if (parts.length >= 1) {
        addressComponents.house_number = parts[0];
      }
      
      // Find postal code (5 digits at the end)
      const lastPart = parts[parts.length - 1];
      if (/^\d{5}$/.test(lastPart)) {
        addressComponents.postal_code = lastPart;
        
        // Province is second to last
        if (parts.length >= 2) {
          addressComponents.province = parts[parts.length - 2];
        }
        
        // District is third to last
        if (parts.length >= 3) {
          addressComponents.district = parts[parts.length - 3];
        }
        
        // Subdistrict is fourth to last
        if (parts.length >= 4) {
          addressComponents.subdistrict = parts[parts.length - 4];
        }
        
        // Handle moo and soi from remaining parts (between house number and subdistrict)
        if (parts.length >= 2) {
          const middleParts = parts.slice(1, parts.length - 4);
          
          for (const part of middleParts) {
            if (part.includes('หมู่')) {
              addressComponents.moo = part.replace(/หมู่/gi, '').trim();
            } else if (!addressComponents.soi) {
              addressComponents.soi = part;
            }
          }
        }
      } else {
        // No postal code detected, assume order: house, [moo/soi], subdistrict, district, province
        if (parts.length >= 2 && parts[1].includes('หมู่')) {
          addressComponents.moo = parts[1].replace(/หมู่/gi, '').trim();
        } else if (parts.length >= 2) {
          addressComponents.soi = parts[1];
        }
        
        if (parts.length >= 5) {
          addressComponents.province = parts[4];
          addressComponents.district = parts[3];
          addressComponents.subdistrict = parts[2];
        } else if (parts.length === 4) {
          addressComponents.district = parts[3];
          addressComponents.subdistrict = parts[2];
        } else if (parts.length === 3) {
          addressComponents.subdistrict = parts[2];
        }
      }
      
      console.log('✅ Parsed address components:', addressComponents);
    }

    let typeIds = [];
    let cuisineIds = [];

    if (backendData.types && Array.isArray(backendData.types)) {
      backendData.types.forEach(typeItem => {
        if (typeof typeItem === 'object' && typeItem.id) {
          typeIds.push(typeItem.id);
        } else if (typeof typeItem === 'string') {
          const found = allTypes.find(t => t.name === typeItem);
          if (found) typeIds.push(found.id);
        }
      });
    }

    if (backendData.cuisines && Array.isArray(backendData.cuisines)) {
      backendData.cuisines.forEach(cuisineItem => {
        if (typeof cuisineItem === 'object' && cuisineItem.id) {
          cuisineIds.push(cuisineItem.id);
        } else if (typeof cuisineItem === 'string') {
          const found = allCuisines.find(c => c.name === cuisineItem);
          if (found) cuisineIds.push(found.id);
        }
      });
    }

    console.log('🏷️ Converted to IDs:');
    console.log('  - Types:', typeIds);
    console.log('  - Cuisines:', cuisineIds);

    let openingHours = [];
    if (backendData.openingHours && backendData.openingHours.length > 0) {
      openingHours = backendData.openingHours.map(hour => ({
        day_of_week: hour.day_of_week,
        is_open: hour.is_open,
        open_time: hour.open_time?.substring(0, 5) || '10:00',
        close_time: hour.close_time?.substring(0, 5) || '22:00'
      }));
    } else {
      openingHours = [0, 1, 2, 3, 4, 5, 6].map(day => ({
        day_of_week: day,
        is_open: true,
        open_time: '10:00',
        close_time: '22:00'
      }));
    }

    // 🔥 FIX: ดึง latitude/longitude จาก backendData อย่างถูกต้อง
    const latitude = parseFloat(backendData.latitude) || 13.7563;
    const longitude = parseFloat(backendData.longitude) || 100.5018;

    const formData = {
      name: backendData.name || '',
      description: backendData.description || '',
      price_range: backendData.price_range || '฿฿',
      average_price_per_person: backendData.average_price_per_person || 0,
      category: backendData.types && backendData.types.length > 0 ? 
        (typeof backendData.types[0] === 'string' ? backendData.types[0] : backendData.types[0].name) : '',
      open_time: backendData.open_time || '09:00:00',
      close_time: backendData.close_time || '21:00:00',
      latitude: latitude,
      longitude: longitude,
      phone: backendData.phone_number || '',
      has_air_purifier: backendData.has_air_purifier || false,
      has_fresh_air_system: backendData.has_air_ventilator || false,
      images: backendData.images || [],
      types: typeIds,
      cuisines: cuisineIds,
      openingHours: openingHours,
      full_address: backendData.address || '',
      house_number: addressComponents.house_number,
      moo: addressComponents.moo,
      soi: addressComponents.soi,
      district: addressComponents.district || backendData.district || '',
      province: addressComponents.province,
      subdistrict: addressComponents.subdistrict,
      postal_code: addressComponents.postal_code,
      // 🔥 FIX: ดึง location object จาก backendData อย่างถูกต้อง
      location: {
        latitude: latitude,
        longitude: longitude
      },
      address: {
        full_address: backendData.address || '',
        house_number: addressComponents.house_number,
        moo: addressComponents.moo,
        soi: addressComponents.soi,
        district: addressComponents.district || backendData.district || '',
        province: addressComponents.province,
        subdistrict: addressComponents.subdistrict,
        postal_code: addressComponents.postal_code
      },
      isApproved: backendData.status === 'active',
    };

    console.log('✅ Transformed form data:', formData);
    console.log('📍 Form location:', formData.location);
    
    return formData;
  };

  /**
   * ✅ FIX: ปรับปรุง transformFormToBackend เพื่อให้ location อัปเดตถูกต้อง
   */
  const transformFormToBackend = (formData) => {
    console.log('📄 Transforming form data to backend structure...');
    console.log('📥 Form data:', formData);
    console.log('📍 Location data:', {
      latitude: formData.latitude || formData.location?.latitude,
      longitude: formData.longitude || formData.location?.longitude
    });

    // ✅ รวมรูปทั้งหมดเป็น array เดียว
    const allImages = [];

    if (formData.images && Array.isArray(formData.images)) {
      formData.images.forEach(img => {
        if (typeof img === 'string') {
          // Normalize to relative path
          const normalizedPath = img.startsWith('http') 
            ? img.replace('https://api.arkaddee.com', '') 
            : img;
          
          allImages.push(normalizedPath);
        }
      });
    }

    console.log('📸 All images (combined):', allImages);

    // 🔥 FIX: ต้องดึง latitude/longitude จาก location object ถูกต้อง
    const latitude = parseFloat(formData.location?.latitude || formData.latitude || 13.7563);
    const longitude = parseFloat(formData.location?.longitude || formData.longitude || 100.5018);

    // ⚠️ Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      console.warn('⚠️ Invalid coordinates detected:', { latitude, longitude });
    }

    const backendData = {
      name: formData.name,
      description: formData.description,
      address: {
        houseNo: formData.house_number || formData.address?.house_number || '',
        moo: formData.moo || formData.address?.moo || '',
        soi: formData.soi || formData.address?.soi || '',
        subDistrict: formData.subdistrict || formData.address?.subdistrict || '',
        district: formData.district || formData.address?.district || '',
        province: formData.province || formData.address?.province || '',
        zipCode: formData.postal_code || formData.address?.postal_code || '',
        mobile: formData.phone || ''
      },
      // 🔥 FIX: ส่ง latitude/longitude ที่ดึงมาจาก location object
      latitude: latitude,
      longitude: longitude,
      open_time: formData.open_time,
      close_time: formData.close_time,
      price_range: formData.price_range,
      average_price_per_person: parseInt(formData.average_price_per_person) || 0,
      types: formData.types || [],
      cuisines: formData.cuisines || [],
      openingHours: formData.openingHours || [],
      // ✅ ส่ง images เป็น array เดียว
      images: allImages,
      hasAirPurifier: formData.has_air_purifier || false,
      hasAirVentilator: formData.has_fresh_air_system || false,
      // ✅ ส่ง status: 'active' (approved) หรือ 'pending' (not approved)
      status: formData.isApproved ? 'active' : 'pending'
    };

    console.log('✅ Transformed backend data:', backendData);
    console.log('🏠 Address object:', backendData.address);
    console.log('📍 Location (Lat/Long):', { 
      latitude: backendData.latitude, 
      longitude: backendData.longitude 
    });
    console.log('📸 Images array:', backendData.images);

    return backendData;
  };

  const fetchShopData = async (allTypes, allCuisines) => {
    try {
      setLoading(true);
      console.log('📦 Fetching shop data for edit:', id);
      
      const response = await api.shop.getById(id);
      console.log('📦 Raw backend response:', response);

      const formattedData = transformBackendToForm(response, allTypes, allCuisines);
      
      setShopData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('❌ Error fetching shop:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      console.log('🚀 Form submitted from ShopRegistrationForm:', formData);

      const backendData = transformFormToBackend(formData);
      
      console.log('📤 Sending to backend:', backendData);

      const response = await api.shop.update(id, backendData);
      console.log('✅ Update response:', response);

      alert('✅ แก้ไขข้อมูลร้านค้าสำเร็จ!');
      
      navigate(`/shops/${id}`, { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('❌ Error updating shop:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถแก้ไขข้อมูลได้'));
    }
  };

  const handleCancel = () => {
    navigate(`/shops/${id}`);
  };

  const handleApprove = () => {
    // ✅ Handler นี้เป็น dummy - toggle เกิดขึ้นใน ShopRegistrationForm (handleToggleApproval)
    // เมื่อกดบันทึก จะส่ง status ไปกับข้อมูลใน handleSubmit
    console.log('📝 Toggle approval switch - status จะเปลี่ยนในฟอร์ม');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-2">ไม่พบข้อมูลร้านค้า</p>
          <button
            onClick={() => navigate('/shops')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            กลับไปหน้ารายการร้านค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/shops/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="ย้อนกลับ"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลร้านค้า</h1>
              <p className="text-sm text-gray-600 mt-1">
                แก้ไขข้อมูลร้านค้า "{shopData.name}"
              </p>
            </div>
          </div>
        </div>

        <ShopRegistrationForm
          initialData={shopData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onApprove={handleApprove}
          approving={approving}
          isEditMode={true}
        />
      </div>
    </div>
  );
};

export default ShopEditPage;