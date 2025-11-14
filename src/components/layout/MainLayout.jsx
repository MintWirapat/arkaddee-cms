import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar - Always visible on desktop, drawer on mobile */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs text-center text-gray-500">
              © 2025 บริษัท วินเซนต์ ออโตเมชั่น จำกัด. สงวนลิขสิทธิ์.
            </p>
            <div className="flex justify-center space-x-4 mt-2 text-xs text-gray-500">
              <a href="#" className="hover:text-indigo-600">นโยบายความเป็นส่วนตัว</a>
              <span>|</span>
              <a href="#" className="hover:text-indigo-600">ข้อกำหนดการใช้งาน</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;