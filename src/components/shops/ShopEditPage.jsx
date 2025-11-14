import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

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

const ShopEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price_range: '',
    average_price_per_person: '',
    phone: '',
    full_address: '',
    district: '',
    house_number: '',
    moo: '',
    soi: '',
    province: '',
    subdistrict: '',
    postal_code: '',
    latitude: '',
    longitude: '',
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

  useEffect(() => {
    fetchShopData();
  }, [id]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const data = await api.shop.getById(id);
      console.log('Fetched shop data:', data);

      // Load opening hours from API or use default
      let openingHours = DAYS_OF_WEEK.map(day => ({
        day_of_week: day.value,
        is_open: true,
        open_time: '10:00',
        close_time: '22:00'
      }));

      if (data.openingHours && data.openingHours.length > 0) {
        openingHours = data.openingHours;
      }

      setFormData({
        name: data.name || '',
        description: data.description || '',
        category: data.types?.[0]?.name || '',
        price_range: data.price_range || '',
        average_price_per_person: data.average_price_per_person || '',
        phone: data.phone_number || '',
        full_address: data.address || '',
        district: data.district || '',
        house_number: '',
        moo: '',
        soi: '',
        province: '',
        subdistrict: '',
        postal_code: '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        images: data.images || [],
        has_air_purifier: data.has_air_purifier || false,
        has_fresh_air_system: data.has_air_ventilator || false,
        openingHours: openingHours
      });

      setShopData(data);
    } catch (error) {
      console.error('Error fetching shop:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOpeningHourChange = (dayIndex, field, value) => {
    setFormData(prev => {
      const newHours = [...prev.openingHours];
      newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
      return { ...prev, openingHours: newHours };
    });
  };

  const handleImageRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Create preview URLs for uploaded images
    const newImagePreviews = files.map(file => URL.createObjectURL(file));
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImagePreviews]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        description: formData.description,
        price_range: formData.price_range,
        average_price_per_person: formData.average_price_per_person,
        latitude: formData.latitude.toString(),
        longitude: formData.longitude.toString(),
        address: formData.full_address,
        district: formData.district,
        phone_number: formData.phone,
        has_air_purifier: formData.has_air_purifier,
        has_air_ventilator: formData.has_fresh_air_system,
        openingHours: formData.openingHours  // Send opening hours array
      };

      console.log('Updating shop with data:', updateData);

      await api.shop.update(id, updateData);
      alert('✅ แก้ไขข้อมูลร้านค้าสำเร็จ!');
      navigate(`/shops/${id}`);
    } catch (error) {
      console.error('Error updating shop:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถแก้ไขข้อมูลได้'));
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <button
            onClick={() => navigate(`/shops/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลร้านค้า</h1>
        </div>
        <p className="text-sm text-gray-600 ml-14">
          แก้ไขข้อมูลร้านค้า: <span className="font-medium">{shopData?.name}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">ข้อมูลพื้นฐาน</h2>

          <div className="space-y-4">
            {/* ชื่อร้าน */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อร้าน <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="LATTE AND LEAF"
              />
            </div>

            {/* รายละเอียด */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียด</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="ร้านกาแฟของคนรักต้นไม้..."
              />
            </div>

            {/* หมวดหมู่ & ประเภท */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่ <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="คาเฟ่">คาเฟ่</option>
                  <option value="ร้านอาหาร">ร้านอาหาร</option>
                  <option value="ร้านขนม">ร้านขนม</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="กาแฟ">กาแฟ</option>
                  <option value="เบเกอรี่">เบเกอรี่</option>
                </select>
              </div>
            </div>

            {/* ช่วงราคา, ราคา/คน */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ช่วงราคา</label>
                <select
                  name="price_range"
                  value={formData.price_range}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">เลือก</option>
                  <option value="฿">฿ (ไม่แพง)</option>
                  <option value="฿฿">฿฿ (ปานกลาง)</option>
                  <option value="฿฿฿">฿฿฿ (แพง)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ราคา/คน</label>
                <input
                  type="number"
                  name="average_price_per_person"
                  value={formData.average_price_per_person}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="250"
                />
              </div>
            </div>

            {/* เบอร์โทร */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทร <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0895605487"
              />
            </div>
          </div>
        </div>

        {/* ที่อยู่ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2" />
            ที่อยู่
          </h2>

          <div className="space-y-4">
            {/* ที่อยู่เต็ม */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">ที่อยู่เต็ม</label>
              <textarea
                name="full_address"
                value={formData.full_address}
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="ถ. ซุปเปอร์ไฮเวย์ เชียงใหม่-ลำปาง ตำบล ยางเนิ้ง..."
              />
            </div>

            {/* อำเภอ/เขต */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ/เขต</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="อำเภอสารภี"
              />
            </div>

            {/* บ้านเลขที่, หมู่, ซอย */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">บ้านเลขที่</label>
                <input
                  type="text"
                  name="house_number"
                  value={formData.house_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="123/4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">หมู่</label>
                <input
                  type="text"
                  name="moo"
                  value={formData.moo}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ซอย</label>
                <input
                  type="text"
                  name="soi"
                  value={formData.soi}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="สุขุมวิท 50"
                />
              </div>
            </div>

            {/* จังหวัด, อำเภอ/เขต */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จังหวัด <span className="text-red-500">*</span>
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">เลือกจังหวัด</option>
                  <option value="เชียงใหม่">เชียงใหม่</option>
                  <option value="กรุงเทพมหานคร">กรุงเทพมหานคร</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">อำเภอ/เขต</label>
                <input
                  type="text"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="อำเภอสารภี"
                />
              </div>
            </div>

            {/* ตำบล/แขวง, รหัสไปรษณีย์ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ตำบล/แขวง</label>
                <input
                  type="text"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="ในเมือง"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รหัสไปรษณีย์</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  maxLength="5"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="10110"
                />
              </div>
            </div>

            {/* Latitude, Longitude */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="text"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="18.71221619"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="text"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="99.04523792"
                />
              </div>
            </div>
          </div>
        </div>

        {/* เวลาเปิด-ปิด */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">เวลาเปิด-ปิด</h3>
          
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

        {/* รูปภาพร้าน */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <PhotoIcon className="w-5 h-5 mr-2" />
            รูปภาพร้าน
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Existing Images */}
            {formData.images.map((image, index) => (
              <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <img
                  src={`https://api.arkaddee.com${image}`}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Upload Button */}
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
          </div>
        </div>

        {/* อุปกรณ์ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">อุปกรณ์</h2>

          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="has_air_purifier"
                checked={formData.has_air_purifier}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">มีเครื่องฟอกอากาศ</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="has_fresh_air_system"
                checked={formData.has_fresh_air_system}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">มีระบบเติมอากาศใหม่</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/shops/${id}`)}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ShopEditPage;