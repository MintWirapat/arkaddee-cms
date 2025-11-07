import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  CurrencyDollarIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const ShopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch shop data
    const fetchShop = async () => {
      setLoading(true);
      
      setTimeout(() => {
        const mockShops = [
          {
            id: 1,
            name: "คาเฟ่ในสวนใบไม้",
            description: "คาเฟ่บรรยากาศธรรมชาติ ให้บริการเครื่องดื่มและของหวานโฮมเมด พร้อมมุมถ่ายรูปสวยๆ",
            price_range: "฿฿",
            open_time: "08:00",
            close_time: "18:00",
            category: "คาเฟ่",
            subcategory: "กาแฟ & เบเกอรี่",
            location: {
              latitude: 13.7563,
              longitude: 100.5018
            },
            address: {
              house_number: "123/4",
              village: "5",
              soi: "สุขุมวิท 50",
              province: "กรุงเทพมหานคร",
              district: "คลองเตย",
              subdistrict: "พระโขนง",
              postal_code: "10110"
            },
            phone: "0812345678",
            images: [
              "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
              "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            ],
            has_air_purifier: true,
            has_fresh_air_system: false,
            status: "published"
          }
        ];

        const foundShop = mockShops.find(s => s.id === parseInt(id));
        setShop(foundShop);
        setLoading(false);
      }, 500);
    };

    fetchShop();
  }, [id]);

  const handleDelete = () => {
    if (window.confirm('คุณต้องการลบร้านค้านี้หรือไม่?')) {
      console.log('Deleting shop:', id);
      alert('ลบร้านค้าสำเร็จ');
      navigate('/shops');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">ไม่พบข้อมูลร้านค้า</h2>
        <button
          onClick={() => navigate('/shops')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const config = {
      published: { label: 'เผยแพร่แล้ว', className: 'bg-green-100 text-green-800' },
      pending: { label: 'รออนุมัติ', className: 'bg-amber-100 text-amber-800' },
      rejected: { label: 'ปฏิเสธ', className: 'bg-red-100 text-red-800' }
    };
    const { label, className } = config[status] || config.pending;
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${className}`}>{label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
          <p className="text-sm text-gray-600 mt-1">รายละเอียดร้านค้า</p>
        </div>
        <div className="flex space-x-3">
          <Link
            to={`/shops/${id}/edit`}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <PencilIcon className="w-4 h-4" />
            <span>แก้ไข</span>
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            <span>ลบ</span>
          </button>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          {shop.images.map((image, index) => (
            <div key={index} className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={image} 
                alt={`${shop.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลทั่วไป</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">รายละเอียด</label>
                <p className="mt-1 text-gray-900">{shop.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">หมวดหมู่</label>
                  <p className="mt-1 text-gray-900">{shop.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">ประเภท</label>
                  <p className="mt-1 text-gray-900">{shop.subcategory}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                    ช่วงราคา
                  </label>
                  <p className="mt-1 text-gray-900 font-medium">{shop.price_range}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    เวลาเปิด
                  </label>
                  <p className="mt-1 text-gray-900">{shop.open_time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    เวลาปิด
                  </label>
                  <p className="mt-1 text-gray-900">{shop.close_time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-indigo-600" />
              ที่อยู่
            </h3>
            <div className="space-y-2">
              <p className="text-gray-900">
                {shop.address.house_number} 
                {shop.address.village && ` หมู่ ${shop.address.village}`}
                {shop.address.soi && ` ซอย${shop.address.soi}`}
              </p>
              <p className="text-gray-900">
                {shop.address.subdistrict} {shop.address.district}
              </p>
              <p className="text-gray-900">
                {shop.address.province} {shop.address.postal_code}
              </p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <PhoneIcon className="w-4 h-4 inline mr-2" />
                  {shop.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">สถานะ</h3>
            {getStatusBadge(shop.status)}
          </div>

          {/* Equipment */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">อุปกรณ์</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                {shop.has_air_purifier ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <span className={shop.has_air_purifier ? 'text-gray-900' : 'text-gray-400'}>
                  เครื่องฟอกอากาศ
                </span>
              </div>
              <div className="flex items-center">
                {shop.has_fresh_air_system ? (
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                )}
                <span className={shop.has_fresh_air_system ? 'text-gray-900' : 'text-gray-400'}>
                  เครื่องเติมอากาศใหม่
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">พิกัดที่ตั้ง</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p>Lat: {shop.location.latitude}</p>
              <p>Long: {shop.location.longitude}</p>
            </div>
            <a
              href={`https://www.google.com/maps?q=${shop.location.latitude},${shop.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              เปิดใน Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailPage;
