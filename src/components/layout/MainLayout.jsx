import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'ml-0'
      }`}>
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              © 2025 บริษัท วินเซนต์ ออโตเมชั่น จำกัด. สงวนลิขสิทธิ์.
            </p>
            <div className="mt-1 space-x-3 text-xs text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">นโยบายความเป็นส่วนตัว</a>
              <span>|</span>
              <a href="#" className="hover:text-indigo-600 transition-colors">ข้อกำหนดการใช้งาน</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;