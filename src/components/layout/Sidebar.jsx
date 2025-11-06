import React from 'react';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    {
      id: 1,
      name: 'Dashboard',
      path: '/dashboard',
      icon: HomeIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 2,
      name: 'จัดการร้านค้า',
      path: '/shops',
      icon: ShoppingBagIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 3,
      name: 'ผู้ใช้งาน',
      path: '/users',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      name: 'รายงานสถิติ',
      path: '/reports',
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 5,
      name: 'การตั้งค่า',
      path: '/settings',
      icon: CogIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src="/logoarkad.png"
              alt="Arkaddee Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-900">Arkaddee</h1>
              <p className="text-xs text-gray-500">Admin CMS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg
                  transition-all duration-200 group
                  ${active
                    ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className={`
                  w-5 h-5 transition-transform group-hover:scale-110
                  ${active ? item.color : 'text-gray-400'}
                `} />
                <span className="text-sm">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
            <img
              src="https://i.pravatar.cc/150?img=68"
              alt="Admin"
              className="w-10 h-10 rounded-full ring-2 ring-indigo-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                ผู้ดูแลระบบ
              </p>
              <p className="text-xs text-gray-500 truncate">
                admin@arkaddee.com
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
