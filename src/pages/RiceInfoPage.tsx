import React, { useState } from "react";
import {
  Satellite,
  Leaf,
  Map as MapIcon,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Rice Data Collection
interface RiceVariety {
  name: string;
  category: string;
  tag: string;
  desc: string;
  harvestAge: string;
  yield: string;
  theme: "gold" | "primary" | "secondary";
}

const RICE_VARITIES: RiceVariety[] = [
  {
    name: "ข้าวหอมมะลิ 105 (KDML105)",
    category: "Premium Rice",
    tag: "PREMIUM",
    desc: "เมล็ดยาว หอม นุ่ม มีกลิ่นหอมธรรมชาติ เป็นเอกลักษณ์ของภาคอีสานและไทย",
    harvestAge: "120-130 วัน",
    yield: "360-450 กก./ไร่",
    theme: "gold",
  },
  {
    name: "ข้าวหอมนิล",
    category: "Premium Rice",
    tag: "PREMIUM",
    desc: "ข้าวหอมพันธุ์พื้นเมือง สีดำม่วง อุดมด้วยสารต้านอนุมูลอิสระ มีคุณค่าทางโภชนาการสูง",
    harvestAge: "100-110 วัน",
    yield: "400-500 กก./ไร่",
    theme: "gold",
  },
  {
    name: "ข้าวเจ้าหอมคลองหลวง 1",
    category: "Premium Rice",
    tag: "PREMIUM",
    desc: "ข้าวเจ้าหอมไม่ไวต่อช่วงแสง คุณภาพเมล็ดดี หอมเหมือนหอมมะลิ ต้านทานโรคขอบใบแห้ง",
    harvestAge: "100-110 วัน",
    yield: "600-700 กก./ไร่",
    theme: "gold",
  },
  {
    name: "ข้าวเจ้าหอมสุพรรณบุรี",
    category: "Premium Rice",
    tag: "PREMIUM",
    desc: "ข้าวเจ้าหอมพื้นนุ่ม เมล็ดเรียวยาว ไม่ไวต่อช่วงแสง ปลูกได้ตลอดปี",
    harvestAge: "115-120 วัน",
    yield: "600-700 กก./ไร่",
    theme: "gold",
  },

  {
    name: "ปทุมธานี 1",
    category: "High Yield",
    tag: "HIGH YIELD",
    desc: "เมล็ดสั้น ทนน้ำท่วมฉับพลัน ให้ผลผลิตสูง หุงต้มแล้วนุ่มคล้ายหอมมะลิ",
    harvestAge: "110-120 วัน",
    yield: "650-800 กก./ไร่",
    theme: "primary",
  },
  {
    name: "สุพรรณบุรี 1, 2, 60, 90",
    category: "High Yield",
    tag: "HIGH YIELD",
    desc: "ตระกูลข้าวสุพรรณบุรี ให้ผลผลิตสูง ต้านทานเพลี้ยกระโดดสีน้ำตาลและโรคไหม้",
    harvestAge: "105-120 วัน",
    yield: "750-900 กก./ไร่",
    theme: "primary",
  },
  {
    name: "ชัยนาท 1, 2",
    category: "High Yield",
    tag: "HIGH YIELD",
    desc: "ข้าวเจ้าพันธุ์ไม่ไวต่อช่วงแสง ตอบสนองต่อปุ๋ยดีมาก ผลผลิตสูงมาก",
    harvestAge: "110-120 วัน",
    yield: "800-1000 กก./ไร่",
    theme: "primary",
  },
  {
    name: "พิษณุโลก 2, 60-2",
    category: "High Yield",
    tag: "HIGH YIELD",
    desc: "ข้าวเจ้าเมล็ดยาวเรียว คุณภาพการสีดี ทนทานต่อสภาพแวดล้อม",
    harvestAge: "115-120 วัน",
    yield: "700-800 กก./ไร่",
    theme: "primary",
  },
  {
    name: "ตระกูล กข (1-25)",
    category: "High Yield",
    tag: "CERTIFIED",
    desc: "พันธุ์รับรองกรมการข้าว (กข 10, 21, 23 ฯลฯ) หลากหลายสายพันธุ์ ปรับตัวได้ดีในพื้นที่ชลประทาน",
    harvestAge: "100-130 วัน",
    yield: "600-800 กก./ไร่",
    theme: "primary",
  },

  {
    name: "ข้าวเจ๊กเชยเสาไห้",
    category: "Special Quality",
    tag: "QUALITY",
    desc: "ข้าวเสาไห้สระบุรี หุงขึ้นหม้อ ร่วน ไม่แฉะ ไม่บูดง่าย แปรรูปเป็นผลิตภัณฑ์เส้นได้ดีเยี่ยม",
    harvestAge: "120 วัน",
    yield: "450-500 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "ข้าวขาวตาแห้ง",
    category: "Special Quality",
    tag: "QUALITY",
    desc: "ข้าวเจ้าพันธุ์พื้นเมืองภาคกลางและเหนือตอนล่าง เมล็ดแกร่ง สีสวย เป็นที่นิยมของโรงสี",
    harvestAge: "120-130 วัน",
    yield: "450-550 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "กข 19",
    category: "Special Quality",
    tag: "QUALITY",
    desc: "ข้าวเจ้าพันธุ์รับรอง ต้านทานโรคและแมลงศัตรูพืชได้ดีในระดับหนึ่ง",
    harvestAge: "120 วัน",
    yield: "500-600 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "หันตรา 60 / ปราจีนบุรี",
    category: "Special Quality",
    tag: "DEEP WATER",
    desc: "ข้าวขึ้นน้ำและข้าวน้ำลึก ทนทานต่อสภาพน้ำท่วมขังเป็นเวลานาน ปลูกในที่ลุ่ม",
    harvestAge: "140-150 วัน",
    yield: "400-500 กก./ไร่",
    theme: "secondary",
  },

  {
    name: "กข 6 (RD6)",
    category: "Sticky Rice",
    tag: "STICKY RICE",
    desc: "ข้าวเหนียวที่ได้รับการปรับปรุงพันธุ์จากหอมมะลิ 105 เมล็ดเรียวยาว หอม นุ่ม นิยมมากที่สุดในอีสาน",
    harvestAge: "120-130 วัน",
    yield: "450-500 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "ข้าวเหนียวเขาวงกาฬสินธุ์",
    category: "Sticky Rice",
    tag: "GI STAR",
    desc: "ข้าวสิ่งบ่งชี้ภูมิศาสตร์ (GI) จังหวัดกาฬสินธุ์ นุ่มนาน หอม เมล็ดสวย",
    harvestAge: "120-130 วัน",
    yield: "450 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "ข้าวพญาลืมแกง",
    category: "Sticky Rice",
    tag: "TRADITIONAL",
    desc: "ข้าวเหนียวไร่พันธุ์พื้นเมืองเพชรบูรณ์ หอม นุ่ม จนได้ชื่อว่าอร่อยจนลืมแกง",
    harvestAge: "120-130 วัน",
    yield: "350-400 กก./ไร่",
    theme: "secondary",
  },
  {
    name: "สันป่าตอง 1",
    category: "Sticky Rice",
    tag: "STICKY RICE",
    desc: "ข้าวเหนียวไม่ไวต่อช่วงแสง ปลูกได้ตลอดปี ผลผลิตสูง เมล็ดสวย เหมาะทำข้าวเหนียวมูน",
    harvestAge: "130-135 วัน",
    yield: "600-700 กก./ไร่",
    theme: "secondary",
  },

  {
    name: "ข้าวมันปู / สังข์หยด",
    category: "Health",
    tag: "HEALTH",
    desc: "ข้าวกล้องสีแดง มีกากใยสูง วิตามินอีสูง ช่วยเรื่องระบบขับถ่ายและชะลอวัย",
    harvestAge: "110-120 วัน",
    yield: "400 กก./ไร่",
    theme: "gold",
  },
  {
    name: "ข้าวกล้อง / ซ้อมมือ",
    category: "Health",
    tag: "HEALTH",
    desc: "ข้าวที่กะเทาะเปลือกออกเพียงบางส่วน คงคุณค่าสารอาหาร วิตามินบีสูง",
    harvestAge: "ไม่ระบุ",
    yield: "ขึ้นอยู่กับพันธุ์",
    theme: "gold",
  },
  {
    name: "พันธุ์ท้องถิ่นอื่นๆ",
    category: "Others",
    tag: "LOCAL",
    desc: "พันธุ์สกลนคร, สุรินทร์ 1, เล็บมือนาง 111, ปิ่นแก้ว 56, นางฉลอง (พันธุ์พื้นเมืองเฉพาะถิ่น)",
    harvestAge: "120-150 วัน",
    yield: "350-450 กก./ไร่",
    theme: "primary",
  },
];

const RiceInfoPage: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);

  const nextSlide = () => {
    setStartIndex((prev) => (prev + 3) % RICE_VARITIES.length);
  };

  const prevSlide = () => {
    setStartIndex(
      (prev) => (prev - 3 + RICE_VARITIES.length) % RICE_VARITIES.length
    );
  };

  const currentItems = [
    RICE_VARITIES[startIndex % RICE_VARITIES.length],
    RICE_VARITIES[(startIndex + 1) % RICE_VARITIES.length],
    RICE_VARITIES[(startIndex + 2) % RICE_VARITIES.length],
  ];

  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case "gold":
        return {
          card: "border-t-gold-500",
          tag: "bg-gold-100 text-gold-700",
          title: "text-gray-900",
        };
      case "primary":
        return {
          card: "border-t-primary-500",
          tag: "bg-primary-100 text-primary-700",
          title: "text-gray-900",
        };
      case "secondary":
        return {
          card: "border-t-secondary-500",
          tag: "bg-secondary-100 text-secondary-700",
          title: "text-gray-900",
        };
      default:
        return {
          card: "border-t-gray-500",
          tag: "bg-gray-100 text-gray-700",
          title: "text-gray-900",
        };
    }
  };

  return (
    <>
      {/* Section: Core Technology */}
      <section
        id="technology"
        className="py-20 bg-white border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div className="md:w-1/2 relative">
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
                  className="rounded-lg shadow-lg w-full h-64 object-cover transform translate-y-4"
                  alt="Technology 1"
                />
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
                  className="rounded-lg shadow-lg w-full h-64 object-cover transform -translate-y-4"
                  alt="Technology 2"
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-xl rounded-xl text-center border border-gray-100 min-w-[200px]">
                <p className="text-3xl font-bold text-primary-900 font-display">
                  3
                </p>
                <p className="text-sm text-gray-500">เทคโนโลยีหลัก</p>
              </div>
            </div>
            <div className="md:w-1/2">
              <h4 className="text-secondary-600 font-bold tracking-wide uppercase text-sm mb-2">
                Core Technology
              </h4>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
                เทคโนโลยีเบื้องหลัง
                <br />
                ความแม่นยำระดับสูง
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                ระบบของเราผสานเทคโนโลยีอวกาศเข้ากับเว็บแอปพลิเคชันสำหรับติดตามสุขภาพพืช
                เพื่อสามารถติดตามการเจริญเติบโตของข้าวได้อย่างต่อเนื่อง
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition hover:border-primary-200 hover:shadow-sm">
                  <div className="bg-blue-100 p-2 rounded-full text-blue-700 mt-1">
                    <Satellite className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Remote Sensing</h4>
                    <p className="text-sm text-gray-500">
                      ใช้ภาพดาวเทียม Landsat 8/9, Sentinel-2 และ MODIS
                      เพื่อติดตามสภาพแวดล้อม
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition hover:border-primary-200 hover:shadow-sm">
                  <div className="bg-green-100 p-2 rounded-full text-green-700 mt-1">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Vegetation Indices
                    </h4>
                    <p className="text-sm text-gray-500">
                      วิเคราะห์ดัชนี NDVI, EVI, SAVI
                      เพื่อบ่งบอกสุขภาพและความหนาแน่นของพืช
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition hover:border-primary-200 hover:shadow-sm">
                  <div className="bg-purple-100 p-2 rounded-full text-purple-700 mt-1">
                    <MapIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      GIS & Geoinformatics
                    </h4>
                    <p className="text-sm text-gray-500">
                      จัดการข้อมูลเชิงพื้นที่ด้วย QGIS/ArcGIS
                      และภูมิสารสนเทศในการจัดการข้อมูลพืช
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Varieties (UPDATED) */}
      <section id="varieties" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                ฐานข้อมูลพันธุ์ข้าวเศรษฐกิจ
              </h2>
              <p className="text-gray-500 mt-2">
                รายละเอียดและคุณลักษณะเฉพาะของสายพันธุ์สำคัญ (ทั้งหมด{" "}
                {RICE_VARITIES.length} สายพันธุ์)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="hidden md:flex flex-none w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100 hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 group z-10"
              title="ก่อนหน้า"
            >
              <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </button>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
              {currentItems.map((rice, index) => {
                const styles = getThemeClasses(rice.theme);
                return (
                  <div
                    key={`${rice.name}-${index}`}
                    className={`bg-white rounded-t-lg rounded-b-xl border-t-4 ${styles.card} border-x border-b border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 group h-full flex flex-col`}
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3
                          className={`text-xl font-bold font-display ${styles.title}`}
                        >
                          {rice.name}
                        </h3>
                        <span
                          className={`${styles.tag} text-[10px] px-2 py-1 rounded font-bold uppercase whitespace-nowrap ml-2`}
                        >
                          {rice.tag}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-6 flex-grow">
                        {rice.desc}
                      </p>

                      <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg border border-gray-100 mt-auto">
                        <div className="flex justify-between">
                          <span className="text-gray-500">อายุเก็บเกี่ยว</span>
                          <span className="font-semibold text-gray-900">
                            {rice.harvestAge}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">ผลผลิตเฉลี่ย</span>
                          <span className="font-semibold text-gray-900">
                            {rice.yield}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="hidden md:flex flex-none w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg border border-gray-100 hover:bg-gray-50 hover:shadow-xl transition-all active:scale-95 group z-10"
              title="ถัดไป"
            >
              <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-600 transition-colors" />
            </button>
          </div>

          {/* Mobile Navigation (Visible only on mobile) */}
          <div className="flex justify-center mt-8 md:hidden">
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md border border-gray-200 text-gray-900 font-medium active:bg-gray-50"
            >
              ดูสายพันธุ์ถัดไป <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Section: Growth Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-gray-900">
              วงจรการเจริญเติบโต (Growth Cycle)
            </h2>
            <p className="text-gray-500 mt-2">
              ค่าดัชนีพืชพรรณ (NDVI) มาตรฐานสำหรับประเมินแต่ละระยะ
            </p>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 hidden md:block z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center group hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-white border-4 border-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-sm">
                  <span className="font-bold text-secondary-700">1</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900">ระยะงอก</h4>
                <p className="text-xs text-gray-400 mb-2">0-15 วัน</p>
                <p className="text-sm text-gray-600 mb-4 h-10">
                  เมล็ดเริ่มงอก รากและใบเลี้ยงปรากฏ
                </p>
                <div className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded text-xs font-mono font-medium border border-gray-200">
                  NDVI: 0.1 - 0.3
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center group hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-secondary-500 border-4 border-white shadow-md rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 text-white">
                  <span className="font-bold">2</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900">ระยะแตกกอ</h4>
                <p className="text-xs text-gray-400 mb-2">15-45 วัน</p>
                <p className="text-sm text-gray-600 mb-4 h-10">
                  ลำต้นขยาย การสังเคราะห์แสงเพิ่มขึ้น
                </p>
                <div className="inline-block bg-secondary-50 text-secondary-700 px-3 py-1 rounded text-xs font-mono font-medium border border-secondary-100">
                  NDVI: 0.3 - 0.6
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center group hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-secondary-600 border-4 border-white shadow-md rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 text-white">
                  <span className="font-bold">3</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900">
                  ระยะตั้งท้อง
                </h4>
                <p className="text-xs text-gray-400 mb-2">45-75 วัน</p>
                <p className="text-sm text-gray-600 mb-4 h-10">
                  ความหนาแน่นใบสูงสุด สะสมอาหาร
                </p>
                <div className="inline-block bg-secondary-100 text-secondary-800 px-3 py-1 rounded text-xs font-mono font-medium border border-secondary-200">
                  NDVI: 0.6 - 0.8
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center group hover:-translate-y-1 transition duration-300">
                <div className="w-12 h-12 bg-gold-500 border-4 border-white shadow-md rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 text-white">
                  <span className="font-bold">4</span>
                </div>
                <h4 className="font-bold text-lg text-gray-900">
                  ระยะเก็บเกี่ยว
                </h4>
                <p className="text-xs text-gray-400 mb-2">90-120 วัน</p>
                <p className="text-sm text-gray-600 mb-4 h-10">
                  รวงเหลืองพร้อมเก็บ ความชื้นลดลง
                </p>
                <div className="inline-block bg-gold-50 text-gold-700 px-3 py-1 rounded text-xs font-mono font-medium border border-gold-100">
                  NDVI: 0.4 - 0.6
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RiceInfoPage;
