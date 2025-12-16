import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingStorefrontIcon,
  ComputerDesktopIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalShops: 0,
    approvedShops: 0,
    pendingShops: 0,
    totalDevices: 0,
    boundDevices: 0,
    unboundDevices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch shops
      const shopsResponse = await api.shop.getAll();
      const shops = Array.isArray(shopsResponse) ? shopsResponse : [];
      
      // Fetch devices
      const devicesResponse = await api.deviceStore.getAll();
      console.log('✅ Devices fetched for stats:', devicesResponse);
      const devices = devicesResponse.data || devicesResponse || [];
    
      let boundCount = 0;
      try {
        const boundResponse = await api.deviceStore.getBoundCount();
        console.log('✅ Bound device count response:', boundResponse);
        boundCount = boundResponse.count || 0;
      } catch (error) {
        console.warn('Could not fetch bound device count:', error);
        boundCount = 0;
      }
      setStats({
        totalShops: shops.length,
        approvedShops: shops.filter(s => s.status == 'active').length,
        pendingShops: shops.filter(s => s.status != 'active').length,
        totalDevices: devices.length,
        boundDevices: boundCount,
        unboundDevices: devices.length - boundCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {onClick && (
          <ArrowRightIcon className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-sm font-medium text-gray-700">{title}</p>
      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  );

  const MiniStatCard = ({ icon: Icon, label, value, color }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <div className={`p-2 rounded ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <p className="text-xs text-gray-600">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ChartBarIcon className="w-8 h-8 mr-3 text-indigo-600" />
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2">ภาพรวมระบบจัดการร้านค้าและอุปกรณ์</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BuildingStorefrontIcon}
          title="ร้านค้าทั้งหมด"
          value={stats.totalShops}
          subtitle="คลิกเพื่อดูรายละเอียด"
          color="bg-blue-500"
          onClick={() => navigate('/shops')}
        />
        
        <StatCard
          icon={CheckCircleIcon}
          title="ร้านค้าที่อนุมัติแล้ว"
          value={stats.approvedShops}
          subtitle={`${stats.pendingShops} รออนุมัติ`}
          color="bg-green-500"
          onClick={() => navigate('/shops')}
        />
        
        <StatCard
          icon={ComputerDesktopIcon}
          title="อุปกรณ์ทั้งหมด"
          value={stats.totalDevices}
          subtitle="คลิกเพื่อดูรายละเอียด"
          color="bg-purple-500"
          onClick={() => navigate('/devices')}
        />
        
        <StatCard
          icon={CheckCircleIcon}
          title="อุปกรณ์ที่ผูกแล้ว"
          value={stats.boundDevices}
          subtitle={`${stats.unboundDevices} ยังไม่ผูก`}
          color="bg-indigo-500"
          onClick={() => navigate('/devices')}
        />
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-blue-500" />
            สถิติร้านค้า
          </h2>
          <div className="space-y-3">
            <MiniStatCard
              icon={BuildingStorefrontIcon}
              label="ร้านค้าทั้งหมด"
              value={stats.totalShops}
              color="bg-blue-500"
            />
            <MiniStatCard
              icon={CheckCircleIcon}
              label="อนุมัติแล้ว"
              value={stats.approvedShops}
              color="bg-green-500"
            />
            <MiniStatCard
              icon={ClockIcon}
              label="รออนุมัติ"
              value={stats.pendingShops}
              color="bg-yellow-500"
            />
          </div>
          
          <button
            onClick={() => navigate('/shops')}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <span>ดูร้านค้าทั้งหมด</span>
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Device Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <ComputerDesktopIcon className="w-5 h-5 mr-2 text-purple-500" />
            สถิติอุปกรณ์
          </h2>
          <div className="space-y-3">
            <MiniStatCard
              icon={ComputerDesktopIcon}
              label="อุปกรณ์ทั้งหมด"
              value={stats.totalDevices}
              color="bg-purple-500"
            />
            <MiniStatCard
              icon={CheckCircleIcon}
              label="ผูกกับร้านแล้ว"
              value={stats.boundDevices}
              color="bg-indigo-500"
            />
            <MiniStatCard
              icon={XCircleIcon}
              label="ยังไม่ได้ผูก"
              value={stats.unboundDevices}
              color="bg-gray-500"
            />
          </div>
          
          <button
            onClick={() => navigate('/devices')}
            className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <span>ดูอุปกรณ์ทั้งหมด</span>
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">เมนูด่วน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/shops/create')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left"
          >
            <BuildingStorefrontIcon className="w-6 h-6 mb-2" />
            <p className="font-semibold">เพิ่มร้านค้า</p>
          </button>
          
          <button
            onClick={() => navigate('/users')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left"
          >
            <UserGroupIcon className="w-6 h-6 mb-2" />
            <p className="font-semibold">ผู้ใช้งาน</p>
          </button>
          
          <button
            onClick={() => navigate('/shops')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left"
          >
            <CheckCircleIcon className="w-6 h-6 mb-2" />
            <p className="font-semibold">อนุมัติร้านค้า</p>
          </button>
          
          <button
            onClick={() => navigate('/devices')}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 transition-all text-left"
          >
            <CheckCircleIcon className="w-6 h-6 mb-2" />
            <p className="font-semibold">ผูกอุปกรณ์</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;