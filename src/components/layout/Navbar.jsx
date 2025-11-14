import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = ({ onMenuClick, sidebarOpen }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Get user from localStorage
  const getUserFromStorage = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString || userString === 'undefined' || userString === 'null') {
        return { name: 'Admin', email: 'admin@arkaddee.com' };
      }
      return JSON.parse(userString);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return { name: 'Admin', email: 'admin@arkaddee.com' };
    }
  };

  const user = getUserFromStorage();

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      navigate('/login');
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section: Menu Button */}
        <div className="flex items-center space-x-4">
          {/* Hamburger Menu - Only visible on mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-6 h-6 text-gray-600" />
          </button>

          {/* Title */}
          <h1 className="text-lg font-semibold text-gray-800">
            Arkaddee CMS
          </h1>
        </div>

        {/* Right Section: Profile Only */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ring-2 ring-gray-100">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-xs">
                    {user.name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.email || user.phone}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center border-t border-gray-200"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  ออกจากระบบ
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;