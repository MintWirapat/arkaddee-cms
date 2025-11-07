import React, { useState } from 'react';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShoppingBagIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('month');

  // Mock data
  const stats = [
    {
      label: 'ร้านค้าทั้งหมด',
      value: '248',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBagIcon,
      color: 'bg-purple-500'
    },
    {
      label: 'ผู้ใช้งานทั้งหมด',
      value: '1,234',
      change: '+8.3%',
      trend: 'up',
      icon: UsersIcon,
      color: 'bg-blue-500'
    },
    {
      label: 'รออนุมัติ',
      value: '45',
      change: '-5.2%',
      trend: 'down',
      icon: ClockIcon,
      color: 'bg-amber-500'
    },
    {
      label: 'รายได้รวม',
      value: '฿1.25M',
      change: '+15.8%',
      trend: 'up',
      icon: CurrencyDollarIcon,
      color: 'bg-green-500'
    }
  ];

  const categoryData = [
    { name: 'คาเฟ่', count: 85, percentage: 34 },
    { name: 'ร้านอาหาร', count: 72, percentage: 29 },
    { name: 'ร้านค้าปลีก', count: 45, percentage: 18 },
    { name: 'บริการ', count: 28, percentage: 11 },
    { name: 'อื่นๆ', count: 18, percentage: 8 }
  ];

  const monthlyData = [
    { month: 'ม.ค.', shops: 40, users: 180 },
    { month: 'ก.พ.', shops: 38, users: 195 },
    { month: 'มี.ค.', shops: 45, users: 220 },
    { month: 'เม.ย.', shops: 48, users: 245 },
    { month: 'พ.ค.', shops: 52, users: 280 },
    { month: 'มิ.ย.', shops: 55, users: 310 }
  ];

  const topShops = [
    { rank: 1, name: 'คาเฟ่ในสวนใบไม้', category: 'คาเฟ่', views: 1250, rating: 4.8 },
    { rank: 2, name: 'หอมหมูกระทะ', category: 'ร้านอาหาร', views: 1180, rating: 4.7 },
    { rank: 3, name: 'ร้านกาแฟสด', category: 'คาเฟ่', views: 980, rating: 4.6 },
    { rank: 4, name: 'ร้านอาหารญี่ปุ่น', category: 'ร้านอาหาร', views: 875, rating: 4.5 },
    { rank: 5, name: 'ร้านขนมไทย', category: 'ร้านค้าปลีก', views: 720, rating: 4.4 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">รายงานสถิติ</h1>
          <p className="text-sm text-gray-600 mt-1">
            ภาพรวมและวิเคราะห์ข้อมูลธุรกิจ
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="week">7 วันที่ผ่านมา</option>
          <option value="month">30 วันที่ผ่านมา</option>
          <option value="quarter">3 เดือนที่ผ่านมา</option>
          <option value="year">1 ปีที่ผ่านมา</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">แนวโน้มรายเดือน</h3>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-purple-600">
                      <ShoppingBagIcon className="w-4 h-4 inline mr-1" />
                      {data.shops}
                    </span>
                    <span className="text-blue-600">
                      <UsersIcon className="w-4 h-4 inline mr-1" />
                      {data.users}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(data.shops / 60) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(data.users / 350) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="text-gray-600">ร้านค้า</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-gray-600">ผู้ใช้งาน</span>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">กระจายตามหมวดหมู่</h3>
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">
                    {category.count} ({category.percentage}%)
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Shops Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">ร้านค้ายอดนิยม</h3>
          <p className="text-sm text-gray-600 mt-1">อันดับร้านค้าที่มียอดเข้าชมสูงสุด</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">อันดับ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ชื่อร้าน</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">หมวดหมู่</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">ยอดเข้าชม</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">คะแนน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {topShops.map((shop) => (
                <tr key={shop.rank} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
                      <span className="text-sm font-bold text-white">#{shop.rank}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{shop.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{shop.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{shop.views.toLocaleString()}</span>
                    <span className="text-xs text-gray-500 ml-1">views</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{shop.rating}</span>
                      <span className="text-amber-500 ml-1">★</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">การเติบโต</h4>
          <p className="text-3xl font-bold">+15.8%</p>
          <p className="text-sm opacity-90 mt-2">เพิ่มขึ้นจากเดือนที่แล้ว</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">อัตราการอนุมัติ</h4>
          <p className="text-3xl font-bold">92.5%</p>
          <p className="text-sm opacity-90 mt-2">ร้านค้าได้รับการอนุมัติ</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h4 className="text-lg font-semibold mb-2">เวลาเฉลี่ย</h4>
          <p className="text-3xl font-bold">2.3 วัน</p>
          <p className="text-sm opacity-90 mt-2">ในการพิจารณาอนุมัติ</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
