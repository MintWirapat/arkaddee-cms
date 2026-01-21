// ===================================
// ProductCatalogPage.jsx
// หน้าแสดงสินค้า (Public Website)
// ===================================

import React, { useState, useEffect } from 'react';
import { productsService } from '../services/productManagementService';
import './ProductCatalogPage.css';

const ProductCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshCount, setRefreshCount] = useState(0);

  // Fetch products on mount and auto-refresh
  useEffect(() => {
    fetchProducts();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getPublicProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('ไม่สามารถโหลดสินค้าได้');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  if (loading) {
    return <div className="pcp-loader">⏳ กำลังโหลดสินค้า...</div>;
  }

  return (
    <div className="pcp-container">
      {/* Header */}
      <div className="pcp-header">
        <h1>🌿 Arkaddee Products</h1>
        <p>ระบบจัดการคุณภาพอากาศแบบมั่นใจ</p>
      </div>

      {/* Error Message */}
      {error && <div className="pcp-error">{error}</div>}

      {/* Category Filter */}
      <div className="pcp-filter-section">
        <div className="pcp-filter-controls">
          {categories.map(cat => (
            <button
              key={cat}
              className={`pcp-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? '📦 ทั้งหมด' : cat}
            </button>
          ))}
        </div>
        
        <button
          className="pcp-refresh-btn"
          onClick={fetchProducts}
          title="รีเฟรชราคาล่าสุด"
        >
          🔄 อัพเดต
        </button>
      </div>

      {/* Products Grid */}
      <div className="pcp-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div
              key={product.id}
              className={`pcp-product-card ${product.status}`}
            >
              {/* Coming Soon Badge */}
              {product.status === 'coming_soon' && (
                <div className="pcp-coming-soon-badge">🔜 Coming Soon</div>
              )}

              {/* Product Image Placeholder */}
              <div className="pcp-product-image">
                <div className="pcp-image-placeholder">
                  {product.name}
                </div>
              </div>

              {/* Product Info */}
              <div className="pcp-product-body">
                <h2>{product.name}</h2>
                {product.category && (
                  <p className="pcp-category">
                    <span className="pcp-category-badge">
                      {product.category}
                    </span>
                  </p>
                )}
                
                {product.description && (
                  <p className="pcp-description">{product.description}</p>
                )}

                {/* Variants */}
                {product.variants && product.variants.length > 0 ? (
                  <div className="pcp-variants">
                    <h3>รุ่นที่มี</h3>
                    <div className="pcp-variant-list">
                      {product.variants.map(variant => (
                        <div key={variant.id} className="pcp-variant-item">
                          <div className="pcp-variant-header">
                            <span className="pcp-variant-name">
                              {variant.variant_name}
                            </span>
                            <span className="pcp-variant-price">
                              ฿{parseFloat(variant.price).toLocaleString('th-TH', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                              })}
                            </span>
                          </div>
                          
                          <div className="pcp-stock-info">
                            {variant.stock_quantity > 0 ? (
                              <span className="pcp-stock-available">
                                ✓ มีสต็อก ({variant.stock_quantity} ชิ้น)
                              </span>
                            ) : (
                              <span className="pcp-stock-unavailable">
                                ✗ สินค้าหมด
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="pcp-coming-soon-info">
                    <p>🔜 เร็วๆ นี้</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pcp-product-footer">
                <button className="pcp-btn-inquire">📧 สอบถามราคา</button>
              </div>
            </div>
          ))
        ) : (
          <div className="pcp-no-products">
            ไม่พบสินค้าในหมวดหมู่นี้
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pcp-info-footer">
        <p>💡 ราคาอัพเดตแบบอัตโนมัติ • ข้อมูลล่าสุด</p>
      </div>
    </div>
  );
};

export default ProductCatalogPage;
