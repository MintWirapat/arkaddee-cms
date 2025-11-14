import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  LinkIcon,
  CogIcon,
  ShoppingBagIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - ข้อมูลอุปกรณ์
  const [equipment] = useState({
    id: 1,
    name: 'Xiaomi Air Purifier 4 Pro',
    serial_number: 'AP-2024-001',
    type: 'เครื่องฟอกอากาศ',
    model: 'MI-AP-4-PRO',
    manufacturer: 'Xiaomi',
    purchase_date: '2024-01-01',
    warranty_expire: '2026-01-01',
    status: 'active',
    description: 'เครื่องฟอกอากาศรุ่นใหม่ล่าสุด มีประสิทธิภาพสูง เหมาะสำหรับพื้นที่ขนาดใหญ่',
    specs: {
      coverage: '48 ตารางเมตร',
      cadr: '500 m³/h',
      power: '45W',
      noise: '32-64 dB'
    }
  });

  // Mock data - ร้านที่ผูกอยู่
  const [bindings] = useState([
    {
      id: 1,
      shop_id: 1,
      shop_name: 'คาเฟ่ในสวนใบไม้',
      shop_owner: 'สมชาย ใจดี',
      shop_phone: '0812345678',
      shop_address: '123 ถนนสุขุมวิท กรุงเทพมหานคร',
      bound_date: '2024-01-15',
      bound_by: 'Admin',
      status: 'active'
    },
    {
      id: 2,
      shop_id: 3,
      shop_name: 'ร้านกาแฟสด',
      shop_owner: 'วิชัย มานะ',
      shop_phone: '0856789012',
      shop_address: '456 ถนนพระราม 4 กรุงเทพมหานคร',
      bound_date: '2024-03-20',
      bound_by: 'Staff 1',
      status: 'active'
    }
  ]);

  const getStatusBadge = (status) => {
    const config = {
      'active': { label: 'ใช้งานอยู่', className: 'bg-green-100 text-green-800' },
      'maintenance': { label: 'ซ่อมบำรุง', className: 'bg-amber-100 text-amber-800' },
      'inactive': { label: 'ไม่ใช้งาน', className: 'bg-gray-100 text-gray-800' }
    };
    const { label, className } = config[status] || config.active;
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${className}`}>{label}</span>;
  };

  const handleUnbind = (bindingId, shopName) => {
    if (window.confirm(`คุณต้องการปลดการผูกจากร้าน "${shopName}" หรือไม่?`)) {
      console.log('Unbinding:', bindingId);
      alert('ปลดการผูกสำเร็จ');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/equipment')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">รายละเอียดอุปกรณ์</h1>
            <p className="text-sm text-gray-600 mt-1">
              {equipment.serial_number}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/device-binding', { 
            state: { equipment }
          })}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <LinkIcon className="w-5 h-5" />
          <span>ผูกกับร้านใหม่</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Equipment Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <CogIcon className="w-12 h-12 text-white" />
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">{equipment.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{equipment.type}</p>
              <p className="text-xs text-gray-500 mt-2 font-mono">{equipment.serial_number}</p>
            </div>

            <div className="flex items-center justify-center">
              {getStatusBadge(equipment.status)}
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทั่วไป</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">ผู้ผลิต</span>
                <span className="text-sm font-medium text-gray-900">{equipment.manufacturer}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">รุ่น</span>
                <span className="text-sm font-medium text-gray-900">{equipment.model}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">วันที่ซื้อ</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(equipment.purchase_date).toLocaleDateString('th-TH')}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">หมดประกัน</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(equipment.warranty_expire).toLocaleDateString('th-TH')}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Specs Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">คุณสมบัติ</h3>
            <div className="space-y-3">
              {Object.entries(equipment.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-600 capitalize">{key}</span>
                  <span className="text-sm font-medium text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Bindings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ร้านค้าที่ผูกอยู่</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    ผูกอยู่กับ {bindings.length} ร้านค้า
                  </p>
                </div>
                <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                  <span className="text-2xl font-bold">{bindings.length}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              {bindings.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBagIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">ยังไม่มีการผูกกับร้านค้า</p>
                  <button
                    onClick={() => navigate('/device-binding', { state: { equipment } })}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    ผูกกับร้านค้า
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {bindings.map((binding) => (
                    <div
                      key={binding.id}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                              <ShoppingBagIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <Link
                                to={`/shops/${binding.shop_id}`}
                                className="text-lg font-semibold text-gray-900 hover:text-indigo-600"
                              >
                                {binding.shop_name}
                              </Link>
                              <p className="text-sm text-gray-600">{binding.shop_owner}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 ml-15">
                            <div>
                              <p className="text-xs text-gray-500">เบอร์โทร</p>
                              <p className="text-sm font-medium text-gray-900">{binding.shop_phone}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">วันที่ผูก</p>
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(binding.bound_date).toLocaleDateString('th-TH', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500">ที่อยู่</p>
                              <p className="text-sm font-medium text-gray-900">{binding.shop_address}</p>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col items-end space-y-2">
                          {getStatusBadge(binding.status)}
                          <button
                            onClick={() => handleUnbind(binding.id, binding.shop_name)}
                            className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            ปลดการผูก
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Binding History */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ประวัติการผูก</h3>
            <div className="space-y-3">
              {bindings.map((binding) => (
                <div key={binding.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      ผูกกับ {binding.shop_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(binding.bound_date).toLocaleDateString('th-TH', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} โดย {binding.bound_by}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetailPage;
