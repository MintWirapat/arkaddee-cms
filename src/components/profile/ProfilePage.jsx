import React, { useState } from 'react';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const userString = localStorage.getItem('user');
  const initialUser = userString ? JSON.parse(userString) : {
    name: 'ผู้ดูแลระบบ',
    email: 'admin@arkaddee.com',
    phone: '0812345678',
    role: 'Admin',
    avatar: null
  };

  const [userData, setUserData] = useState(initialUser);
  const [editData, setEditData] = useState(initialUser);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateProfile = () => {
    const newErrors = {};

    if (!editData.name.trim()) {
      newErrors.name = 'กรุณากรอกชื่อ-นามสกุล';
    }

    if (!editData.email.trim()) {
      newErrors.email = 'กรุณากรอกอีเมล';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }

    if (!editData.phone.trim()) {
      newErrors.phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!/^[0-9]{10}$/.test(editData.phone)) {
      newErrors.phone = 'เบอร์โทรศัพท์ไม่ถูกต้อง';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'กรุณากรอกรหัสผ่านปัจจุบัน';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'กรุณากรอกรหัสผ่านใหม่';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'กรุณายืนยันรหัสผ่านใหม่';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'รหัสผ่านไม่ตรงกัน';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) {
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setUserData(editData);
      localStorage.setItem('user', JSON.stringify(editData));
      setIsEditing(false);
      setLoading(false);
      alert('✅ บันทึกข้อมูลสำเร็จ!\n\nรูปโปรไฟล์จะอัพเดทใน Sidebar และ Navbar ทันที');
      // Reload to update Sidebar and Navbar
      window.location.reload();
    }, 1000);
  };

  const handleCancelEdit = () => {
    setEditData(userData);
    setIsEditing(false);
    setErrors({});
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setLoading(false);
      alert('เปลี่ยนรหัสผ่านสำเร็จ!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
        <p className="text-sm text-gray-600 mt-1">
          จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col items-center">
              {/* Avatar */}
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-4 ring-gray-100">
                  {editData.avatar ? (
                    <img 
                      src={editData.avatar} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="w-20 h-20 text-white" />
                  )}
                </div>
                
                {/* Always show upload button when editing */}
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <CameraIcon className="w-10 h-10 text-white mx-auto mb-1" />
                      <span className="text-white text-xs font-medium">เปลี่ยนรูป</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Upload Button (Always visible when editing) */}
              {isEditing && (
                <label className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center space-x-2">
                  <CameraIcon className="w-4 h-4" />
                  <span>เลือกรูปภาพ</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}

              {/* User Info */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900">{userData.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                <span className="inline-flex items-center px-3 py-1 mt-3 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {userData.role}
                </span>
              </div>

              {/* Helper Text */}
              {isEditing && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800 text-center">
                    💡 คลิกปุ่ม "เลือกรูปภาพ" หรือ Hover ที่รูปเพื่ออัพโหลด
                  </p>
                  <p className="text-xs text-blue-600 text-center mt-1">
                    ไฟล์รูปภาพ JPG, PNG (สูงสุด 5MB)
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="w-full mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">24</p>
                    <p className="text-xs text-gray-600 mt-1">ร้านค้าที่สร้าง</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">156</p>
                    <p className="text-xs text-gray-600 mt-1">การอนุมัติ</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">ข้อมูลส่วนตัว</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">แก้ไข</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">ยกเลิก</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <CheckIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ-นามสกุล
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.name}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  อีเมล
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.email}</span>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เบอร์โทรศัพท์
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      maxLength="10"
                      className={`w-full px-4 py-2.5 border ${
                        errors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </>
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{userData.phone}</span>
                  </div>
                )}
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  บทบาท
                </label>
                <div className="flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">{userData.role}</span>
                  <span className="text-xs text-gray-500">(ไม่สามารถแก้ไขได้)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <KeyIcon className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">เปลี่ยนรหัสผ่าน</h3>
                  <p className="text-sm text-gray-600">รักษาความปลอดภัยบัญชีของคุณ</p>
                </div>
              </div>
              {!isChangingPassword && (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                >
                  เปลี่ยนรหัสผ่าน
                </button>
              )}
            </div>

            {isChangingPassword && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านปัจจุบัน
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border ${
                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ยืนยันรหัสผ่านใหม่
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-2.5 border ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                      setErrors({});
                    }}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'กำลังเปลี่ยน...' : 'ยืนยันการเปลี่ยน'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Log Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">กิจกรรมล่าสุด</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">เข้าสู่ระบบ</p>
                  <p className="text-xs text-gray-600 mt-1">6 พฤศจิกายน 2568, 14:30 น.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">อนุมัติร้านค้า</p>
                  <p className="text-xs text-gray-600 mt-1">5 พฤศจิกายน 2568, 16:45 น.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">เพิ่มร้านค้าใหม่</p>
                  <p className="text-xs text-gray-600 mt-1">4 พฤศจิกายน 2568, 10:20 น.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;