import React from 'react';
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  SparklesIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  // Mock data from JSON
  const stats = {
    total_shops: 248,
    pending_shops: 12,
    new_today: 5,
    total_revenue: 1250000,
    shops_with_air_purifier: 156,
    shops_with_fresh_air: 89
  };

  const monthlyData = [
    { month: "ม.ค.", shops: 42, revenue: 180000 },
    { month: "ก.พ.", shops: 38, revenue: 165000 },
    { month: "มี.ค.", shops: 45, revenue: 195000 },
    { month: "เม.ย.", shops: 52, revenue: 220000 },
    { month: "พ.ค.", shops: 48, revenue: 210000 },
    { month: "มิ.ย.", shops: 23, revenue: 95000 }
  ];

  // Stat Cards Data
  const statCards = [
    {
      title: 'ร้านค้าทั้งหมด',
      value: stats.total_shops.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingBagIcon,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'รอตรวจสอบ',
      value: stats.pending_shops.toLocaleString(),
      change: '+3',
      trend: 'up',
      icon: ClockIcon,
      color: 'amber',
      bgGradient: 'from-amber-500 to-amber-600'
    },
    {
      title: 'ร้านใหม่วันนี้',
      value: stats.new_today.toLocaleString(),
      change: '+2',
      trend: 'up',
      icon: SparklesIcon,
      color: 'emerald',
      bgGradient: 'from-emerald-500 to-emerald-600'
    },
    {
      title: 'รายได้รวม',
      value: `฿${(stats.total_revenue / 1000).toFixed(0)}K`,
      change: '-5.2%',
      trend: 'down',
      icon: BanknotesIcon,
      color: 'rose',
      bgGradient: 'from-rose-500 to-rose-600'
    }
  ];

  // Chart Data for Monthly Shops
  const lineChartData = {
    labels: monthlyData.map(d => d.month),
    datasets: [
      {
        label: 'จำนวนร้านค้าใหม่',
        data: monthlyData.map(d => d.shops),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }
    ]
  };

  // Chart Data for Equipment Usage
  const barChartData = {
    labels: ['เครื่องฟอกอากาศ', 'เครื่องเติมอากาศ', 'มีทั้งสองอย่าง'],
    datasets: [
      {
        label: 'จำนวนร้านค้า',
        data: [stats.shops_with_air_purifier, stats.shops_with_fresh_air, 42],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            ภาพรวมระบบจัดการร้านค้า Arkaddee
          </p>
        </div>
        <div className="text-sm text-gray-500">
          อัพเดทล่าสุด: {new Date().toLocaleDateString('th-TH', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
          
          return (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.bgGradient}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Monthly Shops */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            จำนวนร้านค้าใหม่ต่อเดือน
          </h3>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        {/* Bar Chart - Equipment Usage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ร้านที่ใช้อุปกรณ์ฟอกอากาศ
          </h3>
          <div className="h-64">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Shops Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">ร้านค้าที่รอตรวจสอบ</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ชื่อร้านค้า
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จังหวัด
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่สร้าง
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">หอมหมูกระทะ</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">ร้านอาหาร</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  เชียงใหม่
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    รออนุมัติ
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  1 ก.พ. 2568
                </td>
              </tr>
              <tr className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">สวนอาหารริมทะเล</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600">ร้านอาหาร</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  ภูเก็ต
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    รออนุมัติ
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  5 ก.พ. 2568
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;