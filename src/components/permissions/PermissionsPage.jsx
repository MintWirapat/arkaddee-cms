import React, { useState } from 'react';
import {
  ShieldCheckIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const PermissionsPage = () => {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [saving, setSaving] = useState(false);

  // Mock data - ผู้ดูแลระบบ
  const admins = [
    { id: 1, name: 'สมชาย ใจดี', role: 'Admin', email: 'somchai@arkaddee.com' },
    { id: 2, name: 'สมหญิง รักสงบ', role: 'Staff', email: 'somying@arkaddee.com' },
    { id: 3, name: 'วิชัย มานะ', role: 'Staff', email: 'wichai@arkaddee.com' },
    { id: 4, name: 'ประภา สว่าง', role: 'Admin', email: 'prapa@arkaddee.com' }
  ];

  // สิทธิ์ทั้งหมด
  const allPermissions = [
    {
      module: 'Dashboard',
      permissions: [
        { id: 'dashboard.view', name: 'ดูหน้า Dashboard', description: 'สามารถเข้าดูภาพรวมระบบ' }
      ]
    },
    {
      module: 'จัดการร้านค้า',
      permissions: [
        { id: 'shops.view', name: 'ดูรายการร้านค้า', description: 'สามารถดูรายการร้านค้าทั้งหมด' },
        { id: 'shops.create', name: 'เพิ่มร้านค้า', description: 'สามารถเพิ่มร้านค้าใหม่' },
        { id: 'shops.edit', name: 'แก้ไขร้านค้า', description: 'สามารถแก้ไขข้อมูลร้านค้า' },
        { id: 'shops.delete', name: 'ลบร้านค้า', description: 'สามารถลบร้านค้า' },
        { id: 'shops.approve', name: 'อนุมัติร้านค้า', description: 'สามารถอนุมัติร้านค้าใหม่' }
      ]
    },
    {
      module: 'การผูกอุปกรณ์',
      permissions: [
        { id: 'binding.view', name: 'ดูการผูกอุปกรณ์', description: 'สามารถดูรายการการผูก' },
        { id: 'binding.create', name: 'ผูกอุปกรณ์', description: 'สามารถผูกอุปกรณ์กับร้านค้า' },
        { id: 'binding.unbind', name: 'ปลดการผูก', description: 'สามารถปลดการผูกอุปกรณ์' }
      ]
    },
    {
      module: 'ผู้ดูแลระบบ',
      permissions: [
        { id: 'admins.view', name: 'ดูรายการผู้ดูแล', description: 'สามารถดูรายการผู้ดูแลระบบ' },
        { id: 'admins.create', name: 'เพิ่มผู้ดูแล', description: 'สามารถเพิ่มผู้ดูแลระบบใหม่' },
        { id: 'admins.edit', name: 'แก้ไขผู้ดูแล', description: 'สามารถแก้ไขข้อมูลผู้ดูแล' },
        { id: 'admins.delete', name: 'ลบผู้ดูแล', description: 'สามารถลบผู้ดูแลระบบ' }
      ]
    },
    {
      module: 'ผู้ใช้งาน',
      permissions: [
        { id: 'users.view', name: 'ดูรายการผู้ใช้', description: 'สามารถดูรายการผู้ใช้งาน' },
        { id: 'users.edit', name: 'แก้ไขผู้ใช้', description: 'สามารถแก้ไขข้อมูลผู้ใช้' },
        { id: 'users.delete', name: 'ลบผู้ใช้', description: 'สามารถลบผู้ใช้งาน' },
        { id: 'users.block', name: 'บล็อกผู้ใช้', description: 'สามารถบล็อก/ปลดบล็อกผู้ใช้' }
      ]
    },
    {
      module: 'จัดการอุปกรณ์',
      permissions: [
        { id: 'equipment.view', name: 'ดูรายการอุปกรณ์', description: 'สามารถดูรายการอุปกรณ์' },
        { id: 'equipment.create', name: 'เพิ่มอุปกรณ์', description: 'สามารถเพิ่มอุปกรณ์ใหม่' },
        { id: 'equipment.edit', name: 'แก้ไขอุปกรณ์', description: 'สามารถแก้ไขข้อมูลอุปกรณ์' },
        { id: 'equipment.delete', name: 'ลบอุปกรณ์', description: 'สามารถลบอุปกรณ์' }
      ]
    },
    {
      module: 'จัดการสิทธิ์',
      permissions: [
        { id: 'permissions.view', name: 'ดูการจัดการสิทธิ์', description: 'สามารถดูการตั้งค่าสิทธิ์' },
        { id: 'permissions.edit', name: 'แก้ไขสิทธิ์', description: 'สามารถแก้ไขสิทธิ์ผู้ใช้' }
      ]
    }
  ];

  // Mock permissions สำหรับแต่ละคน
  const [userPermissions, setUserPermissions] = useState({
    1: ['dashboard.view', 'shops.view', 'shops.create', 'shops.edit', 'shops.delete', 'shops.approve', 'binding.view', 'binding.create', 'admins.view', 'users.view', 'equipment.view', 'permissions.view', 'permissions.edit'],
    2: ['dashboard.view', 'shops.view', 'shops.edit', 'binding.view', 'equipment.view', 'users.view'],
    3: ['dashboard.view', 'shops.view', 'equipment.view'],
    4: ['dashboard.view', 'shops.view', 'shops.create', 'shops.edit', 'shops.approve', 'admins.view', 'permissions.view']
  });

  const handleTogglePermission = (permissionId) => {
    if (!selectedAdmin) return;

    setUserPermissions(prev => {
      const adminId = selectedAdmin.id;
      const current = prev[adminId] || [];
      
      if (current.includes(permissionId)) {
        return {
          ...prev,
          [adminId]: current.filter(p => p !== permissionId)
        };
      } else {
        return {
          ...prev,
          [adminId]: [...current, permissionId]
        };
      }
    });
  };

  const hasPermission = (permissionId) => {
    if (!selectedAdmin) return false;
    const adminPermissions = userPermissions[selectedAdmin.id] || [];
    return adminPermissions.includes(permissionId);
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('บันทึกการตั้งค่าสิทธิ์สำเร็จ!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">จัดการสิทธิ์</h1>
        <p className="text-sm text-gray-600 mt-1">
          กำหนดสิทธิ์การใช้งานสำหรับผู้ดูแลระบบและพนักงาน
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: เลือกผู้ดูแล */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">เลือกผู้ดูแลระบบ</h3>
            
            <div className="space-y-2">
              {admins.map((admin) => (
                <button
                  key={admin.id}
                  onClick={() => setSelectedAdmin(admin)}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedAdmin?.id === admin.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {admin.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{admin.name}</p>
                      <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                        admin.role === 'Admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {admin.role}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: จัดการสิทธิ์ */}
        <div className="lg:col-span-2">
          {!selectedAdmin ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <ShieldCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">กรุณาเลือกผู้ดูแลระบบเพื่อจัดการสิทธิ์</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      จัดการสิทธิ์: {selectedAdmin.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{selectedAdmin.email}</p>
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>กำลังบันทึก...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        <span>บันทึก</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {allPermissions.map((module) => (
                  <div key={module.module}>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">{module.module}</h4>
                    <div className="space-y-2">
                      {module.permissions.map((permission) => {
                        const enabled = hasPermission(permission.id);
                        return (
                          <div
                            key={permission.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                              <p className="text-xs text-gray-500">{permission.description}</p>
                            </div>
                            <button
                              onClick={() => handleTogglePermission(permission.id)}
                              className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                enabled ? 'bg-indigo-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;