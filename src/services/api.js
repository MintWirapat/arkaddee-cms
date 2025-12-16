// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to build headers
const buildHeaders = (customHeaders = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Generic fetch wrapper with error handling
const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    ...options,
    headers: buildHeaders(options.headers)
  };

  try {
    console.log(`🌐 ${config.method || 'GET'} ${url}`);

    const response = await fetch(url, config);

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.error('❌ API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        url: url,
        errorData: errorData
      });

      throw new Error(errorData.message || errorData.error || `HTTP Error: ${response.status}`);
    }

    // Return parsed JSON
    const data = await response.json();
    console.log(`✅ Response:`, data);
    return data;
  } catch (error) {
    console.error('💥 API Error:', error);
    throw error;
  }
};

// ============================================
// Authentication APIs
// ============================================
export const authAPI = {

  getProfile: () =>
    apiFetch('/auth/me')
};

// ============================================
// Shop APIs
// ============================================
export const shopAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/stores/all${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/stores/admin/${id}`),

  create: (shopData) =>
    apiFetch('/stores', {
      method: 'POST',
      body: JSON.stringify(shopData)
    }),

  update: (id, shopData) =>
    apiFetch(`/stores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(shopData)
    }),

  delete: (id) =>
    apiFetch(`/stores/${id}`, {
      method: 'DELETE'
    }),

  approve: (id) =>
    apiFetch(`/stores/${id}/approve`, {
      method: 'PATCH'
    }),

  uploadImage: (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    return apiFetch(`/stores/${id}/image`, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData
    });
  },

  // Device binding
  getDevices: (shopId) =>
    apiFetch(`/stores/${shopId}/devices`),

  bindDevice: (shopId, deviceId) =>
    apiFetch(`/stores/${shopId}/devices`, {
      method: 'POST',
      body: JSON.stringify({ device_id: deviceId })
    }),

  unbindDevice: (shopId, deviceId) =>
    apiFetch(`/stores/${shopId}/devices/${deviceId}`, {
      method: 'DELETE'
    })
};

// ============================================
// Equipment APIs
// ============================================
export const equipmentAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/equipment${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/equipment/${id}`),

  checkBySerial: (serialNumber) =>
    apiFetch(`/equipment/check/${serialNumber}`),

  create: (equipmentData) =>
    apiFetch('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipmentData)
    }),

  update: (id, equipmentData) =>
    apiFetch(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData)
    }),

  delete: (id) =>
    apiFetch(`/equipment/${id}`, {
      method: 'DELETE'
    }),

  // Get equipment bindings (which shops it's bound to)
  getBindings: (id) =>
    apiFetch(`/equipment/${id}/bindings`)
};

// ============================================
// Device APIs
// ============================================
export const deviceAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/device${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/device/${id}`),

  create: (deviceData) =>
    apiFetch('/device', {
      method: 'POST',
      body: JSON.stringify(deviceData)
    }),

  update: (id, deviceData) =>
    apiFetch(`/device/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData)
    }),

  delete: (id) =>
    apiFetch(`/device/${id}`, {
      method: 'DELETE'
    }),

  // POST /api/device/devicesetup - ผูกอุปกรณ์
  setupDevice: (setupData) =>
    apiFetch('/device/devicesetup', {
      method: 'POST',
      body: JSON.stringify(setupData)
    })
};

// ============================================
// deviceStore Binding APIs
// ============================================
export const deviceStoreAPI = {
  getBoundCount: () =>
    apiFetch('/deviceStore/storedevice'),

  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/deviceStore${queryString ? `?${queryString}` : ''}`);
  },

  updateDeviceStoreCCDC: (store_id, status) =>
    apiFetch(`/deviceStore/CCDC/${store_id}`, {
      method: 'PUT',
      body: JSON.stringify(status)
    }),

  /**
   * ✅ ดึงอุปกรณ์ที่ผูกกับร้านแล้ว
   * GET /api/deviceStore/shop/:shopId
   */
  getShopDevices: (shopId) =>
    apiFetch(`/deviceStore/${shopId}`),

  /**
   * ✅ ดึงอุปกรณ์ที่สามารถผูกได้
   * GET /api/deviceStore/available/:shopId
   */
  getAvailableDevices: (shopId) =>
    apiFetch(`/deviceStore/available/${shopId}`),

  /**
   * ✅ ผูกอุปกรณ์กับร้านค้า
   * POST /api/deviceStore/bind
   */
  bindDevice: (shopId, deviceId, devicetype) =>
    apiFetch('/deviceStore', {
      method: 'POST',
      body: JSON.stringify({ storeId: shopId, deviceId: deviceId, deviceType: devicetype })
    }),

  /**
   * ✅ ยกเลิกการผูกอุปกรณ์
   * DELETE /api/deviceStore/unbind
   */
  unbindDevice: (shopId, deviceId) =>
    apiFetch(`/deviceStore/${shopId}`, {
      method: 'DELETE'
    }),

  /**
   * ✅ ตรวจสอบว่าอุปกรณ์ถูกผูกกับร้านหรือไม่
   * GET /api/deviceStore/check/:shopId/:deviceId
   */
  checkBinding: (shopId, deviceId) =>
    apiFetch(`/deviceStore/check/${shopId}/${deviceId}`),

  /**
   * ✅ ดึงข้อมูลการผูกทั้งหมด (Admin)
   * GET /api/deviceStore/all
   */
  getAllBindings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.shopId) params.append('shopId', filters.shopId);
    if (filters.deviceId) params.append('deviceId', filters.deviceId);
    const queryString = params.toString();
    return apiFetch(`/deviceStore/all${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * ✅ ดึงสถิติการผูก (Admin)
   * GET /api/deviceStore/stats
   */
  getBindingStats: () =>
    apiFetch('/deviceStore/stats')
};

// ============================================
// Admin APIs
// ============================================
export const adminAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/admins${queryString ? `?${queryString}` : ''}`);
  },

  login: (credentials) =>
    apiFetch('/auth/loginadmin', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getById: (id) =>
    apiFetch(`/admins/${id}`),

  create: (adminData) =>
    apiFetch('/admins', {
      method: 'POST',
      body: JSON.stringify(adminData)
    }),

  update: (id, adminData) =>
    apiFetch(`/admins/${id}`, {
      method: 'PUT',
      body: JSON.stringify(adminData)
    }),

  delete: (id) =>
    apiFetch(`/admins/${id}`, {
      method: 'DELETE'
    }),

  updatePermissions: (id, permissions) =>
    apiFetch(`/admins/${id}/permissions`, {
      method: 'PUT',
      body: JSON.stringify({ permissions })
    }),

  getPermissions: (id) =>
    apiFetch(`/admins/${id}/permissions`)
};

// ============================================
// User APIs (Mobile App Users)
// ============================================
export const userAPI = {
  // GET /api/users - ดู user ทั้งหมดในระบบ
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/users/${id}`),

  // GET /api/users/device - ดูอุปกรณ์ที่ผูกกับ user นี้ (ต้องส่ง token)
  getDevices: (id) =>
    apiFetch(`/users/device/${id}`),

  // PUT /api/users/profile - แก้ไขโปรไฟล์
  updateProfile: (userData) =>
    apiFetch('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  update: (id, userData) =>
    apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    }),

  // DELETE /api/users/device/:id - ลบอุปกรณ์ที่ผูก
  unbindDevice: (deviceId) =>
    apiFetch(`/users/device/${deviceId}`, {
      method: 'DELETE'
    }),

  delete: (id) =>
    apiFetch(`/users/${id}`, {
      method: 'DELETE'
    }),

  block: (id) =>
    apiFetch(`/users/${id}/block`, {
      method: 'PATCH'
    }),

  unblock: (id) =>
    apiFetch(`/users/${id}/unblock`, {
      method: 'PATCH'
    })
};

// ============================================
// Reports/Stats APIs
// ============================================
export const statsAPI = {
  getDashboard: () =>
    apiFetch('/stats/dashboard'),

  getShopStats: () =>
    apiFetch('/stats/shops'),

  getEquipmentStats: () =>
    apiFetch('/stats/equipment'),

  getUserStats: () =>
    apiFetch('/stats/users'),

  getMonthlyTrends: (year) =>
    apiFetch(`/stats/trends?year=${year}`)
};

// ============================================
// Upload APIs
// ============================================
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return apiFetch('/upload/image', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type
      body: formData
    });
  },

  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return apiFetch('/upload/images', {
      method: 'POST',
      headers: {},
      body: formData
    });
  }
};

export const productAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/products/${id}`),

  create: (productData) =>
    apiFetch('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),

  update: (id, productData) =>
    apiFetch(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),

  delete: (id) =>
    apiFetch(`/products/${id}`, {
      method: 'DELETE'
    })
};  

// ============================================
// Export all APIs
// ============================================
export default {
  auth: authAPI,
  shop: shopAPI,
  equipment: equipmentAPI,
  device: deviceAPI,
  deviceStore: deviceStoreAPI,  // ✅ deviceStore Binding API
  admin: adminAPI,
  user: userAPI,
  stats: statsAPI,
  upload: uploadAPI,
  product: productAPI

};