import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import ShopRegistrationForm from './ShopRegistrationForm';
import axios from 'axios';

const ShopCreatePage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);

    try {
      console.log('📝 Creating shop with data:', formData);

      // Step 1: Upload images first and get URLs
      let imageUrls = [];

      if (formData.images && formData.images.length > 0) {
        console.log(`📸 Uploading ${formData.images.length} images...`);

        for (let i = 0; i < formData.images.length; i++) {
          try {
            console.log(`📤 Uploading image ${i + 1}/${formData.images.length}:`, formData.images[i].name);

            const uploadFormData = new FormData();
            uploadFormData.append('image', formData.images[i]);

            const uploadResponse = await axios.post(
              'https://api.arkaddee.com/api/upload/image',
              uploadFormData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );

            console.log(`✅ Upload response ${i + 1}:`, uploadResponse.data);

            const responseData = uploadResponse.data;

            if (responseData.status !== 'success') {
              throw new Error(`ไม่สามารถอัพโหลดรูปภาพที่ ${i + 1} ได้`);
            }

            const uploadResult = responseData.data;
            const imageUrl = uploadResult.url || uploadResult.imageUrl || uploadResult.path;

            if (!imageUrl) {
              throw new Error(`ไม่พบ URL รูปภาพที่ ${i + 1} ใน response`);
            }

            imageUrls.push(imageUrl);
            console.log(`✅ Image ${i + 1} uploaded, URL:`, imageUrl);

          } catch (uploadError) {
            console.error(`❌ Error uploading image ${i + 1}:`, uploadError);
            throw new Error(`ไม่สามารถอัพโหลดรูปภาพที่ ${i + 1} ได้: ${uploadError.message}`);
          }
        }

        console.log('✅ All images uploaded successfully:', imageUrls);
      }

      // Step 2: Prepare store data (following PlaceRegistration.tsx format)
      console.log('📋 Types and Cuisines:', {
        types: formData.types,
        cuisines: formData.cuisines
      });

      const storeData = {
        name: formData.name,
        description: formData.description,
        price_range: formData.price_range,
        types: formData.types || [], // Array of type IDs from form
        cuisines: formData.cuisines || [], // Array of cuisine IDs from form
        latitude: formData.location.latitude,
        longitude: formData.location.longitude,
        address: {
          houseNo: formData.address.house_number || '',
          moo: formData.address.moo || '',
          soi: formData.address.soi || '',
          subDistrict: formData.address.subdistrict || '',
          district: formData.address.district || '',
          province: formData.address.province || '',
          zipCode: formData.address.postal_code || '',
          mobile: formData.phone || ''
        },
        images: imageUrls, // Array of uploaded image URLs
        hasAirPurifier: formData.has_air_purifier || false,
        hasAirVentilator: formData.has_fresh_air_system || false,
        openingHours: formData.openingHours // Array of 7 days with open/close times
      };

      console.log('📤 Sending store data to API:', JSON.stringify(storeData, null, 2));

      // Step 3: Create store using fetch (like PlaceRegistration.tsx)
      const response = await fetch('https://api.arkaddee.com/api/stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeData)
      });

      console.log('📡 Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ API Error:', errorData);
        throw new Error(errorData.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      }

      const result = await response.json();
      console.log('✅ Store created successfully:', result);

      alert('✅ เพิ่มร้านค้าสำเร็จ!');

      console.log('🔄 Redirecting to /shops...');

      // Navigate and reload
      navigate('/shops', { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);

    } catch (error) {
      console.error('❌ Error creating shop:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMsg = error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'เกิดข้อผิดพลาดในการบันทึกข้อมูล';

      alert('❌ เกิดข้อผิดพลาด: ' + errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('คุณต้องการยกเลิกการเพิ่มร้านค้าหรือไม่?')) {
      navigate('/shops');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">เพิ่มร้านค้าใหม่</h1>
            <p className="text-sm text-gray-600 mt-1">กรอกข้อมูลร้านค้าเพื่อเพิ่มเข้าสู่ระบบ</p>
          </div>
        </div>
      </div>

      {/* Form */}
      {submitting ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังบันทึกข้อมูล...</p>
          <p className="text-sm text-gray-500 mt-2">กรุณารอสักครู่</p>
        </div>
      ) : (
        <ShopRegistrationForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isEditMode={false}
        />
      )}
    </div>
  );
};

export default ShopCreatePage;