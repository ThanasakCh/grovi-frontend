import React from "react";
import { Search, Compass, Ruler, MapPin, Wrench } from "lucide-react";

const UserGuidePage: React.FC = () => {
  return (
    <>
      {/* Section: How to Use */}
      <section id="how-to-use" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              วิธีการใช้งาน
            </h2>
            <p className="text-gray-500 mt-2">
              ขั้นตอนการใช้งานระบบติดตามแปลงเกษตรแบบครบถ้วน
            </p>
          </div>

          {/* Steps from Screenshot */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-card border border-gray-100 relative group hover:-translate-y-1 transition-all">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-gray-50">
                1
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg mb-2 text-primary-900">
                  สร้างบัญชีผู้ใช้
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  คลิกที่ "เข้าสู่ระบบ" และกรอกข้อมูลเพื่อสร้างบัญชีใหม่
                  หรือเข้าสู่ระบบด้วยบัญชีที่มีอยู่
                </p>
              </div>
            </div>
            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-card border border-gray-100 relative group hover:-translate-y-1 transition-all">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-gray-50">
                2
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg mb-2 text-primary-900">
                  เข้าสู่ระบบ
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  หลังจากสร้างบัญชีแล้ว ให้เข้าสู่ระบบด้วยอีเมลและรหัสผ่าน
                  เพื่อเข้าถึงข้อมูลแปลงเกษตร
                </p>
              </div>
            </div>
            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-card border border-gray-100 relative group hover:-translate-y-1 transition-all">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary-900 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 border-gray-50">
                3
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-bold text-lg mb-2 text-primary-900">
                  เริ่มใช้งาน
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  ระบบจะนำคุณไปยังหน้าแผนที่
                  เพื่อเริ่มต้นการเพิ่มแปลงเกษตรและดูข้อมูลเชิงลึก
                </p>
              </div>
            </div>
          </div>

          {/* Tools Grid (From Screenshot) */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h3 className="text-xl font-bold text-primary-900 mb-8 flex items-center gap-2 border-b border-gray-100 pb-4">
              <Wrench className="w-5 h-5 text-gold-500" /> เครื่องมือบนแผนที่
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Zoom In/Out</h4>
                <p className="text-xs text-gray-500">
                  ย่อ/ขยายเพื่อดูรายละเอียด
                </p>
              </div>
              <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3 text-orange-600">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Compass</h4>
                <p className="text-xs text-gray-500">
                  ปรับทิศทางแผนที่ให้ตรงทิศเหนือ
                </p>
              </div>
              <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-600">
                  <Ruler className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Measure</h4>
                <p className="text-xs text-gray-500">วัดระยะทางและพื้นที่</p>
              </div>
              <div className="text-center p-4 hover:bg-gray-50 rounded-lg transition">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3 text-red-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">GPS</h4>
                <p className="text-xs text-gray-500">
                  ค้นหาตำแหน่งปัจจุบันของคุณ
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserGuidePage;
