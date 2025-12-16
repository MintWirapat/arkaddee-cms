import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ComputerDesktopIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';
import ShopBindingModal from './ShopBindingModal';

const DeviceListPage = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await api.deviceStore.getAll();
      console.log('✅ Devices fetched:', response);
      setDevices(response.data || response || []);
    } catch (error) {
      console.error('❌ Error fetching devices:', error);
      alert('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const filteredDevices = devices.filter(device => {
    const searchLower = searchTerm.toLowerCase();
    return (
      device.name?.toLowerCase().includes(searchLower) ||
      device.serial_number?.toLowerCase().includes(searchLower) ||
      device.device_type?.toLowerCase().includes(searchLower)
    );
  });

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ComputerDesktopIcon className="w-8 h-8 text-indigo-600" />
              จัดการอุปกรณ์
            </h1>
            <p className="text-gray-600 mt-1">
              จำนวนอุปกรณ์ทั้งหมด: {devices.length} เครื่อง
            </p>
          </div>

          <button
            onClick={() => navigate('/devices/create')}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            เพิ่มอุปกรณ์ใหม่
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ค้นหาด้วยชื่อ, Serial Number, ประเภท..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Device List */}
      {filteredDevices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ComputerDesktopIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'ไม่พบอุปกรณ์ที่ค้นหา' : 'ยังไม่มีอุปกรณ์'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'ลองค้นหาด้วยคำอื่น' : 'เริ่มต้นเพิ่มอุปกรณ์ใหม่เพื่อจัดการ'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => navigate('/devices/create')}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              เพิ่มอุปกรณ์ใหม่
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              {/* Device Icon & Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <ComputerDesktopIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900">{device.device_type + '  ' + device.device_id || 'ไม่มีชื่อ'}</h3>
                    <p className="text-sm text-gray-500">{device.device_type || 'ไม่ระบุประเภท'}</p>
                  </div>
                </div>
                
                {device.is_active ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-500" title="ใช้งานอยู่" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-red-500" title="ไม่ได้ใช้งาน" />
                )}
              </div>

              {/* Device Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Serial Number:</span>
                  <span className="font-mono text-gray-900">{device.serial_number || '-'}</span>
                </div>
                
                {device.shop_name && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ผูกกับร้าน:</span>
                    <span className="text-indigo-600 font-medium">{device.shop_name}</span>
                  </div>
                )}

                {device.last_active && (
                  <div className="text-sm text-gray-600">
                    ใช้งานล่าสุด: {new Date(device.last_active).toLocaleDateString('th-TH')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {device.shop_name ? (
                  // Already bound - show unbind button
                  <button
                    onClick={() => setSelectedDevice(device)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                    ยกเลิกการผูก
                  </button>
                ) : (
                  // Not bound yet - show bind button
                  <button
                    onClick={() => setSelectedDevice(device)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <BuildingStorefrontIcon className="w-4 h-4 mr-1" />
                    ผูกร้าน
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shop Binding Modal */}
      {selectedDevice && (
        <ShopBindingModal
          deviceId={selectedDevice.id}
          deviceName={selectedDevice.name || 'อุปกรณ์'}
          onClose={() => setSelectedDevice(null)}
          onSuccess={() => {
            setSelectedDevice(null);
            fetchDevices(); // Refresh device list
          }}
        />
      )}
    </div>
  );
};

export default DeviceListPage;