import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { productAPI, imageConverter } from '../../services/api';

const ProductCreatePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    model: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ขนาดไฟล์ต้องน้อยกว่า 5MB');
        return;
      }

      setImageFile(file);
      setError(null);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('กรุณากรอกชื่อสินค้า');
      return;
    }
    if (!formData.device_type.trim()) {
      setError('กรุณากรอกประเภทอุปกรณ์');
      return;
    }
    if (!formData.model.trim()) {
      setError('กรุณากรอกรุ่น');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = new FormData();

    // เพิ่มข้อมูลทั่วไป
    data.append('name', formData.name);
    data.append('device_type', formData.device_type);
    data.append('model', formData.model);
    data.append('description', formData.description);
    

    // เพิ่มไฟล์รูปภาพ (ถ้ามี)
    if (imageFile) {
      data.append('image', imageFile);
    }
      // Step 1: Create product
      console.log('📝 Creating product...');
      const response = await fetch('https://api.arkaddee.com/api/products', {
        method: 'POST',
        body: data
      }).then(res => res.json());

      if (response.success && response.data.id) {
        const productId = response.data.id;
        console.log('✅ Product created with ID:', productId);

    
        // Navigate to the new product detail page
        navigate(`/products/${productId}`);
      }
    } catch (err) {
      console.error('❌ Error creating product:', err);
      if (err.message) {
        setError(err.message);
      } else {
        setError('ไม่สามารถเพิ่มสินค้าได้');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>กลับ</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">เพิ่มสินค้าใหม่</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <div className="flex-1">{error}</div>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อสินค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="เช่น Arkad HM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Device Type Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภทอุปกรณ์ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="device_type"
              value={formData.device_type}
              onChange={handleChange}
              placeholder="เช่น Arkad_HM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              ใช้สำหรับการระบุประเภทอุปกรณ์ในระบบ
            </p>
          </div>

          {/* Model Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รุ่น <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="เช่น Model Arkad-HM"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียด
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="กรอกรายละเอียดสินค้า"
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              disabled={loading}
            />
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รูปภาพสินค้า
            </label>
            
            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative mb-4">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-48 w-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  ไฟล์: {imageFile?.name}
                </p>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  disabled={loading}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-700">
                    คลิกเพื่ออัปโหลดรูปภาพ
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF (Max 5MB)
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Link
              to="/products"
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              <span>{loading ? 'กำลังบันทึก...' : 'เพิ่มสินค้า'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreatePage;