import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data
  const [users] = useState([
    {
      id: 1,
      name: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      phone: '0812345678',
      role: 'Admin',
      status: 'active',
      shops: 5,
      created_at: '2025-01-15',
      avatar: null
    },
    {
      id: 2,
      name: 'สมหญิง รักสงบ',
      email: 'somying@example.com',
      phone: '0898765432',
      role: 'Shop Owner',
      status: 'active',
      shops: 12,
      created_at: '2025-02-01',
      avatar: null
    },
    {
      id: 3,
      name: 'วิชัย มานะ',
      email: 'wichai@example.com',
      phone: '0856789012',
      role: 'Shop Owner',
      status: 'inactive',
      shops: 3,
      created_at: '2024-12-10',
      avatar: null
    },
    {
      id: 4,
      name: 'ประภา สว่าง',
      email: 'prapa@example.com',
      phone: '0823456789',
      role: 'Moderator',
      status: 'active',
      shops: 0,
      created_at: '2025-01-20',
      avatar: null
    },
    {
      id: 5,
      name: 'สุรชัย ดีงาม',
      email: 'surachai@example.com',
      phone: '0891234567',
      role: 'Shop Owner',
      status: 'pending',
      shops: 1,
      created_at: '2025-03-01',
      avatar: null
    }
  ]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role) => {
    const config = {
      'Admin': { label: 'ผู้ดูแลระบบ', className: 'bg-red-100 text-red-800' },
      'Moderator': { label: 'ผู้ตรวจสอบ', className: 'bg-blue-100 text-blue-800' },
      'Shop Owner': { label: 'เจ้าของร้าน', className: 'bg-purple-100 text-purple-800' },
      'User': { label: 'ผู้ใช้งาน', className: 'bg-gray-100 text-gray-800' }
    };
    const { label, className } = config[role] || config.User;
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>{label}</span>;
  };

  const getStatusBadge = (status) => {
    const config = {
      'active': { label: 'ใช้งานอยู่', className: 'bg-green-100 text-green-800' },
      'inactive': { label: 'ไม่ใช้งาน', className: 'bg-gray-100 text-gray-800' },
      'pending': { label: 'รออนุมัติ', className: 'bg-amber-100 text-amber-800' },
      'suspended': { label: 'ระงับ', className: 'bg-red-100 text-red-800' }
    };
    const { label, className } = config[status] || config.pending;
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>{label}</span>;
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`คุณต้องการลบผู้ใช้ "${name}" หรือไม่?`)) {
      console.log('Deleting user:', id);
      alert('ลบผู้ใช้สำเร็จ');
    }
  };

  const stats = [
    { label: 'ผู้ใช้ทั้งหมด', value: users.length, color: 'bg-blue-500' },
    { label: 'ใช้งานอยู่', value: users.filter(u => u.status === 'active').length, color: 'bg-green-500' },
    { label: 'รออนุมัติ', value: users.filter(u => u.status === 'pending').length, color: 'bg-amber-500' },
    { label: 'เจ้าของร้าน', value: users.filter(u => u.role === 'Shop Owner').length, color: 'bg-purple-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h1>
          <p className="text-sm text-gray-600 mt-1">
            ทั้งหมด {filteredUsers.length} ผู้ใช้งาน
          </p>
        </div>
        <Link
          to="/users/create"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>เพิ่มผู้ใช้ใหม่</span>
        </Link>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Role Filter */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">บทบาททั้งหมด</option>
              <option value="Admin">ผู้ดูแลระบบ</option>
              <option value="Moderator">ผู้ตรวจสอบ</option>
              <option value="Shop Owner">เจ้าของร้าน</option>
              <option value="User">ผู้ใช้งาน</option>
            </select>
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
              <option value="inactive">ไม่ใช้งาน</option>
              <option value="pending">รออนุมัติ</option>
              <option value="suspended">ระงับ</option>
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
                  บทบาท
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  ร้านค้า
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  วันที่สมัคร
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    ไม่พบข้อมูลผู้ใช้งาน
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
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
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{user.shops}</span>
                      <span className="text-xs text-gray-500 ml-1">ร้าน</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
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

export default UserList;
