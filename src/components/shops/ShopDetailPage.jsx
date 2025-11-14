import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLeftIcon,
  StarIcon,
  UserIcon,
  CalendarIcon,
  CloudIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import api from '../../services/api';
import DeviceBindingModal from './DeviceBindingModal';

const ShopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      setLoading(true);
      try {
        const data = await api.shop.getById(id);
        console.log('Fetched shop data:', data);
        setShop(data);
      } catch (error) {
        console.error('Error fetching shop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('คุณต้องการลบร้านค้านี้หรือไม่?')) {
      try {
        await api.shop.delete(id);
        alert('ลบร้านค้าสำเร็จ');
        navigate('/shops');
      } catch (error) {
        console.error('Error deleting shop:', error);
        alert('เกิดข้อผิดพลาดในการลบร้านค้า');
      }
    }
  };

  const getDayName = (dayNumber) => {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[dayNumber];
  };

  const getAirQualityBadge = (pm25) => {
    if (!pm25 && pm25 !== 0) return { label: 'ไม่มีข้อมูล', className: 'bg-gray-100 text-gray-600' };
    if (pm25 <= 25) return { label: 'ดีมาก', className: 'bg-green-100 text-green-700' };
    if (pm25 <= 50) return { label: 'ดี', className: 'bg-blue-100 text-blue-700' };
    if (pm25 <= 100) return { label: 'ปานกลาง', className: 'bg-yellow-100 text-yellow-700' };
    return { label: 'แย่', className: 'bg-red-100 text-red-700' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">ไม่พบข้อมูลร้านค้า</h2>
        <button
          onClick={() => navigate('/shops')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  const airQuality = getAirQualityBadge(shop.environmentalMetrics?.pm25);

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      {/* Header - Add Card Border */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => navigate('/shops')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden mt-1"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{shop.name}</h1>
                {shop.types && shop.types.length > 0 && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    {shop.types[0].name}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="flex items-center">
                  <StarIconSolid className="w-5 h-5 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium text-gray-900">{shop.rating}</span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({shop.reviewSummary?.review_count || shop.review_count || 0} รีวิว)
                  </span>
                </div>
                <span className="text-sm text-gray-600">{shop.price_range}</span>
                {shop.average_price_per_person && (
                  <span className="text-sm text-gray-600">฿{shop.average_price_per_person}/คน</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              to={`/shops/${id}/edit`}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
              <span>แก้ไข</span>
            </Link>
            
            <button
              onClick={() => setShowDeviceModal(true)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <ComputerDesktopIcon className="w-4 h-4" />
              <span>จัดการอุปกรณ์</span>
            </button>
            
            <button
              onClick={handleDelete}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
              <span>ลบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Images Gallery */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 p-4 sm:p-6">
          {shop.images && shop.images.length > 0 ? (
            shop.images.map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={`https://api.arkaddee.com${image}`}
                  alt={`${shop.name} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400';
                  }}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-sm text-gray-500">ไม่มีรูปภาพ</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* รายละเอียด */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">รายละเอียด</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {shop.description || 'ไม่มีข้อมูล'}
            </p>
          </div>

          {/* ที่อยู่ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-gray-700" />
              ที่อยู่
            </h3>
            <div className="space-y-3">
              <p className="text-gray-900">{shop.address}</p>
              {shop.district && (
                <p className="text-gray-600 text-sm">{shop.district}</p>
              )}
              
              {shop.phone_number && (
                <div className="flex items-center space-x-2 pt-2">
                  <PhoneIcon className="w-4 h-4 text-gray-600" />
                  <a href={`tel:${shop.phone_number}`} className="text-gray-900 hover:text-indigo-600">
                    {shop.phone_number}
                  </a>
                </div>
              )}

              {/* พิกัดที่ตั้ง */}
              {shop.latitude && shop.longitude && (
                <div className="pt-3 border-t">
                  <div className="text-sm space-y-1 mb-3">
                    <p className="text-gray-600">📌 Lat: <span className="text-gray-900">{shop.latitude}</span></p>
                    <p className="text-gray-600 ml-4">Long: <span className="text-gray-900">{shop.longitude}</span></p>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <MapPinIcon className="w-4 h-4" />
                    <span>เปิดใน Google Maps</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* เวลาทำการ */}
          {shop.openingHours && shop.openingHours.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-gray-700" />
                เวลาทำการ
              </h3>
              <div className="space-y-0 divide-y divide-gray-100">
                {shop.openingHours.map((hour, index) => (
                  <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <span className="text-gray-700 font-medium">
                      {getDayName(hour.day_of_week)}
                    </span>
                    {hour.is_open ? (
                      <span className="text-gray-900">
                        {hour.open_time?.substring(0, 5)} - {hour.close_time?.substring(0, 5)}
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">ปิด</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* รีวิวจากลูกค้า */}
          {shop.reviews && shop.reviews.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <StarIcon className="w-5 h-5 mr-2 text-gray-700" />
                รีวิวจากลูกค้า ({shop.reviews.length})
              </h3>
              <div className="space-y-4">
                {shop.reviews.map((review) => (
                  <div key={review.review_id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <StarIconSolid
                                key={i}
                                className={`w-4 h-4 ${
                                  i < parseFloat(review.rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                        </div>
                        {review.review_text && (
                          <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* คุณภาพอากาศ */}
          {shop.environmentalMetrics && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <CloudIcon className="w-5 h-5 mr-2 text-gray-700" />
                คุณภาพอากาศ
              </h3>
              <div className="space-y-4">
                {/* PM2.5 */}
                {shop.environmentalMetrics.pm25 !== null && shop.environmentalMetrics.pm25 !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">PM2.5</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${airQuality.className}`}>
                        {airQuality.label}
                      </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{shop.environmentalMetrics.pm25}</p>
                    <p className="text-xs text-gray-500 mt-1">µg/m³</p>
                  </div>
                )}

                {/* อุณหภูมิ */}
                {shop.environmentalMetrics.temperature && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600 block mb-1">อุณหภูมิ</span>
                    <p className="text-2xl font-bold text-gray-900">{shop.environmentalMetrics.temperature}°C</p>
                  </div>
                )}

                {/* ความชื้น */}
                {shop.environmentalMetrics.humidity && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600 block mb-1">ความชื้น</span>
                    <p className="text-2xl font-bold text-gray-900">{shop.environmentalMetrics.humidity}%</p>
                  </div>
                )}

                {/* CO₂ */}
                {shop.environmentalMetrics.co2 && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600 block mb-1">CO₂</span>
                    <p className="text-2xl font-bold text-gray-900">{shop.environmentalMetrics.co2}</p>
                    <p className="text-xs text-gray-500 mt-1">ppm</p>
                  </div>
                )}

                {/* TVOC */}
                {shop.environmentalMetrics.tvoc && (
                  <div className="pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-600 block mb-1">TVOC</span>
                    <p className="text-2xl font-bold text-gray-900">{shop.environmentalMetrics.tvoc}</p>
                    <p className="text-xs text-gray-500 mt-1">mg/m³</p>
                  </div>
                )}

                {/* วันที่อัพเดท */}
                {shop.environmentalMetrics.created_at && (
                  <p className="text-xs text-gray-500 pt-3 border-t border-gray-100">
                    อัพเดทล่าสุด: {formatDate(shop.environmentalMetrics.created_at)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* อุปกรณ์ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">อุปกรณ์</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                {shop.has_air_purifier ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" />
                )}
                <span className={`text-sm ${shop.has_air_purifier ? 'text-gray-900' : 'text-gray-400'}`}>
                  เครื่องฟอกอากาศ
                </span>
              </div>
              <div className="flex items-center">
                {shop.has_air_ventilator ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-gray-300 mr-2 flex-shrink-0" />
                )}
                <span className={`text-sm ${shop.has_air_ventilator ? 'text-gray-900' : 'text-gray-400'}`}>
                  เครื่องระบายอากาศ
                </span>
              </div>
            </div>
          </div>

          {/* เวลาเปิด-ปิด */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <ClockIcon className="w-5 h-5 mr-2 text-gray-700" />
              เวลาเปิด-ปิด
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">เปิด:</span>
                <span className="font-medium text-gray-900">{shop.open_time?.substring(0, 5) || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ปิด:</span>
                <span className="font-medium text-gray-900">{shop.close_time?.substring(0, 5) || '-'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Device Binding Modal */}
      {showDeviceModal && (
        <DeviceBindingModal
          shopId={id}
          shopName={shop.name}
          onClose={() => setShowDeviceModal(false)}
          onSuccess={() => {
            // Refresh shop data to show updated devices
            const fetchShop = async () => {
              try {
                const data = await api.shop.getById(id);
                setShop(data);
              } catch (error) {
                console.error('Error refreshing shop:', error);
              }
            };
            fetchShop();
          }}
        />
      )}
    </div>
  );
};

export default ShopDetailPage;