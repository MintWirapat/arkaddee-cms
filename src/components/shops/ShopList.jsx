import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ShopList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(null); // เพิ่มบรรทัดนี้

  // Fetch shops from API
  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching shops from API...');
      const data = await api.shop.getAll();

      // API returns array directly
      const shopList = Array.isArray(data) ? data : [];

      console.log('Shops loaded:', shopList.length);
      setShops(shopList);
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`คุณต้องการลบร้าน "${name}" หรือไม่?`)) return;

    try {
      setDeleting(id);
      console.log('🗑️ Attempting to delete shop:', { id, name });

      const result = await api.shop.delete(id);
      console.log('✅ Delete successful:', result);

      // อัพเดท state ทันที (ไม่ต้องรอ fetchShops)
      setShops(prevShops => prevShops.filter(shop => shop.id !== id));

      alert('ลบร้านค้าสำเร็จ');

    } catch (err) {
      console.error('❌ Delete failed:', err);

      // แสดง error ตามประเภท
      const errorMessage = err.message.toLowerCase();
      
      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint') || errorMessage.includes('violates')) {
        alert('❌ ไม่สามารถลบร้านค้านี้ได้\n\n' +
              '📌 เหตุผล:\n' +
              'ร้านนี้มีข้อมูลที่เชื่อมโยงอยู่ (รูปภาพ, รีวิว, การจอง)\n\n' +
              '💡 แนะนำ:\n' +
              '1. ติดต่อ Admin เพื่อลบข้อมูลที่เชื่อมโยง\n' +
              '2. หรือใช้ฟีเจอร์ "ซ่อนร้านค้า" แทน (ถ้ามี)\n' +
              '3. ติดต่อทีมพัฒนาให้เปิด Cascade Delete');
      } else if (errorMessage.includes('500')) {
        alert('⚠️ เกิดข้อผิดพลาดจากเซิร์ฟเวอร์ (500)\n\n' +
              'อาจเป็นเพราะ:\n' +
              '• ร้านนี้มีข้อมูลที่เชื่อมโยงอยู่\n' +
              '• Database constraint\n' +
              '• Backend มีปัญหา\n\n' +
              'กรุณาติดต่อ Admin');
      } else if (errorMessage.includes('404')) {
        alert('❌ ไม่พบร้านค้านี้ในระบบ\n\nร้านอาจถูกลบไปแล้ว');
      } else if (errorMessage.includes('401') || errorMessage.includes('403')) {
        alert('🔒 ไม่มีสิทธิ์ลบร้านค้า\n\nกรุณาเข้าสู่ระบบใหม่');
      } else {
        alert(`❌ เกิดข้อผิดพลาด:\n\n${err.message}\n\nกรุณาลองใหม่อีกครั้ง`);
      }

      // Refresh list
      await fetchShops();
    } finally {
      setDeleting(null);
    }
  };

  const filteredShops = shops.filter(shop => {
    const matchesSearch =
      shop.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shop.id?.toString().includes(searchTerm);

    return matchesSearch;
  });

  // Calculate stats
  const getTodayShops = () => {
    const today = new Date().toDateString();
    return shops.filter(shop => {
      if (!shop.created_at) return false;
      const shopDate = new Date(shop.created_at).toDateString();
      return shopDate === today;
    }).length;
  };

  const stats = [
    {
      label: 'ร้านค้าทั้งหมด',
      value: shops.length, // This will update automatically
      color: 'bg-purple-500',
      icon: BuildingStorefrontIcon
    },
    {
      label: 'ร้านใหม่วันนี้',
      value: getTodayShops(),
      color: 'bg-amber-500',
      icon: CalendarIcon
    },

  ];

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">⚠</span>
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-2">เกิดข้อผิดพลาด</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchShops}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          ลองอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการร้านค้า</h1>
          <p className="text-sm text-gray-600 mt-1">
            ทั้งหมด {shops.length} ร้าน {searchTerm && `(แสดง ${filteredShops.length} ร้าน)`}
          </p>
        </div>
        <Link
          to="/shops/create"
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span>เพิ่มร้านค้าใหม่</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาชื่อร้าน, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">ชื่อร้านค้า</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">ตำแหน่ง</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShops.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีร้านค้า'}
                  </td>
                </tr>
              ) : (
                filteredShops.map((shop) => {
                  const isDeleting = deleting === shop.id;
                  return (
                    <tr
                      key={shop.id}
                      className={`hover:bg-gray-50 transition-colors ${isDeleting ? 'opacity-50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-900">#{shop.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <BuildingStorefrontIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{shop.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{shop.latitude}, {shop.longitude}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/shops/${shop.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="ดูรายละเอียด"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </Link>
                          <Link
                            to={`/shops/${shop.id}/edit`}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="แก้ไข"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(shop.id, shop.name)}
                            disabled={isDeleting}
                            className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            title="ลบ"
                          >
                            {isDeleting ? (
                              <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <TrashIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ShopList;