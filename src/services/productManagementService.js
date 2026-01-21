// ===================================
// productManagementService.js
// Service สำหรับจัดการราคาสินค้าผ่าน API
// ===================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cmsToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===================================
// AUTHENTICATION
// ===================================

export const cmsAuthService = {
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        username,
        password
      });
      const { token } = response.data;
      localStorage.setItem('cmsToken', token);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('cmsToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('cmsToken');
  }
};

// ===================================
// PRODUCTS & VARIANTS (สินค้า)
// ===================================

export const productsService = {
  // Get all products (Public) - ✅ ใช้นี้เพราะไม่ต้องใช้ API ที่ต้อง auth
  getPublicProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get product by slug (Public)
  getProductBySlug: async (slug) => {
    try {
      const response = await axios.get(`${API_URL}/products/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all products (Admin) - ต้อง token
  getAllProductsAdmin: async () => {
    try {
      const response = await apiClient.get('/cms/products');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update product details
  updateProduct: async (productId, data) => {
    try {
      const response = await apiClient.put(
        `/cms/products/${productId}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ===================================
// PRODUCT VARIANTS (รุ่นสินค้า)
// ===================================

export const variantsService = {
  // Update variant price ⭐ (หลัก)
  updateVariantPrice: async (variantId, newPrice, changeReason = '') => {
    try {
      const response = await apiClient.put(
        `/cms/variants/${variantId}/price`,
        {
          new_price: parseFloat(newPrice),
          change_reason: changeReason
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update variant stock
  updateVariantStock: async (variantId, stockQuantity) => {
    try {
      const response = await apiClient.put(
        `/cms/variants/${variantId}/stock`,
        {
          stock_quantity: parseInt(stockQuantity)
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get price history
  getPriceHistory: async (variantId) => {
    try {
      const response = await apiClient.get(
        `/cms/variants/${variantId}/price-history`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ===================================
// ACTIVITY LOGS (บันทึกการกระทำ)
// ===================================

export const activityLogsService = {
  // Get all activity logs
  getActivityLogs: async (limit = 50) => {
    try {
      const response = await apiClient.get(
        `/cms/activity-logs?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  cmsAuthService,
  productsService,
  variantsService,
  activityLogsService
};