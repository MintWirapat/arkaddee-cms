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
// Image Converter - Base64
// ============================================
export const imageConverter = {
  /**
   * แปลง File object เป็น Base64 string
   */
  fileToBase64: (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('ไม่มีไฟล์ที่เลือก'));
        return;
      }

      if (!file.type.startsWith('image/')) {
        reject(new Error('กรุณาเลือกไฟล์รูปภาพเท่านั้น'));
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        reject(new Error('ขนาดไฟล์ต้องน้อยกว่า 5MB'));
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        console.log('📸 Image converted to Base64');
        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(new Error('ไม่สามารถอ่านไฟล์ได้'));
      };

      reader.readAsDataURL(file);
    });
  },

  /**
   * บีบอัดรูปภาพ
   */
  compressImage: (base64Image, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        console.log('🖼️ Image compressed');
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error('ไม่สามารถโหลดรูปภาพได้'));
      };

      img.src = base64Image;
    });
  },

  /**
   * แปลงรูปเป็น Base64 พร้อมบีบอัด
   */
  fileToCompressedBase64: async (file, quality = 0.8) => {
    try {
      const base64 = await imageConverter.fileToBase64(file);
      const compressed = await imageConverter.compressImage(base64, quality);
      return compressed;
    } catch (error) {
      console.error('❌ Error converting image:', error);
      throw error;
    }
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
      headers: {},
      body: formData
    });
  },

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

  getShopDevices: (shopId) =>
    apiFetch(`/deviceStore/${shopId}`),

  getAvailableDevices: (shopId) =>
    apiFetch(`/deviceStore/available/${shopId}`),

  bindDevice: (shopId, deviceId, devicetype) =>
    apiFetch('/deviceStore', {
      method: 'POST',
      body: JSON.stringify({ storeId: shopId, deviceId: deviceId, deviceType: devicetype })
    }),

  unbindDevice: (shopId, deviceId) =>
    apiFetch(`/deviceStore/${shopId}`, {
      method: 'DELETE'
    }),

  checkBinding: (shopId, deviceId) =>
    apiFetch(`/deviceStore/check/${shopId}/${deviceId}`),

  getAllBindings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.shopId) params.append('shopId', filters.shopId);
    if (filters.deviceId) params.append('deviceId', filters.deviceId);
    const queryString = params.toString();
    return apiFetch(`/deviceStore/all${queryString ? `?${queryString}` : ''}`);
  },

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
// User APIs
// ============================================
export const userAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/users/${id}`),

  getDevices: (id) =>
    apiFetch(`/users/device/${id}`),

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
      headers: {},
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

// ============================================
// Product APIs - Base64 Upload
// ============================================
export const productAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiFetch(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id) =>
    apiFetch(`/products/${id}`),

    
  create: (productData) =>
    console.log('Creating product with data:', productData) ||
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
    }),


  /**
   * ลบรูปภาพสินค้า
   */
  deleteImage: (id) =>
    apiFetch(`/products/${id}/image`, {
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
  deviceStore: deviceStoreAPI,
  admin: adminAPI,
  user: userAPI,
  stats: statsAPI,
  upload: uploadAPI,
  product: productAPI
};