import React, { useState, useEffect } from 'react';
import {
  XMarkIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const ShopBindingModal = ({ deviceId, deviceName, onClose, onSuccess }) => {
  const [shops, setShops] = useState([]);
  const [boundShop, setBoundShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [binding, setBinding] = useState(null);
  const [unbinding, setUnbinding] = useState(false);

  useEffect(() => {
    fetchData();
  }, [deviceId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all shops
      const allShopsResponse = await api.shop.getAll();
      const allShops = Array.isArray(allShopsResponse) ? allShopsResponse : [];
      
      // Find which shop this device is bound to
      // We'll check each shop's devices
      let currentShop = null;
      for (const shop of allShops) {
        try {
          const devicesResponse = await api.shop.getDevices(shop.id);
          const devices = devicesResponse.data || devicesResponse || [];
          if (devices.some(d => d.id === deviceId)) {
            currentShop = shop;
            break;
          }
        } catch (error) {
          // Shop might not have devices endpoint, skip
          continue;
        }
      }
      
      setShops(allShops);
      setBoundShop(currentShop);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('ไม่สามารถโหลดข้อมูลร้านค้าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleBind = async (shopId) => {
    setBinding(shopId);
    try {
      await api.shop.bindDevice(shopId, deviceId);
      alert('✅ ผูกอุปกรณ์กับร้านสำเร็จ!');
      fetchData();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error binding device:', error);
      alert('❌ ไม่สามารถผูกอุปกรณ์ได้: ' + (error.message || ''));
    } finally {
      setBinding(null);
    }
  };

  const handleUnbind = async () => {
    if (!boundShop) return;
    if (!window.confirm(`ต้องการยกเลิกการผูกจากร้าน "${boundShop.name}" หรือไม่?`)) return;
    
    setUnbinding(true);
    try {
      await api.shop.unbindDevice(boundShop.id, deviceId);
      alert('✅ ยกเลิกการผูกสำเร็จ!');
      fetchData();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error unbinding device:', error);
      alert('❌ ไม่สามารถยกเลิกการผูกได้: ' + (error.message || ''));
    } finally {
      setUnbinding(false);
    }
  };

  const availableShops = shops.filter(s => !boundShop || s.id !== boundShop.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">ผูกอุปกรณ์กับร้าน</h2>
            <p className="text-sm text-gray-600 mt-1">อุปกรณ์: {deviceName}</p>
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
              {/* Currently Bound Shop */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ร้านที่ผูกอยู่
                </h3>
                
                {!boundShop ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">ยังไม่ได้ผูกกับร้านใดๆ</p>
                  </div>
                ) : (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="w-8 h-8 text-green-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{boundShop.name}</p>
                        <p className="text-sm text-gray-600">{boundShop.address || 'ไม่มีที่อยู่'}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleUnbind}
                      disabled={unbinding}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                      title="ยกเลิกการผูก"
                    >
                      {unbinding ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <TrashIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Available Shops */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <PlusIcon className="w-5 h-5 text-gray-600 mr-2" />
                  ร้านค้าที่สามารถผูกได้ ({availableShops.length})
                </h3>
                
                {availableShops.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <BuildingStorefrontIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">
                      {boundShop ? 'อุปกรณ์ถูกผูกไปแล้ว' : 'ไม่มีร้านค้าที่สามารถผูกได้'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {availableShops.map((shop) => (
                      <div
                        key={shop.id}
                        className="border border-gray-200 bg-white rounded-lg p-4 flex items-center justify-between hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-center flex-1 min-w-0">
                          <BuildingStorefrontIcon className="w-8 h-8 text-gray-600 mr-3 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900 truncate">{shop.name}</p>
                            <p className="text-sm text-gray-600 truncate">{shop.address || 'ไม่มีที่อยู่'}</p>
                            {shop.types && shop.types.length > 0 && (
                              <p className="text-xs text-gray-500 truncate">
                                {shop.types.map(t => t.name).join(', ')}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleBind(shop.id)}
                          disabled={binding === shop.id}
                          className="ml-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
                        >
                          {binding === shop.id ? 'กำลังผูก...' : 'ผูก'}
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

export default ShopBindingModal;