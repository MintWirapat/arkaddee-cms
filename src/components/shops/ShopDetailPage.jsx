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
// API Base Configuration
const API_BASE_URL_Image = import.meta.env.VITE_API_URL_IMAGE || 'http://localhost:3000/api';

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

  // ✅ NEW: Parse address string into components
  const parseAddress = (addressString) => {
    if (!addressString || typeof addressString !== 'string') {
      return null;
    }

    const components = {
      house_number: '',
      moo: '',
      soi: '',
      subdistrict: '',
      district: '',
      province: '',
      postal_code: ''
    };

    // Split by comma and trim, filter out empty strings
    const parts = addressString.split(',').map(p => p.trim()).filter(p => p !== '');

    if (parts.length === 0) return null;

    // Parse: "123/4, หมู่ 2, แม่ต้าน, ท่าสองยาง, ตาก, 63150"
    // Strategy: Work backwards since postal code is usually last

    // parts[0] = house number - always first
    components.house_number = parts[0];

    // Find postal code (5 digits at the end)
    const lastPart = parts[parts.length - 1];
    if (/^\d{5}$/.test(lastPart)) {
      components.postal_code = lastPart;

      // Province is second to last
      if (parts.length >= 2) {
        components.province = parts[parts.length - 2];
      }

      // District is third to last
      if (parts.length >= 3) {
        components.district = parts[parts.length - 3];
      }

      // Subdistrict is fourth to last
      if (parts.length >= 4) {
        components.subdistrict = parts[parts.length - 4];
      }

      // Handle moo and soi from remaining parts
      if (parts.length >= 2) {
        const middleParts = parts.slice(1, parts.length - 4);

        for (const part of middleParts) {
          if (part.includes('หมู่')) {
            components.moo = part.replace(/หมู่/gi, '').trim();
          } else if (!components.soi) {
            components.soi = part;
          }
        }
      }
    } else {
      // No postal code, parse what we have
      if (parts.length >= 2 && parts[1].includes('หมู่')) {
        components.moo = parts[1].replace(/หมู่/gi, '').trim();
      } else if (parts.length >= 2) {
        components.soi = parts[1];
      }

      if (parts.length >= 5) {
        components.province = parts[4];
        components.district = parts[3];
        components.subdistrict = parts[2];
      } else if (parts.length === 4) {
        components.district = parts[3];
        components.subdistrict = parts[2];
      } else if (parts.length === 3) {
        components.subdistrict = parts[2];
      }
    }

    return components;
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
                  src={`${API_BASE_URL_Image}${image}`}
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

          {/* ประเภทและราคา */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ข้อมูลทั่วไป</h3>
            <div className="space-y-4">
              {/* ประเภทสถานที่ */}
              {shop.types && shop.types.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">ประเภทสถานที่</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.types.map((type, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                      >
                        {type.name || type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ประเภทอาหาร */}
              {shop.cuisines && shop.cuisines.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">ประเภทอาหาร</p>
                  <div className="flex flex-wrap gap-2">
                    {shop.cuisines.map((cuisine, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {cuisine.name || cuisine}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ช่วงราคา */}
              {shop.price_range && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">ช่วงราคา</p>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-900">
                      {shop.price_range}
                    </span>
                    {shop.average_price_per_person && (
                      <span className="text-sm text-gray-600">
                        (~{shop.average_price_per_person} บาท/คน)
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ที่อยู่ */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-gray-700" />
              ที่อยู่
            </h3>
            <div className="space-y-3">
              {/* Parse and display address components */}
              {(() => {
                const addressParts = parseAddress(shop.address);

                if (addressParts) {
                  return (
                    <div className="space-y-2">
                      {/* House Number */}
                      {addressParts.house_number && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">บ้านเลขที่:</span>
                          <span className="text-sm text-gray-900">{addressParts.house_number}</span>
                        </div>
                      )}

                      {/* Moo */}
                      {addressParts.moo && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">หมู่ที่:</span>
                          <span className="text-sm text-gray-900">{addressParts.moo}</span>
                        </div>
                      )}

                      {/* Soi */}
                      {addressParts.soi && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">ซอย:</span>
                          <span className="text-sm text-gray-900">{addressParts.soi}</span>
                        </div>
                      )}

                      {/* Subdistrict */}
                      {addressParts.subdistrict && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">ตำบล/แขวง:</span>
                          <span className="text-sm text-gray-900">{addressParts.subdistrict}</span>
                        </div>
                      )}

                      {/* District */}
                      {addressParts.district && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">อำเภอ/เขต:</span>
                          <span className="text-sm text-gray-900">{addressParts.district}</span>
                        </div>
                      )}

                      {/* Province */}
                      {addressParts.province && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">จังหวัด:</span>
                          <span className="text-sm text-gray-900">{addressParts.province}</span>
                        </div>
                      )}

                      {/* Postal Code */}
                      {addressParts.postal_code && (
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">รหัสไปรษณีย์:</span>
                          <span className="text-sm text-gray-900">{addressParts.postal_code}</span>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Fallback: Show original address string if parsing fails
                  return <p className="text-gray-900">{shop.address}</p>;
                }
              })()}

              {/* Phone Number */}
              {shop.phone_number && (
                <div className="flex items-start pt-3 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">เบอร์โทร:</span>
                  <a
                    href={`tel:${shop.phone_number}`}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    {shop.phone_number}
                  </a>
                </div>
              )}

              {/* Coordinates */}
              {shop.latitude && shop.longitude && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-start">
                      <span className="text-sm font-medium text-gray-600 w-28 flex-shrink-0">พิกัด:</span>
                      <div className="text-sm text-gray-900">
                        <div>Lat: {shop.latitude}</div>
                        <div>Long: {shop.longitude}</div>
                      </div>
                    </div>
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
                                className={`w-4 h-4 ${i < parseFloat(review.rating) ? 'text-yellow-400' : 'text-gray-300'
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

          {/* Data Consent Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">สถานะการยินยอมข้อมูล</h3>
            <div className="space-y-3">
              {shop.is_data_usage_consented ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-gray-700 font-medium">ลูกค้ากดยินยอม:</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium text-green-600">ยินยอม</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-gray-700 font-medium">ลูกค้ากดยินยอม:</span>
                  <div className="flex items-center space-x-2">
                    <XCircleIcon className="w-6 h-6 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">ไม่ยินยอม</span>
                  </div>
                </div>
              )}
              {shop.data_consent_at && (
                <p className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                  อัพเดทเมื่อ: {formatDate(shop.data_consent_at)}
                </p>
              )}
            </div>
          </div>


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
              {shop.openingHours && shop.openingHours.length > 0 ? (
                <>
                  {/* แสดงวันที่เปิด */}
                  {shop.openingHours
                    .filter(hour => hour.is_open)
                    .slice(0, 1)
                    .map((hour, index) => (
                      <React.Fragment key={index}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">เปิด:</span>
                          <span className="font-medium text-gray-900">
                            {hour.open_time?.substring(0, 5) || '-'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ปิด:</span>
                          <span className="font-medium text-gray-900">
                            {hour.close_time?.substring(0, 5) || '-'}
                          </span>
                        </div>
                      </React.Fragment>
                    ))
                  }
                  {/* แสดงจำนวนวันที่เปิด */}
                  <div className="pt-2 mt-2 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      เปิดทำการ {shop.openingHours.filter(h => h.is_open).length} วัน
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">เปิด:</span>
                    <span className="font-medium text-gray-900">{shop.open_time?.substring(0, 5) || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ปิด:</span>
                    <span className="font-medium text-gray-900">{shop.close_time?.substring(0, 5) || '-'}</span>
                  </div>
                </>
              )}
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