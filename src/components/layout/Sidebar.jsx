import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ShoppingBagIcon,
  UsersIcon,
  CogIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

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
      name: 'จัดการอุปกรณ์',
      path: '/devices',
      icon: CogIcon,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      id: 4,
      name: 'ผู้ใช้งาน',
      path: '/users',
      icon: UserGroupIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Desktop Sidebar - Always visible, no overlay */}
      <aside className="hidden lg:flex lg:flex-col w-64 h-screen bg-white border-r border-gray-200 flex-shrink-0 sticky top-0">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <img 
              src="/src/assets/logoarkad.png" 
              alt="Logo" 
              className="h-14 object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                  ${active
                    ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-2 border-t border-gray-200">
          <button
            onClick={() => {
              if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">ออกจากระบบ</span>
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-3">
          <p className="text-xs text-center text-gray-500">
            © 2025 บริษัท วินเซนต์ ออโตเมชั่น จำกัด
          </p>
        </div>
      </aside>

      {/* Mobile Sidebar - Drawer with overlay */}
      <>
        {/* Mobile Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200
            transform transition-transform duration-300 ease-in-out
            lg:hidden
            flex flex-col
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {/* Logo with Close Button */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-3" onClick={onClose}>
              <img 
                src="/src/assets/logoarkad.png" 
                alt="Logo" 
                className="h-14 object-contain"
              />
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all
                    ${active
                      ? `${item.bgColor} ${item.color} font-medium shadow-sm`
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-2 border-t border-gray-200">
            <button
              onClick={() => {
                if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-sm font-medium">ออกจากระบบ</span>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-3">
            <p className="text-xs text-center text-gray-500">
              © 2025 บริษัท วินเซนต์ ออโตเมชั่น จำกัด
            </p>
          </div>
        </aside>
      </>
    </>
  );
};

export default Sidebar;