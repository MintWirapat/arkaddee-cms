import React, { useState, useEffect } from 'react';
import { 
  PhotoIcon, 
  MapPinIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ShopRegistrationForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_range: '',
    open_time: '',
    close_time: '',
    category: '',
    subcategory: '',
    location: {
      latitude: 13.7563,
      longitude: 100.5018
    },
    address: {
      house_number: '',
      village: '',
      soi: '',
      province: '',
      district: '',
      subdistrict: '',
      postal_code: ''
    },
    phone: '',
    images: [],
    has_air_purifier: false,
    has_fresh_air_system: false
  });

  const [errors, setErrors] = useState({});
  const [subcategories, setSubcategories] = useState([]);

  // Mock categories data
  const categories = [
    { id: 1, name: 'คาเฟ่' },
    { id: 2, name: 'ร้านอาหาร' },
    { id: 3, name: 'เครื่องดื่ม' },
    { id: 4, name: 'ร้านขนม' },
    { id: 5, name: 'บาร์' }
  ];

  const subcategoriesData = {
    '1': [
      { id: 101, name: 'กาแฟ & เบเกอรี่' },
      { id: 102, name: 'คาเฟ่สไตล์มินิมอล' },
      { id: 103, name: 'คาเฟ่สวน/ธรรมชาติ' }
    ],
    '2': [
      { id: 201, name: 'ปิ้งย่าง & หมูกระทะ' },
      { id: 202, name: 'อาหารญี่ปุ่น' },
      { id: 203, name: 'อาหารทะเล' },
      { id: 204, name: 'อาหารไทย' }
    ],
    '3': [
      { id: 301, name: 'สมูทตี้ & น้ำผลไม้' },
      { id: 302, name: 'ชาไข่มุก' },
      { id: 303, name: 'น้ำปั่น' }
    ]
  };

  const provinces = [
    'กรุงเทพมหานคร',
    'เชียงใหม่',
    'ปทุมธานี',
    'ภูเก็ต',
    'ขอนแก่น',
    'นครราชสีมา'
  ];

  // Handle category change and load subcategories
  useEffect(() => {
    if (formData.category) {
      const categoryId = categories.find(c => c.name === formData.category)?.id;
      setSubcategories(subcategoriesData[categoryId] || []);
    }
  }, [formData.category]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (formData.images.length + files.length > 5) {
      alert('สามารถอัปโหลดรูปภาพได้สูงสุด 5 รูป');
      return;
    }

    // Mock image URLs (in real app, upload to server)
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      file: file
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const removeImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'กรุณากรอกชื่อร้านค้า';
    if (!formData.description.trim()) newErrors.description = 'กรุณากรอกรายละเอียด';
    if (!formData.price_range) newErrors.price_range = 'กรุณาเลือกช่วงราคา';
    if (!formData.category) newErrors.category = 'กรุณาเลือกหมวดหมู่';
    if (!formData.phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    if (!formData.address.province) newErrors.province = 'กรุณาเลือกจังหวัด';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
            1
          </span>
          ข้อมูลพื้นฐาน
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shop Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อสถานที่/ร้านค้า <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="เช่น คาเฟ่ในสวนใบไม้"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดร้านค้า <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-2.5 border ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="อธิบายถึงบรรยากาศ อาหาร และจุดเด่นของร้าน"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ช่วงราคา <span className="text-red-500">*</span>
            </label>
            <select
              name="price_range"
              value={formData.price_range}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${
                errors.price_range ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="">เลือกช่วงราคา</option>
              <option value="฿">฿ (ราคาประหยัด 1-100 บาท)</option>
              <option value="฿฿">฿฿ (ราคาปานกลาง 100-300 บาท)</option>
              <option value="฿฿฿">฿฿฿ (ราคาค่อนข้างแพง 300+ บาท)</option>
            </select>
            {errors.price_range && <p className="mt-1 text-sm text-red-600">{errors.price_range}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์ <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${
                errors.phone ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              placeholder="0812345678"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เวลาเปิด
            </label>
            <input
              type="time"
              name="open_time"
              value={formData.open_time}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เวลาปิด
            </label>
            <input
              type="time"
              name="close_time"
              value={formData.close_time}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Category Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
            2
          </span>
          หมวดหมู่
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมวดหมู่สถานที่ <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="">เลือกหมวดหมู่</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รายละเอียดสถานที่
            </label>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              disabled={!formData.category}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">เลือกประเภทย่อย</option>
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
            3
          </span>
          ที่อยู่และตำแหน่ง
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              บ้านเลขที่
            </label>
            <input
              type="text"
              name="address.house_number"
              value={formData.address.house_number}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="123/4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมู่ที่
            </label>
            <input
              type="text"
              name="address.village"
              value={formData.address.village}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ซอย
            </label>
            <input
              type="text"
              name="address.soi"
              value={formData.address.soi}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="สุขุมวิท 50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              จังหวัด <span className="text-red-500">*</span>
            </label>
            <select
              name="address.province"
              value={formData.address.province}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${
                errors.province ? 'border-red-300' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
            >
              <option value="">เลือกจังหวัด</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            {errors.province && <p className="mt-1 text-sm text-red-600">{errors.province}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              อำเภอ/เขต
            </label>
            <input
              type="text"
              name="address.district"
              value={formData.address.district}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="คลองเตย"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ตำบล/แขวง
            </label>
            <input
              type="text"
              name="address.subdistrict"
              value={formData.address.subdistrict}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="พระโขนง"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              รหัสไปรษณีย์
            </label>
            <input
              type="text"
              name="address.postal_code"
              value={formData.address.postal_code}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="10110"
              maxLength="5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="w-5 h-5 inline mr-2" />
              พิกัดที่ตั้ง (Google Maps)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                step="0.000001"
                name="location.latitude"
                value={formData.location.latitude}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Latitude"
              />
              <input
                type="number"
                step="0.000001"
                name="location.longitude"
                value={formData.location.longitude}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Longitude"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              💡 คลิกขวาบน Google Maps แล้วเลือก "คัดลอกพิกัด" เพื่อนำมาใส่
            </p>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
            4
          </span>
          รูปภาพร้านค้า (สูงสุด 5 รูป)
        </h3>

        <div className="space-y-4">
          {/* Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {formData.images.map((image) => (
              <div key={image.id} className="relative group aspect-square">
                <img
                  src={image.url}
                  alt="Shop"
                  className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
            {formData.images.length < 5 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">เพิ่มรูปภาพ</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      </div>

      {/* Equipment Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-3 text-sm font-bold">
            5
          </span>
          อุปกรณ์ฟอกอากาศ
        </h3>

        <div className="space-y-4">
          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="has_air_purifier"
              checked={formData.has_air_purifier}
              onChange={handleInputChange}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              ใช้เครื่องฟอกอากาศ
            </span>
          </label>

          <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              name="has_fresh_air_system"
              checked={formData.has_fresh_air_system}
              onChange={handleInputChange}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-900">
              ใช้เครื่องเติมอากาศใหม่
            </span>
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
        >
          บันทึกข้อมูล
        </button>
      </div>
    </form>
  );
};

export default ShopRegistrationForm;
