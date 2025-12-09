import React, { useState } from "react";
import {
  BookOpen,
  Map as MapIcon,
  Plane,
  Wifi,
  BrainCircuit,
  ChevronDown,
} from "lucide-react";

// Import local images
import ndviImage from "../icon/ndvi.jpg";
import eviImage from "../icon/evi.png";
import gndviImage from "../icon/gndvi.png";
import ndwiImage from "../icon/ndwi.png";
import saviImage from "../icon/savi.png";
import vciImage from "../icon/vci.png";

interface ScaleRange {
  min: number;
  max: number;
  label: string;
  color: string;
  textColor: string;
}

interface AlgoData {
  title: string;
  desc: string;
  formula: React.ReactNode;
  credit?: string;
  image: string;
  ranges: ScaleRange[];
  minVal: number;
  maxVal: number;
}

const algoData: Record<string, AlgoData> = {
  NDVI: {
    title: "Normalized Difference Vegetation Index",
    desc: "ค่าดัชนีพืชพรรณความแตกต่าง เป็นตัวชี้วัดมาตรฐานที่ใช้ในการประเมินปริมาณและความสมบูรณ์ของพืชสีเขียว โดยคำนวณจากค่าการสะท้อนแสงในช่วงคลื่นสีแดง (Red) และอินฟราเรดใกล้ (NIR)",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>NDVI =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">NIR - Red</span>
          <span>NIR + Red</span>
        </div>
      </div>
    ),
    image: ndviImage,
    credit:
      "Understanding your Aerial Data: Normalized Difference Vegetation Index NDVI:geoawesome",
    ranges: [
      {
        min: -1,
        max: 0,
        label: "น้ำ / สิ่งปลูกสร้าง",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: 0,
        max: 0.2,
        label: "ดินว่างเปล่า",
        color: "bg-orange-500",
        textColor: "text-orange-400",
      },
      {
        min: 0.2,
        max: 0.5,
        label: "พืชพรรณน้อย",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 0.5,
        max: 1,
        label: "พืชสมบูรณ์",
        color: "bg-green-500",
        textColor: "text-green-400",
      },
    ],
    minVal: -1,
    maxVal: 1,
  },
  EVI: {
    title: "Enhanced Vegetation Index",
    desc: "ดัชนีพืชพรรณแบบปรับปรุง ออกแบบมาเพื่อลดอิทธิพลของชั้นบรรยากาศและพื้นดิน ช่วยให้วิเคราะห์พื้นที่ที่มีพืชพรรณหนาแน่นได้ดีกว่า NDVI โดยเพิ่มค่าการสะท้อนแสงสีน้ำเงิน (Blue) เข้ามาคำนวณ",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>EVI = 2.5 ×</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">NIR - Red</span>
          <span>NIR + 6(Red) - 7.5(Blue) + 1</span>
        </div>
      </div>
    ),
    image: eviImage,
    credit: "Generic EVI Representation",
    ranges: [
      {
        min: -1,
        max: 0.1,
        label: "ดิน / น้ำ",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: 0.1,
        max: 0.3,
        label: "เริ่มเติบโต",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 0.3,
        max: 1,
        label: "สมบูรณ์มาก",
        color: "bg-green-500",
        textColor: "text-green-400",
      },
    ],
    minVal: -1,
    maxVal: 1,
  },
  GNDVI: {
    title: "Green Normalized Difference Vegetation Index",
    desc: "ดัชนีพืชพรรณสีเขียว คล้ายกับ NDVI แต่ใช้ช่วงคลื่นสีเขียว (Green) แทนสีแดง มีความไวต่อปริมาณคลอโรฟิลล์มากกว่า เหมาะสำหรับการประเมินความสมบูรณ์ของพืชในระยะที่ต้องการปุ๋ยไนโตรเจน",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>GNDVI =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">
            NIR - Green
          </span>
          <span>NIR + Green</span>
        </div>
      </div>
    ),
    image: gndviImage,
    credit: "Unsplash",
    ranges: [
      {
        min: -1,
        max: 0.3,
        label: "เครียด / ขาดน้ำ",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: 0.3,
        max: 0.5,
        label: "ปกติ",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 0.5,
        max: 1,
        label: "สมบูรณ์ (Chlorophyll สูง)",
        color: "bg-green-500",
        textColor: "text-green-400",
      },
    ],
    minVal: -1,
    maxVal: 1,
  },
  NDWI: {
    title: "Normalized Difference Water Index",
    desc: "ดัชนีความแตกต่างของน้ำ ใช้สำหรับติดตามปริมาณความชื้นในพืชและแหล่งน้ำ ช่วยให้เกษตรกรสามารถบริหารจัดการน้ำในแปลงนาได้อย่างมีประสิทธิภาพและทันต่อสถานการณ์ภัยแล้ง",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>NDWI =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">
            Green - NIR
          </span>
          <span>Green + NIR</span>
        </div>
      </div>
    ),
    image: ndwiImage,
    credit: "Unsplash (McFeeters Method Representation)",
    ranges: [
      {
        min: -1,
        max: -0.3,
        label: "แห้งแล้ง",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: -0.3,
        max: 0,
        label: "ความชื้นต่ำ",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 0,
        max: 1,
        label: "ชุ่มชื้น / น้ำ",
        color: "bg-blue-500",
        textColor: "text-blue-400",
      },
    ],
    minVal: -1,
    maxVal: 1,
  },
  SAVI: {
    title: "Soil Adjusted Vegetation Index",
    desc: "ดัชนีพืชพรรณที่ปรับแก้ผลกระทบจากดิน เหมาะสำหรับพื้นที่ที่มีพืชปกคลุมน้อยหรือระยะเริ่มปลูก ซึ่งค่าการสะท้อนของดินอาจรบกวนค่าดัชนีพืชพรรณปกติ (NDVI) ได้",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>SAVI =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">NIR - Red</span>
          <span>NIR + Red + L</span>
        </div>
        <span>× (1 + L)</span>
      </div>
    ),
    image: saviImage,
    credit: "Unsplash",
    ranges: [
      {
        min: -1,
        max: 0.2,
        label: "ดิน",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: 0.2,
        max: 0.4,
        label: "พืชปกคลุมน้อย",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 0.4,
        max: 1,
        label: "พืชปกคลุมหนาแน่น",
        color: "bg-green-500",
        textColor: "text-green-400",
      },
    ],
    minVal: -1,
    maxVal: 1,
  },
  VCI: {
    title: "Vegetation Condition Index",
    desc: "ดัชนีสภาพพืชพรรณ ใช้เปรียบเทียบค่า NDVI ปัจจุบันกับค่าสูงสุดและต่ำสุดในอดีตของช่วงเวลาเดียวกัน เพื่อประเมินความรุนแรงของภัยแล้งและผลกระทบต่อผลผลิตทางการเกษตร",
    formula: (
      <div className="flex items-center gap-2 text-lg font-mono">
        <span>VCI =</span>
        <div className="flex flex-col items-center">
          <span className="border-b border-slate-400 pb-1 mb-1">
            NDVI - NDVIₘᵢₙ
          </span>
          <span>NDVIₘₐₓ - NDVIₘᵢₙ</span>
        </div>
        <span>× 100</span>
      </div>
    ),
    image: vciImage,
    credit: "Unsplash",
    ranges: [
      {
        min: 0,
        max: 40,
        label: "ภัยแล้งรุนแรง",
        color: "bg-red-500",
        textColor: "text-red-400",
      },
      {
        min: 40,
        max: 60,
        label: "ปกติ",
        color: "bg-yellow-400",
        textColor: "text-yellow-400",
      },
      {
        min: 60,
        max: 100,
        label: "สมบูรณ์ดี",
        color: "bg-green-500",
        textColor: "text-green-400",
      },
    ],
    minVal: 0,
    maxVal: 100,
  },
};

const ResearchPage: React.FC = () => {
  const [selectedAlgo, setSelectedAlgo] = useState<string>("NDVI");

  const changeAlgorithm = (algo: string) => {
    setSelectedAlgo(algo);
  };

  const currentAlgo = algoData[selectedAlgo];

  return (
    <>
      {/* Section: Technology Detail */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/2">
              {/* Algorithm Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(algoData).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => changeAlgorithm(algo)}
                    className={`px-4 py-1.5 rounded text-xs font-bold font-mono transition ${
                      selectedAlgo === algo
                        ? "bg-blue-500 text-white border border-blue-400"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>

              <h2
                id="tech-title"
                className="text-3xl lg:text-4xl font-display font-bold mb-6"
              >
                {currentAlgo.title}
              </h2>
              <p
                id="tech-desc"
                className="text-slate-400 mb-8 leading-relaxed font-light text-lg"
              >
                {currentAlgo.desc}
              </p>

              <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl">
                <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">
                  Scale Reference
                </h4>

                {/* Dynamic Scale Bar */}
                <div className="h-4 w-full rounded-full flex overflow-hidden mb-2 relative bg-slate-700">
                  {currentAlgo.ranges?.map((range, index) => {
                    // Calculate width percentage relative to total range
                    const totalRange = currentAlgo.maxVal - currentAlgo.minVal;
                    const rangeWidth = range.max - range.min;
                    const widthPercent = (rangeWidth / totalRange) * 100;
                    return (
                      <div
                        key={index}
                        className={`${range.color}`}
                        style={{ width: `${widthPercent}%` }}
                        title={range.label}
                      ></div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>{currentAlgo.minVal}</span>
                  <span>{(currentAlgo.minVal + currentAlgo.maxVal) / 2}</span>
                  <span>{currentAlgo.maxVal}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {currentAlgo.ranges?.map((range, index) => (
                    <div
                      key={index}
                      className={`border-l-2 pl-3 ${range.color.replace(
                        "bg-",
                        "border-"
                      )}`}
                    >
                      <span
                        className={`block font-bold text-sm ${range.textColor}`}
                      >
                        {range.min} ถึง {range.max}
                      </span>
                      <span className="text-xs text-slate-400">
                        {range.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="flex flex-col gap-6">
                <div className="relative rounded-lg overflow-hidden border border-slate-700 shadow-2xl bg-slate-800">
                  <img
                    src={currentAlgo.image}
                    className="w-full h-[400px] object-cover transition-all duration-500"
                    alt={`${selectedAlgo} Index Visualization`}
                  />

                  {/* Credit Overlay (optional bottom right) */}
                  {currentAlgo.credit && (
                    <div className="absolute bottom-0 right-0 bg-black/50 backdrop-blur-sm px-2 py-1 text-[10px] text-slate-300">
                      {currentAlgo.credit}
                    </div>
                  )}
                </div>

                {/* Formula Section */}
                <div className="bg-slate-800/80 border border-slate-700 p-6 rounded-xl backdrop-blur-sm">
                  <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                    <BrainCircuit className="w-5 h-5" /> Algorithm Formula
                  </h3>
                  <div className="flex justify-center items-center py-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    {currentAlgo.formula}
                  </div>
                  {currentAlgo.credit && (
                    <p className="mt-4 text-xs text-slate-500 text-right">
                      Source: {currentAlgo.credit}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Tech Stack */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center font-display font-bold text-2xl mb-12 text-primary-900">
            Technology Stack
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Frontend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <h4 className="font-bold text-primary-900 mb-4 border-b border-gray-100 pb-2">
                Frontend
              </h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  React.js
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  TypeScript
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Leaflet.js
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Vite
                </span>
              </div>
            </div>
            {/* Backend */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <h4 className="font-bold text-primary-900 mb-4 border-b border-gray-100 pb-2">
                Backend
              </h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Python
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  FastAPI
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  PostgreSQL
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  SQLAlchemy
                </span>
              </div>
            </div>
            {/* Analysis */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <h4 className="font-bold text-primary-900 mb-4 border-b border-gray-100 pb-2">
                Analysis
              </h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Google Earth Engine
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  NumPy / Pandas
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Rasterio
                </span>
              </div>
            </div>
            {/* Data */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
              <h4 className="font-bold text-primary-900 mb-4 border-b border-gray-100 pb-2">
                Data Mgmt
              </h4>
              <div className="space-y-2">
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Alembic
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Redis
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  MinIO
                </span>
                <span className="block text-sm text-gray-600 bg-gray-50 py-1 rounded">
                  Celery
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Published Papers & Future Roadmap */}
      <section id="research" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Published Papers */}
            <div>
              <h3 className="font-display font-bold text-2xl mb-8 text-primary-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> งานวิจัยที่เกี่ยวข้อง
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 transition">
                  <h4 className="font-bold text-gray-900">
                    "การประยุกต์ใช้ดัชนีพืชพรรณในการติดตามสุขภาพข้าว"
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    วารสารการเกษตรและเทคโนโลยี, 2566
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 transition">
                  <h4 className="font-bold text-gray-900">
                    "ระบบติดตามแปลงเกษตรแบบเรียลไทม์ด้วยภาพดาวเทียม"
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    การประชุมวิชาการเทคโนโลยีการเกษตร, 2566
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary-500 hover:bg-gray-100 transition">
                  <h4 className="font-bold text-gray-900">
                    "การวิเคราะห์แนวโน้มผลผลิตข้าวด้วยข้อมูลดาวเทียม"
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">
                    วารสารวิทยาศาสตร์และเทคโนโลยี, 2565
                  </p>
                </div>
              </div>
            </div>

            {/* Future Roadmap */}
            <div>
              <h3 className="font-display font-bold text-2xl mb-8 text-primary-900 flex items-center gap-2">
                <MapIcon className="w-6 h-6" /> ทิศทางการวิจัยในอนาคต
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      โดรนเกษตรกรรม (UAV)
                    </h4>
                    <p className="text-sm text-gray-600">
                      การสำรวจแปลงเกษตรความละเอียดสูงด้วยโดรน
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      เซ็นเซอร์ IoT (Ground Truth)
                    </h4>
                    <p className="text-sm text-gray-600">
                      ติดตั้งเซ็นเซอร์วัดความชื้นและอุณหภูมิในแปลงจริง
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 shrink-0">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Advanced AI</h4>
                    <p className="text-sm text-gray-600">
                      โมเดลทำนายโรคพืชและแนะนำการใส่ปุ๋ยอัตโนมัติ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-12">
            คำถามที่พบบ่อย (FAQ)
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary-200 transition">
              <h4 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                ระบบนี้ใช้งานฟรีหรือไม่?{" "}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-600">
                ระบบใช้งานนี้เป็นระบบฟรี ไม่มีค่าใช้จ่าย
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary-200 transition">
              <h4 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                ข้อมูลดาวเทียมอัปเดตบ่อยแค่ไหน?{" "}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-600">
                ข้อมูลดาวเทียมจะอัปเดตทุก 5 วัน ตามรอบวงโคจรของดาวเทียม
                Sentinel-2
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary-200 transition">
              <h4 className="font-bold text-gray-900 mb-2 flex justify-between items-center">
                สามารถใช้งานบนมือถือได้หรือไม่?{" "}
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <p className="text-sm text-gray-600">
                ระบบรองรับการใช้งานบนอุปกรณ์มือถือและแท็บเล็ตทุกขนาด (Responsive
                Design)
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResearchPage;
