import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - ผู้ใช้งานจากมือถือ
  const [users] = useState([
    {
      id: 1,
      name: 'สมศักดิ์ ดีมาก',
      email: 'somsak@gmail.com',
      phone: '0812345678',
      status: 'active',
      registered_at: '2025-01-15',
      last_login: '2025-11-06',
      avatar: null
    },
    {
      id: 2,
      name: 'วิไล สวยงาม',
      email: 'wilai@gmail.com',
      phone: '0898765432',
      status: 'active',
      registered_at: '2025-02-01',
      last_login: '2025-11-05',
      avatar: null
    },
    {
      id: 3,
      name: 'ประยุทธ์ เก่งกาจ',
      email: 'prayut@gmail.com',
      phone: '0856789012',
      status: 'inactive',
      registered_at: '2024-12-10',
      last_login: '2025-10-20',
      avatar: null
    },
    {
      id: 4,
      name: 'สุภาพร น่ารัก',
      email: 'supaporn@gmail.com',
      phone: '0823456789',
      status: 'active',
      registered_at: '2025-01-20',
      last_login: '2025-11-06',
      avatar: null
    },
    {
      id: 5,
      name: 'ชัยวัฒน์ มั่นคง',
      email: 'chaiwat@gmail.com',
      phone: '0891234567',
      status: 'blocked',
      registered_at: '2025-03-01',
      last_login: '2025-09-15',
      avatar: null
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const config = {
      'active': { label: 'ใช้งานอยู่', className: 'bg-green-100 text-green-800' },
      'inactive': { label: 'ไม่ได้ใช้งาน', className: 'bg-gray-100 text-gray-800' },
      'blocked': { label: 'ถูกบล็อก', className: 'bg-red-100 text-red-800' }
    };
    const { label, className } = config[status] || config.active;
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>{label}</span>;
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`คุณต้องการลบผู้ใช้งาน "${name}" หรือไม่?`)) {
      console.log('Deleting user:', id);
      alert('ลบผู้ใช้งานสำเร็จ');
    }
  };

  const stats = [
    { label: 'ผู้ใช้ทั้งหมด', value: users.length, color: 'bg-blue-500' },
    { label: 'ใช้งานอยู่', value: users.filter(u => u.status === 'active').length, color: 'bg-green-500' },
    { label: 'ไม่ได้ใช้งาน', value: users.filter(u => u.status === 'inactive').length, color: 'bg-gray-500' },
    { label: 'ถูกบล็อก', value: users.filter(u => u.status === 'blocked').length, color: 'bg-red-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header - ไม่มีปุ่มเพิ่ม */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ผู้ใช้งาน</h1>
          <p className="text-sm text-gray-600 mt-1">
            ผู้ใช้งานจากแอปพลิเคชันมือถือ - ทั้งหมด {filteredUsers.length} คน
          </p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
          <DevicePhoneMobileIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Mobile App Users</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <UserCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
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

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">ใช้งานอยู่</option>
              <option value="inactive">ไม่ได้ใช้งาน</option>
              <option value="blocked">ถูกบล็อก</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ผู้ใช้งาน
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ติดต่อ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  วันที่สมัคร
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  เข้าใช้ล่าสุด
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    ไม่พบข้อมูลผู้ใช้งาน
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(user.registered_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(user.last_login).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="แก้ไข"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบ"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
