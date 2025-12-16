import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DeviceBindingModal = ({ shopId, shopName, onClose, onSuccess }) => {
  const [devices, setDevices] = useState([]);
  const [boundDevices, setBoundDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [binding, setBinding] = useState(null);
  const [unbinding, setUnbinding] = useState(null);
  const [ccdc, setCcdc] = useState(false);
  const [updatingCCDC, setUpdatingCCDC] = useState(false);

  useEffect(() => {
    fetchData();
  }, [shopId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ ดึงอุปกรณ์ทั้งหมด
      let allDevices = [];
      try {
        const allDevicesResponse = await api.deviceStore.getAll();
        console.log('All Devices Response:', allDevicesResponse);
        allDevices = allDevicesResponse.data || allDevicesResponse || [];
      } catch (error) {
        console.warn('Could not fetch all devices:', error);
        allDevices = [];
      }

      // ✅ ดึงอุปกรณ์ที่ผูกกับร้านนี้
      let bound = [];
      try {
        const boundResponse = await api.deviceStore.getShopDevices(shopId);
        if (Array.isArray(boundResponse.data)) {
          bound = boundResponse.data;
        } else if (boundResponse.data && typeof boundResponse.data === 'object') {
          bound = [boundResponse.data];  // ← Wrap single object
        }

      } catch (error) {
        console.warn('Could not fetch bound devices:', error);
        bound = [];
      }
      console.log('Bound Devices:', bound);
      setDevices(allDevices);
      setBoundDevices(bound);
      console.log('CCDC Status:', allDevices[0]);
      setCcdc(bound[0].ccdc); // Reset CCDC when fetching new data
    } catch (error) {
      console.error('Error fetching devices:', error);
      alert('ไม่สามารถโหลดข้อมูลอุปกรณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleBind = async (deviceId, devicetype) => {
    setBinding(deviceId);
    try {
      // ✅ ใช้ api.deviceStore.bindDevice แทน api.shop.bindDevice
      await api.deviceStore.bindDevice(shopId, deviceId, devicetype);
      alert('✅ ผูกอุปกรณ์สำเร็จ!');
      fetchData();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error binding device:', error);
      alert('❌ ไม่สามารถผูกอุปกรณ์ได้: ' + (error.message || ''));
    } finally {
      setBinding(null);
    }
  };

  const handleUnbind = async (deviceId) => {
    if (!window.confirm('ต้องการยกเลิกการผูกอุปกรณ์นี้หรือไม่?')) return;

    setUnbinding(deviceId);
    try {
      // ✅ ใช้ api.deviceStore.unbindDevice แทน api.shop.unbindDevice
      await api.deviceStore.unbindDevice(shopId, deviceId);
      alert('✅ ยกเลิกการผูกสำเร็จ!');
      fetchData();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error unbinding device:', error);
      alert('❌ ไม่สามารถยกเลิกการผูกได้: ' + (error.message || ''));
    } finally {
      setUnbinding(null);
    }
  };

  const isBound = (deviceId) => {
    return boundDevices.some(d => d.device_id === deviceId);
  }

  const handleCCDCToggle = async (newStatus) => {
    setUpdatingCCDC(true);
    try {
      // ส่ง object { ccdc: true/false }
      await api.deviceStore.updateDeviceStoreCCDC(shopId, { status: newStatus });
      setCcdc(newStatus);
      alert('✅ อัปเดต CCDC สำเร็จ!');
    } catch (error) {
      console.error('Error updating CCDC:', error);
      alert('❌ ไม่สามารถอัปเดต CCDC ได้: ' + (error.message || ''));
    } finally {
      setUpdatingCCDC(false);
    }
  }

  const availableDevices = devices.filter(d => !isBound(d.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">จัดการอุปกรณ์</h2>
            <p className="text-sm text-gray-600 mt-1">ร้าน: {shopName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Bound Devices */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                    อุปกรณ์ที่ผูกอยู่ ({boundDevices.length})
                  </h3>
                  
                  {/* CCDC Switch - Show only when devices are bound */}
                  {boundDevices.length > 0 && (
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">CCDC:</label>
                      <button
                        onClick={() => handleCCDCToggle(!ccdc)}
                        disabled={updatingCCDC}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
                          ccdc ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            ccdc ? 'translate-x-4' : 'translate-x-1'
                          }`}
                        />
                      </button>
                      {updatingCCDC && <span className="text-xs text-gray-500">อัปเดต...</span>}
                    </div>
                  )}
                </div>

                {boundDevices.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <ComputerDesktopIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">ยังไม่มีอุปกรณ์ที่ผูกอยู่</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {boundDevices.map((device) => (
                      <div
                        key={device.id}
                        className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <ComputerDesktopIcon className="w-8 h-8 text-green-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{device.device_type + '  ' + device.id || 'ไม่มีชื่อ'}</p>
                            <p className="text-sm text-gray-600">{device.device_type || '-'}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleUnbind(device.id , shopId )}
                          disabled={unbinding === device.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="ยกเลิกการผูก"
                        >
                          {unbinding === device.id ? (
                            <span className="animate-spin">⏳</span>
                          ) : (
                            <TrashIcon className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Available Devices */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <PlusIcon className="w-5 h-5 text-gray-600 mr-2" />
                  อุปกรณ์ที่สามารถผูกได้ ({availableDevices.length})
                </h3>

                {availableDevices.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <ComputerDesktopIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">ไม่มีอุปกรณ์ที่ว่างให้ผูก</p>
                    <p className="text-sm text-gray-500 mt-1">อุปกรณ์ทั้งหมดถูกผูกไปแล้ว</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableDevices.map((device) => (
                      <div
                        key={device.id}
                        className="border border-gray-200 bg-white rounded-lg p-4 flex items-center justify-between hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center">
                          <ComputerDesktopIcon className="w-8 h-8 text-gray-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{device.device_type + '  ' + device.device_id || 'ไม่มีชื่อ'}</p>
                            <p className="text-sm text-gray-600">{device.serial_number || '-'}</p>
                            {device.device_type && (
                              <p className="text-xs text-gray-500">{device.device_type}</p>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleBind(device.device_id, device.device_type)}
                          disabled={binding === device.device_id}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm"
                        >
                          {binding === device.id ? 'กำลังผูก...' : 'ผูก'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceBindingModal;