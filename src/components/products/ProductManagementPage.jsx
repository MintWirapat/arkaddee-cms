// ===================================
// ProductManagementPage.jsx (UI ONLY)
// Mock Data ตามสินค้าจริง
// ===================================

import React, { useState } from 'react';
import './ProductManagementPage.css';

// 🎨 Mock Data - ตามสินค้าจริง
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Arkad PPV',
    status: 'active',
    variants: [
      { id: 1, variant_name: '160T', price: 23400, stock_quantity: 10 },
      { id: 2, variant_name: '250T', price: 29700, stock_quantity: 8 },
      { id: 3, variant_name: '350T', price: 37200, stock_quantity: 5 },
      { id: 4, variant_name: '440T', price: 41500, stock_quantity: 3 }
    ]
  },
  {
    id: 2,
    name: 'Arkad ERV',
    status: 'active',
    variants: [
      { id: 5, variant_name: '150T', price: 34200, stock_quantity: 7 },
      { id: 6, variant_name: '250T', price: 44800, stock_quantity: 4 }
    ]
  },
  {
    id: 3,
    name: 'Dust Walker',
    status: 'active',
    variants: [
      { id: 7, variant_name: '', price: 3200, stock_quantity: 50 }
    ]
  },
  {
    id: 4,
    name: 'Arkad Monitor',
    status: 'active',
    variants: [
      { id: 8, variant_name: '', price: 6500, stock_quantity: 20 }
    ]
  },
  {
    id: 5,
    name: 'Arkad IPV',
    status: 'coming_soon',
    variants: [
      { id: 9, variant_name: '', price: 0, stock_quantity: 0 }
    ]
  }
];

const ProductManagementPage = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [message, setMessage] = useState('');
  const [editingVariant, setEditingVariant] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [priceReason, setPriceReason] = useState('');
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  // ===== Update Price (Mock) =====
  const handleUpdatePrice = async () => {
    if (!editingVariant || !newPrice) {
      setMessage({ type: 'error', text: 'กรุณาใส่ราคาใหม่' });
      return;
    }

    if (parseFloat(newPrice) < 0) {
      setMessage({ type: 'error', text: 'ราคาต้องเป็นค่าบวก' });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update mock data
      setProducts(prevProducts =>
        prevProducts.map(product =>
          {
            return {
              ...product,
              variants: product.variants.map(variant =>
                variant.id === editingVariant.id
                  ? { ...variant, price: parseFloat(newPrice) }
                  : variant
              )
            };
          }
        )
      );

      setMessage({
        type: 'success',
        text: `✅ อัพเดตราคา ${editingVariant.variant_name} เป็น ฿${parseFloat(newPrice).toLocaleString('th-TH')} สำเร็จแล้ว!`
      });

      setEditingVariant(null);
      setNewPrice('');
      setPriceReason('');
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'ไม่สามารถอัพเดตราคา'
      });
    } finally {
      setLoading(false);
    }
  };

  // ===== MAIN UI =====
  return (
    <div className="pms-container">
      {/* Header */}
      <header className="pms-header">
        <div className="pms-header-left">
          <h1>📦 จัดการราคาสินค้า</h1>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`pms-message pms-message-${message.type}`}>
          {message.text}
          <button
            className="pms-close-msg"
            onClick={() => setMessage('')}
          >
            ×
          </button>
        </div>
      )}

      {/* Content */}
      <div className="pms-content">
        <div className="pms-products-list">
          {products.map((product) => (
            <div key={product.id} className="pms-product-item">
              <div
                className="pms-product-header"
                onClick={() =>
                  setExpandedProduct(
                    expandedProduct === product.id ? null : product.id
                  )
                }
              >
                <div className="pms-product-info">
                  <h2>{product.name}</h2>
                  <span className={`pms-status pms-status-${product.status}`}>
                    {product.status === 'active' ? '✓ ใช้งาน' : 'Coming Soon'}
                  </span>
                </div>
                <span className="pms-expand-icon">
                  {expandedProduct === product.id ? '▼' : '▶'}
                </span>
              </div>

              {expandedProduct === product.id && product.variants && (
                <div className="pms-variants-list">
                  <table className="pms-variants-table">
                    <thead>
                      <tr>
                        <th>รุ่น</th>
                        <th>ราคาปัจจุบัน</th>
                        <th>การกระทำ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.variants.map((variant) => (
                        <tr key={variant.id}>
                          <td className="pms-variant-name">
                            {product.name} {variant.variant_name}
                          </td>
                          <td className="pms-variant-price">
                            {variant.price > 0 ? `฿${parseFloat(variant.price).toLocaleString('th-TH')}` : '-'}
                          </td>
                          <td className="pms-variant-actions">
                            <button
                              className="pms-btn pms-btn-edit pms-btn-xs"
                              onClick={() => {
                                setEditingVariant(variant);
                                setNewPrice(variant.price || '');
                                setPriceReason('');
                              }}
                            >
                              ✎ เปลี่ยนราคา
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal Edit Price */}
      {editingVariant && (
        <div
          className="pms-modal-overlay"
          onClick={() => setEditingVariant(null)}
        >
          <div
            className="pms-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pms-modal-header">
              <h2>แก้ไขราคา</h2>
              <button
                className="pms-modal-close"
                onClick={() => setEditingVariant(null)}
              >
                ×
              </button>
            </div>

            <div className="pms-modal-body">
              <div className="pms-form-group">
                <label>สินค้า</label>
                <input
                  type="text"
                  value={`${products.find(p => p.variants.some(v => v.id === editingVariant.id))?.name} ${editingVariant.variant_name}`}
                  disabled
                  className="pms-input-disabled"
                />
              </div>

              <div className="pms-form-group">
                <label>ราคาเดิม</label>
                <input
                  type="text"
                  value={`฿${parseFloat(editingVariant.price).toLocaleString('th-TH')}`}
                  disabled
                  className="pms-input-disabled"
                />
              </div>

              <div className="pms-form-group">
                <label>ราคาใหม่ (฿)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => {
                    const value = e.target.value;
                    // ถ้าติดลบ ให้ตั้งเป็น 0
                    if (value === '' || parseFloat(value) >= 0) {
                      setNewPrice(value);
                    }
                  }}
                  placeholder="ใส่ราคาใหม่"
                  step="100"
                  min="0"
                  autoFocus
                />
              </div>

              <div className="pms-form-group">
                <label>เหตุผลการเปลี่ยน (ทางเลือก)</label>
                <textarea
                  value={priceReason}
                  onChange={(e) => setPriceReason(e.target.value)}
                  placeholder="เช่น ส่วนลดฤดูกาล, โปรโมชัน"
                  rows={3}
                />
              </div>

              {newPrice && (
                <div className="pms-price-preview">
                  <strong>ราคาเดิม:</strong> ฿{parseFloat(editingVariant.price).toLocaleString('th-TH')}<br />
                  <strong>ราคาใหม่:</strong> ฿{parseFloat(newPrice).toLocaleString('th-TH')}<br />
                  <strong className={
                    parseFloat(newPrice) > parseFloat(editingVariant.price)
                      ? 'pms-increase'
                      : 'pms-decrease'
                  }>
                    เปลี่ยน {((newPrice - editingVariant.price) / editingVariant.price * 100).toFixed(1)}%
                  </strong>
                </div>
              )}
            </div>

            <div className="pms-modal-footer">
              <button
                className="pms-btn pms-btn-secondary"
                onClick={() => setEditingVariant(null)}
              >
                ยกเลิก
              </button>
              <button
                className="pms-btn pms-btn-primary"
                onClick={handleUpdatePrice}
                disabled={loading || !newPrice}
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกราคา'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagementPage;