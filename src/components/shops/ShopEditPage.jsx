import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ShopRegistrationForm from './ShopRegistrationForm';

const ShopEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch shop data by ID
    const fetchShopData = async () => {
      setLoading(true);
      
      // Simulate API call - replace with real API
      setTimeout(() => {
        // Mock data - ในการใช้งานจริงให้ดึงจาก API
        const mockShops = [
          {
            id: 1,
            name: "คาเฟ่ในสวนใบไม้",
            description: "คาเฟ่บรรยากาศธรรมชาติ ให้บริการเครื่องดื่มและของหวานโฮมเมด",
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
            has_fresh_air_system: false
          },
          {
            id: 2,
            name: "หอมหมูกระทะ",
            description: "ร้านหมูกระทะบรรยากาศอบอุ่น เหมาะสำหรับครอบครัว",
            price_range: "฿฿",
            open_time: "16:00",
            close_time: "23:00",
            category: "ร้านอาหาร",
            subcategory: "ปิ้งย่าง & หมูกระทะ",
            location: {
              latitude: 18.7883,
              longitude: 98.9853
            },
            address: {
              house_number: "45",
              village: "2",
              soi: "",
              province: "เชียงใหม่",
              district: "เมืองเชียงใหม่",
              subdistrict: "ศรีภูมิ",
              postal_code: "50200"
            },
            phone: "0899999999",
            images: [
              "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
            ],
            has_air_purifier: false,
            has_fresh_air_system: true
          }
        ];

        const shop = mockShops.find(s => s.id === parseInt(id));
        setShopData(shop);
        setLoading(false);
      }, 500);
    };

    fetchShopData();
  }, [id]);

  const handleSubmit = async (data) => {
    console.log('Updating shop:', id, data);
    
    // Simulate API call
    setTimeout(() => {
      alert('✅ แก้ไขข้อมูลร้านค้าสำเร็จ!');
      navigate('/shops');
    }, 1000);
  };

  const handleCancel = () => {
    navigate('/shops');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">ไม่พบข้อมูลร้านค้า</h2>
        <p className="text-gray-600 mt-2">ไม่พบร้านค้าที่ต้องการแก้ไข</p>
        <button
          onClick={() => navigate('/shops')}
          className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">แก้ไขข้อมูลร้านค้า</h1>
        <p className="text-sm text-gray-600 mt-1">
          แก้ไขข้อมูลร้านค้า: {shopData.name}
        </p>
      </div>

      <ShopRegistrationForm 
        initialData={shopData}
        onSubmit={handleSubmit} 
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ShopEditPage;
