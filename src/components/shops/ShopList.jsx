import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const ShopList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterProvince, setFilterProvince] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock shop data
  const shops = [
    {
      id: 1,
      name: 'คาเฟ่ในสวนใบไม้',
      category: 'คาเฟ่',
      province: 'กรุงเทพมหานคร',
      price_range: '฿฿',
      status: 'published',
      phone: '0812345678',
      created_at: '2025-01-15',
      has_air_purifier: true,
      has_fresh_air_system: false
    },
    {
      id: 2,
      name: 'หอมหมูกระทะ',
      category: 'ร้านอาหาร',
      province: 'เชียงใหม่',
      price_range: '฿฿',
      status: 'pending',
      phone: '0899999999',
      created_at: '2025-02-01',
      has_air_purifier: false,
      has_fresh_air_system: true
    },
    {
      id: 3,
      name: 'โคโค่สมูทตี้บาร์',
      category: 'เครื่องดื่ม',
      province: 'ปทุมธานี',
      price_range: '฿',
      status: 'published',
      phone: '0822222222',
      created_at: '2025-01-28',
      has_air_purifier: true,
      has_fresh_air_system: true
    },
    {
      id: 4,
      name: 'ราเมงโตเกียว',
      category: 'ร้านอาหาร',
      province: 'กรุงเทพมหานคร',
      price_range: '฿฿฿',
      status: 'published',
      phone: '0833333333',
      created_at: '2025-01-10',
      has_air_purifier: true,
      has_fresh_air_system: true
    },
    {
      id: 5,
      name: 'สวนอาหารริมทะเล',
      category: 'ร้านอาหาร',
      province: 'ภูเก็ต',
      price_range: '฿฿฿',
      status: 'pending',
      phone: '0844444444',
      created_at: '2025-02-05',
      has_air_purifier: false,
      has_fresh_air_system: true
    }
  ];

  const categories = ['คาเฟ่', 'ร้านอาหาร', 'เครื่องดื่ม', 'ร้านขนม', 'บาร์'];
  const provinces = ['กรุงเทพมหานคร', 'เชียงใหม่', 'ปทุมธานี', 'ภูเก็ต', 'ขอนแก่น'];

  // Filter logic
  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shop.phone.includes(searchTerm);
    const matchesCategory = !filterCategory || shop.category === filterCategory;
    const matchesProvince = !filterProvince || shop.province === filterProvince;
    const matchesStatus = !filterStatus || shop.status === filterStatus;

    return matchesSearch && matchesCategory && matchesProvince && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredShops.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedShops = filteredShops.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: {
        label: 'เผยแพร่แล้ว',
        className: 'bg-green-100 text-green-800'
      },
      pending: {
        label: 'รออนุมัติ',
        className: 'bg-amber-100 text-amber-800'
      },
      rejected: {
        label: 'ปฏิเสธ',
        className: 'bg-red-100 text-red-800'
      }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const handleDelete = (shopId) => {
    if (window.confirm('คุณต้องการลบร้านนี้หรือไม่?')) {
      console.log('Deleting shop:', shopId);
      // Handle delete logic
    }
  };

  const handleApprove = (shopId) => {
    console.log('Approving shop:', shopId);
    // Handle approve logic
  };

  const handleReject = (shopId) => {
    console.log('Rejecting shop:', shopId);
    // Handle reject logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการร้านค้า</h1>
          <p className="text-sm text-gray-600 mt-1">
            ทั้งหมด {filteredShops.length} ร้านค้า
          </p>
        </div>
        <Link
          to="/shops/create"
          className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          เพิ่มร้านค้าใหม่
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่อร้าน, เบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">ทุกหมวดหมู่</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Province Filter */}
          <div>
            <select
              value={filterProvince}
              onChange={(e) => setFilterProvince(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">ทุกจังหวัด</option>
              {provinces.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">ทุกสถานะ</option>
              <option value="published">เผยแพร่แล้ว</option>
              <option value="pending">รออนุมัติ</option>
              <option value="rejected">ปฏิเสธ</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || filterCategory || filterProvince || filterStatus) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">กรองโดย:</span>
            {searchTerm && (
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full flex items-center">
                ค้นหา: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-2">×</button>
              </span>
            )}
            {filterCategory && (
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full flex items-center">
                {filterCategory}
                <button onClick={() => setFilterCategory('')} className="ml-2">×</button>
              </span>
            )}
            {filterProvince && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full flex items-center">
                {filterProvince}
                <button onClick={() => setFilterProvince('')} className="ml-2">×</button>
              </span>
            )}
            {filterStatus && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
                {filterStatus === 'published' ? 'เผยแพร่แล้ว' : 'รออนุมัติ'}
                <button onClick={() => setFilterStatus('')} className="ml-2">×</button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ร้านค้า
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จังหวัด
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  อุปกรณ์
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                      <div className="text-sm text-gray-500">{shop.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{shop.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{shop.province}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{shop.price_range}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      {shop.has_air_purifier && (
                        <span className="text-xs text-blue-600">🌬️ ฟอกอากาศ</span>
                      )}
                      {shop.has_fresh_air_system && (
                        <span className="text-xs text-green-600">💨 อากาศใหม่</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(shop.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-2">
                      {shop.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(shop.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="อนุมัติ"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(shop.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="ปฏิเสธ"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </>
                      )}
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
                        onClick={() => handleDelete(shop.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {paginatedShops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลร้านค้า</p>
            <p className="text-gray-400 text-sm mt-2">ลองค้นหาด้วยคำอื่น หรือเพิ่มร้านค้าใหม่</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              แสดง {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredShops.length)} จาก {filteredShops.length} ร้านค้า
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ก่อนหน้า
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopList;
