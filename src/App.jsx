import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ShopList from './components/shops/ShopList';
import ShopRegistrationForm from './components/shops/ShopRegistrationForm';
import ShopEditPage from './components/shops/ShopEditPage';
import ShopDetailPage from './components/shops/ShopDetailPage';
import UserList from './components/users/UserList';
import ReportsPage from './components/reports/ReportsPage';
import SettingsPage from './components/settings/SettingsPage';
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
          
          {/* Shop Routes */}
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
          <Route path="shops/:id" element={<ShopDetailPage />} />
          <Route path="shops/:id/edit" element={<ShopEditPage />} />
          
          {/* User Routes */}
          <Route path="users" element={<UserList />} />
          <Route path="users/create" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">เพิ่มผู้ใช้ใหม่</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          <Route path="users/:id" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">รายละเอียดผู้ใช้</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          <Route path="users/:id/edit" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">แก้ไขผู้ใช้</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          
          {/* Other Routes */}
          <Route path="reports" element={<ReportsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;