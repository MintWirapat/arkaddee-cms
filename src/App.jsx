import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ShopList from './components/shops/ShopList';
import ShopRegistrationForm from './components/shops/ShopRegistrationForm';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './components/profile/ProfilePage';

function App() {
  const handleShopSubmit = (data) => {
    console.log('Shop data submitted:', data);
    alert('บันทึกข้อมูลสำเร็จ!');
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="shops" element={<ShopList />} />
          <Route path="shops/create" element={
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">เพิ่มร้านค้าใหม่</h1>
                <p className="text-sm text-gray-600 mt-1">กรอกข้อมูลร้านค้าให้ครบถ้วน</p>
              </div>
              <ShopRegistrationForm 
                onSubmit={handleShopSubmit} 
                onCancel={handleCancel}
              />
            </div>
          } />
          <Route path="users" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">จัดการผู้ใช้งาน</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          <Route path="reports" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">รายงานสถิติ</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          <Route path="settings" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">การตั้งค่า</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;