import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(10); // Show 10 users initially

  // Modals
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDevicesModal, setShowDevicesModal] = useState(false);

  // User devices
  const [userDevices, setUserDevices] = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // Edit form
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.user.getAll();
      const userList = response.user || response.data || response || [];
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDevices = async (userId) => {
    setLoadingDevices(true);
    try {
      // Note: This endpoint might need the user's token
      // For now, we'll show placeholder or use admin endpoint if available
      const response = await api.user.getDevices(userId);
      console.log('✅ User Devices fetched:', response);
      const deviceList = response.user || response.data || response || [];
      setUserDevices(Array.isArray(deviceList) ? deviceList : []);
    } catch (error) {
      console.error('❌ Error fetching user devices:', error);
      setUserDevices([]);
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    setShowEditModal(true);
  };

  const handleViewDevices = (user) => {
    setSelectedUser(user);
    setShowDevicesModal(true);
    fetchUserDevices(user.id);
  };

  const handleSaveEdit = async () => {
    if (!editForm.name.trim()) {
      alert('กรุณากรอกชื่อ');
      return;
    }

    setSaving(true);
    try {
      await api.user.update(selectedUser.id, editForm);
      alert('✅ บันทึกข้อมูลสำเร็จ!');
      setShowEditModal(false);
      fetchUsers(); // Refresh list
    } catch (error) {
      console.error('❌ Error updating user:', error);
      alert('❌ เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถบันทึกได้'));
    } finally {
      setSaving(false);
    }
  };

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.includes(searchTerm)
    );
  });

  // Get displayed users (limited by displayCount)
  const displayedUsers = filteredUsers.slice(0, displayCount);
  const hasMore = filteredUsers.length > displayCount;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <UserIcon className="w-8 h-8 mr-3 text-indigo-600" />
              ผู้ใช้งาน
            </h1>
            <p className="text-gray-600 mt-2">
              จำนวนผู้ใช้ทั้งหมด: {users.length} คน
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, อีเมล, เบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Grid */}
      {displayedUsers.length === 0 ? (
        <div className="text-center py-12">
          <UserIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">ไม่พบข้อมูลผู้ใช้</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {displayedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                {/* User Avatar & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-15 h-15 ml-4  flex items-center justify-center rounded-full  overflow-hidden">
                      <img src={user.image_profile }       
                      className=" object-cover" alt="User Profile" style={{ width: '80px', height: '60px' }}
                       />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {user.full_name || 'ไม่มีชื่อ'}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>

                  {user.is_active ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" title="ใช้งานอยู่" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-red-500" title="ระงับการใช้งาน" />
                  )}
                </div>

                {/* User Info */}
                <div className="space-y-2 mb-4">
                  {user.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}

                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}

                  {user.created_at && (
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        สมัคร: {new Date(user.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                  >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    แก้ไข
                  </button>

                  <button
                    onClick={() => handleViewDevices(user)}
                    className="inline-flex items-center justify-center px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium"
                  >
                    <ComputerDesktopIcon className="w-4 h-4 mr-1" />
                    อุปกรณ์
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                โหลดเพิ่มเติม ({filteredUsers.length - displayCount} คนที่เหลือ)
              </button>
            </div>
          )}
        </>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">แก้ไขข้อมูลผู้ใช้</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="ชื่อผู้ใช้"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  อีเมล
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เบอร์โทร
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  placeholder="0812345678"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Devices Modal */}
      {showDevicesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                อุปกรณ์ของ {selectedUser?.name}
              </h3>
              <button
                onClick={() => setShowDevicesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {loadingDevices ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-gray-600">กำลังโหลดอุปกรณ์...</p>
              </div>
            ) : userDevices.length === 0 ? (
              <div className="text-center py-8">
                <ComputerDesktopIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีอุปกรณ์ที่ผูกอยู่</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userDevices.map((device) => (
                  <div
                    key={device.link_id || device.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <ComputerDesktopIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">
                            {device.device_type + '  ' + device.device_id || 'ไม่มีชื่อ'}
                          </h4>
                          <p className="text-sm text-gray-500">
                            สถานที่: {device.room_name || '-'}
                          </p>
                          {device.device_type && (
                            <p className="text-xs text-gray-400 mt-1">
                              ประเภท: {device.device_type}
                            </p>
                          )}
                        </div>
                      </div>

                     
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={() => setShowDevicesModal(false)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;