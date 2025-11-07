import React, { useState } from 'react';
import {
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CogIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Arkaddee CMS',
    siteDescription: 'ระบบจัดการร้านค้าออนไลน์',
    timezone: 'Asia/Bangkok',
    language: 'th',
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    newShopAlert: true,
    approvalAlert: true,
    weeklyReport: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    
    // Shop Settings
    autoApproval: false,
    requireVerification: true,
    minPhotos: 3,
    maxPhotos: 10,
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: 'noreply@arkaddee.com',
    smtpPassword: '••••••••',
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('✅ บันทึกการตั้งค่าสำเร็จ!');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'ทั่วไป', icon: CogIcon },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: BellIcon },
    { id: 'security', label: 'ความปลอดภัย', icon: ShieldCheckIcon },
    { id: 'shops', label: 'ร้านค้า', icon: GlobeAltIcon },
    { id: 'email', label: 'อีเมล', icon: EnvelopeIcon }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">การตั้งค่า</h1>
        <p className="text-sm text-gray-600 mt-1">
          จัดการการตั้งค่าระบบและการกำหนดค่าต่างๆ
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าทั่วไป</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อเว็บไซต์
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => handleChange('siteName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        คำอธิบาย
                      </label>
                      <textarea
                        value={settings.siteDescription}
                        onChange={(e) => handleChange('siteDescription', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          เขตเวลา
                        </label>
                        <select
                          value={settings.timezone}
                          onChange={(e) => handleChange('timezone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                          <option value="Asia/Tokyo">Tokyo (GMT+9)</option>
                          <option value="Europe/London">London (GMT+0)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ภาษา
                        </label>
                        <select
                          value={settings.language}
                          onChange={(e) => handleChange('language', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                          <option value="th">ไทย</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การแจ้งเตือน</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">การแจ้งเตือนทางอีเมล</p>
                        <p className="text-xs text-gray-500">รับการแจ้งเตือนผ่านอีเมล</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">การแจ้งเตือนแบบ Push</p>
                        <p className="text-xs text-gray-500">รับการแจ้งเตือนผ่านเบราว์เซอร์</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">ร้านค้าใหม่</p>
                        <p className="text-xs text-gray-500">แจ้งเตือนเมื่อมีร้านค้าสมัครใหม่</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.newShopAlert}
                          onChange={(e) => handleChange('newShopAlert', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">การอนุมัติ</p>
                        <p className="text-xs text-gray-500">แจ้งเตือนเมื่อต้องอนุมัติร้านค้า</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.approvalAlert}
                          onChange={(e) => handleChange('approvalAlert', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">รายงานประจำสัปดาห์</p>
                        <p className="text-xs text-gray-500">รับสรุปรายงานทุกวันจันทร์</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.weeklyReport}
                          onChange={(e) => handleChange('weeklyReport', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">ความปลอดภัย</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-xs text-gray-500">เพิ่มความปลอดภัยด้วย 2FA</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.twoFactorAuth}
                          onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (นาที)
                      </label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password Expiry (วัน)
                      </label>
                      <input
                        type="number"
                        value={settings.passwordExpiry}
                        onChange={(e) => handleChange('passwordExpiry', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shop Settings */}
            {activeTab === 'shops' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าร้านค้า</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">อนุมัติอัตโนมัติ</p>
                        <p className="text-xs text-gray-500">อนุมัติร้านค้าใหม่โดยอัตโนมัติ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoApproval}
                          onChange={(e) => handleChange('autoApproval', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b">
                      <div>
                        <p className="text-sm font-medium text-gray-900">ตรวจสอบยืนยัน</p>
                        <p className="text-xs text-gray-500">ต้องยืนยันข้อมูลก่อนอนุมัติ</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.requireVerification}
                          onChange={(e) => handleChange('requireVerification', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          รูปภาพขั้นต่ำ
                        </label>
                        <input
                          type="number"
                          value={settings.minPhotos}
                          onChange={(e) => handleChange('minPhotos', parseInt(e.target.value))}
                          min="1"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          รูปภาพสูงสุด
                        </label>
                        <input
                          type="number"
                          value={settings.maxPhotos}
                          onChange={(e) => handleChange('maxPhotos', parseInt(e.target.value))}
                          max="20"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">การตั้งค่าอีเมล (SMTP)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        value={settings.smtpHost}
                        onChange={(e) => handleChange('smtpHost', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        value={settings.smtpPort}
                        onChange={(e) => handleChange('smtpPort', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        value={settings.smtpUser}
                        onChange={(e) => handleChange('smtpUser', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => handleChange('smtpPassword', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      ทดสอบการเชื่อมต่อ SMTP
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังบันทึก...</span>
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      <span>บันทึกการตั้งค่า</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
