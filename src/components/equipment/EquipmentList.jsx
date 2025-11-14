import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  EyeIcon,
  LinkIcon,
  TrashIcon,
  CogIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const EquipmentList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showBindModal, setShowBindModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [searchShop, setSearchShop] = useState('');
  const [selectedShop, setSelectedShop] = useState(null);
  const [binding, setBinding] = useState(false);

  // Mock data - อุปกรณ์
  const [equipment] = useState([
    {
      id: 1,
      name: 'Xiaomi Air Purifier 4 Pro',
      serial_number: 'AP-2024-001',
      type: 'เครื่องฟอกอากาศ',
      shop: 'คาเฟ่ในสวนใบไม้',
      shop_id: 1,
      installed_date: '2024-01-15',
      status: 'active',
      is_bound: true
    },
    {
      id: 2,
      name: 'Panasonic Fresh Air System',
      serial_number: 'FA-2024-002',
      type: 'เครื่องเติมอากาศใหม่',
      shop: 'หอมหมูกระทะ',
      shop_id: 2,
      installed_date: '2024-02-01',
      status: 'active',
      is_bound: true
    },
    {
      id: 3,
      name: 'Daikin Air Purifier',
      serial_number: 'AP-2024-003',
      type: 'เครื่องฟอกอากาศ',
      shop: null,
      shop_id: null,
      installed_date: null,
      status: 'available',
      is_bound: false
    },
    {
      id: 4,
      name: 'Sharp Air Purifier',
      serial_number: 'AP-2024-004',
      type: 'เครื่องฟอกอากาศ',
      shop: 'ร้านอาหารญี่ปุ่น',
      shop_id: 4,
      installed_date: '2024-02-10',
      status: 'maintenance',
      is_bound: true
    },
    {
      id: 5,
      name: 'Mitsubishi Fresh Air',
      serial_number: 'FA-2024-005',
      type: 'เครื่องเติมอากาศใหม่',
      shop: null,
      shop_id: null,
      installed_date: null,
      status: 'available',
      is_bound: false
    }
  ]);

  // Mock data - ร้านค้า
  const shops = [
    { id: 1, name: 'คาเฟ่ในสวนใบไม้', owner: 'สมชาย ใจดี', phone: '0812345678' },
    { id: 2, name: 'หอมหมูกระทะ', owner: 'สมหญิง รักสงบ', phone: '0898765432' },
    { id: 3, name: 'ร้านกาแฟสด', owner: 'วิชัย มานะ', phone: '0856789012' },
    { id: 4, name: 'ร้านอาหารญี่ปุ่น', owner: 'ประภา สว่าง', phone: '0823456789' }
  ];

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.shop && item.shop.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchShop.toLowerCase()) ||
    shop.owner.toLowerCase().includes(searchShop.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const config = {
      'active': { label: 'ใช้งานอยู่', className: 'bg-green-100 text-green-800' },
      'maintenance': { label: 'ซ่อมบำรุง', className: 'bg-amber-100 text-amber-800' },
      'available': { label: 'พร้อมใช้งาน', className: 'bg-blue-100 text-blue-800' },
      'inactive': { label: 'ไม่ใช้งาน', className: 'bg-gray-100 text-gray-800' }
    };
    const { label, className } = config[status] || config.available;
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>{label}</span>;
  };

  const getTypeBadge = (type) => {
    const config = {
      'เครื่องฟอกอากาศ': { className: 'bg-blue-100 text-blue-800' },
      'เครื่องเติมอากาศใหม่': { className: 'bg-purple-100 text-purple-800' }
    };
    const { className } = config[type] || config['เครื่องฟอกอากาศ'];
    return <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>{type}</span>;
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`คุณต้องการลบอุปกรณ์ "${name}" หรือไม่?`)) {
      console.log('Deleting equipment:', id);
      alert('ลบอุปกรณ์สำเร็จ');
    }
  };

  const handleOpenBindModal = (item) => {
    setSelectedEquipment(item);
    setSelectedShop(null);
    setSearchShop('');
    setShowBindModal(true);
  };

  const handleCloseBindModal = () => {
    setShowBindModal(false);
    setSelectedEquipment(null);
    setSelectedShop(null);
    setSearchShop('');
  };

  const handleBind = async () => {
    if (!selectedShop || !selectedEquipment) {
      alert('กรุณาเลือกร้านค้า');
      return;
    }

    setBinding(true);
    // Mock API call
    setTimeout(() => {
      setBinding(false);
      alert(`ผูกอุปกรณ์ ${selectedEquipment.name} กับร้าน ${selectedShop.name} สำเร็จ!`);
      handleCloseBindModal();
    }, 1000);
  };

  const stats = [
    { 
      label: 'อุปกรณ์ทั้งหมด', 
      value: equipment.length, 
      color: 'bg-blue-500',
      icon: CogIcon
    },
    { 
      label: 'ผูกแล้ว', 
      value: equipment.filter(e => e.is_bound).length, 
      color: 'bg-green-500',
      icon: LinkIcon
    },
    { 
      label: 'ยังไม่ผูก', 
      value: equipment.filter(e => !e.is_bound).length, 
      color: 'bg-amber-500',
      icon: CogIcon
    },
    { 
      label: 'ซ่อมบำรุง', 
      value: equipment.filter(e => e.status === 'maintenance').length, 
      color: 'bg-red-500',
      icon: CogIcon
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการอุปกรณ์</h1>
          <p className="text-sm text-gray-600 mt-1">
            ทั้งหมด {filteredEquipment.length} อุปกรณ์
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาชื่ออุปกรณ์, Serial Number, ร้านค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">ประเภททั้งหมด</option>
              <option value="เครื่องฟอกอากาศ">เครื่องฟอกอากาศ</option>
              <option value="เครื่องเติมอากาศใหม่">เครื่องเติมอากาศใหม่</option>
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
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ชื่ออุปกรณ์</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ประเภท</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">ร้านค้า</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEquipment.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">ไม่พบข้อมูลอุปกรณ์</td>
                </tr>
              ) : (
                filteredEquipment.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CogIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">ID: {item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-900">{item.serial_number}</span>
                    </td>
                    <td className="px-6 py-4">{getTypeBadge(item.type)}</td>
                    <td className="px-6 py-4">
                      {item.shop ? (
                        <Link 
                          to={`/shops/${item.shop_id}`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          {item.shop}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">ยังไม่ผูก</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/equipment/${item.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleOpenBindModal(item)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="ผูกอุปกรณ์"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
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

      {/* Binding Modal */}
      {showBindModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">ผูกอุปกรณ์กับร้านค้า</h3>
              <button
                onClick={handleCloseBindModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Equipment Info */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">ข้อมูลอุปกรณ์</h4>
                  <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm mb-2"><span className="font-medium">ชื่อ:</span> {selectedEquipment.name}</p>
                    <p className="text-sm mb-2"><span className="font-medium">รหัส:</span> {selectedEquipment.serial_number}</p>
                    <p className="text-sm"><span className="font-medium">ประเภท:</span> {selectedEquipment.type}</p>
                  </div>
                </div>

                {/* Right: Shop Selection */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">เลือกร้านค้า</h4>
                  <div className="relative mb-3">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchShop}
                      onChange={(e) => setSearchShop(e.target.value)}
                      placeholder="ค้นหาร้านค้า..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredShops.map((shop) => (
                      <button
                        key={shop.id}
                        onClick={() => setSelectedShop(shop)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          selectedShop?.id === shop.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="font-medium text-sm">{shop.name}</p>
                        <p className="text-xs text-gray-600">{shop.owner} • {shop.phone}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={handleCloseBindModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleBind}
                disabled={!selectedShop || binding}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {binding ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>กำลังผูก...</span>
                  </>
                ) : (
                  <>
                    <LinkIcon className="w-5 h-5" />
                    <span>ผูกอุปกรณ์</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentList;