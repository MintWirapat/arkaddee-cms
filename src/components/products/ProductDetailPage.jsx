import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { productAPI } from '../../services/api';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(productId);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('ไม่สามารถดึงข้อมูลสินค้าได้');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productAPI.delete(productId);
      navigate('/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('ไม่สามารถลบสินค้าได้');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error || 'ไม่พบข้อมูลสินค้า'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>กลับ</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Link
            to={`/products/${productId}/edit`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PencilSquareIcon className="w-5 h-5" />
            <span>แก้ไข</span>
          </Link>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <TrashIcon className="w-5 h-5" />
            <span>ลบ</span>
          </button>
        </div>
      </div>

      {/* Product Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Section */}
        <div className="lg:col-span-1">
          {product.image_path ? (
            <img
              src={`https://api.arkaddee.com${product.image_path}`}
              alt={product.name}
              className="w-full h-auto rounded-lg shadow-md object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">ไม่มีรูปภาพ</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="mt-4 flex items-center space-x-2">
                {product.is_active ? (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">ใช้งาน</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <XCircleIcon className="w-5 h-5" />
                    <span className="text-sm font-medium">ปิดใช้งาน</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Device Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ประเภทอุปกรณ์
                </label>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {product.device_type}
                </p>
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รุ่น
                </label>
                <p className="mt-2 text-lg font-medium text-gray-900">
                  {product.model}
                </p>
              </div>

              {/* ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <p className="mt-2 text-sm font-mono text-gray-600">
                  {product.id}
                </p>
              </div>

              {/* Created At */}
              {product.created_at && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    วันที่สร้าง
                  </label>
                  <p className="mt-2 text-sm text-gray-600">
                    {new Date(product.created_at).toLocaleDateString('th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รายละเอียด
                </label>
                <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ยืนยันการลบสินค้า
            </h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบสินค้า "{product.name}"? การกระทำนี้ไม่สามารถยกเลิกได้
            </p>
            <div className="flex space-x-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;