import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './components/dashboard/Dashboard';
import ShopList from './components/shops/ShopList';
import ShopCreatePage from './components/shops/ShopCreatePage';
import ShopEditPage from './components/shops/ShopEditPage';
import ShopDetailPage from './components/shops/ShopDetailPage';
import DeviceListPage from './components/devices/DeviceListPage';
import UsersPage from './components/admins/UsersPage';
import EquipmentList from './components/equipment/EquipmentList';
import EquipmentDetailPage from './components/equipment/EquipmentDetailPage';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProfilePage from './components/profile/ProfilePage';

// ✅ เพิ่ม Product Components
import ProductListPage from './components/products/ProductListPage';
import ProductDetailPage from './components/products/ProductDetailPage';
import ProductCreatePage from './components/products/ProductCreatePage';
import ProductEditPage from './components/products/ProductEditPage';

function App() {
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
          
          {/* ✅ Product Routes */}
          <Route path="products" element={<ProductListPage />} />
          <Route path="products/create" element={<ProductCreatePage />} />
          <Route path="products/:productId" element={<ProductDetailPage />} />
          <Route path="products/:productId/edit" element={<ProductEditPage />} />
          
          {/* Shop Routes */}
          <Route path="shops" element={<ShopList />} />
          <Route path="shops/create" element={<ShopCreatePage />} />
          <Route path="shops/:id" element={<ShopDetailPage />} />
          <Route path="shops/:id/edit" element={<ShopEditPage />} />
          
          {/* Device Routes */}
          <Route path="devices" element={<DeviceListPage />} />
          <Route path="devices/create" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">เพิ่มอุปกรณ์ใหม่</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          <Route path="devices/:id/edit" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">แก้ไขอุปกรณ์</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          
          {/* Users Routes (ผู้ใช้งานมือถือ) */}
          <Route path="users" element={<UsersPage />} />
          <Route path="users/:id/edit" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900">แก้ไขผู้ใช้งาน</h2>
              <p className="text-gray-600 mt-2">Coming soon...</p>
            </div>
          } />
          
          {/* Equipment Routes */}
          <Route path="equipment" element={<EquipmentList />} />
          <Route path="equipment/:id" element={<EquipmentDetailPage />} />

          {/* Legacy Routes - Redirect */}
          <Route path="reports" element={<Navigate to="/dashboard" replace />} />
          <Route path="settings" element={<Navigate to="/profile" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;