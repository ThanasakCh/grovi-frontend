import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Activity,
  Target,
  TrendingUp,
  Coins,
  Rocket,
  PlayCircle,
  CheckCircle,
  Database,
  Layers,
  LayoutDashboard,
} from "lucide-react";
import dashboardBg from "../assets/images/vi_NDVI_20251206_110327_babd1e9b2b504dd2b29b6a37f05c452e.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [currentLayer, setCurrentLayer] = useState<"satellite" | "osm">(
    "satellite"
  );

  const handleStartClick = () => {
    if (isAuthenticated) {
      navigate("/map");
    } else {
      navigate("/auth");
    }
  };

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      });

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
        }
      );

      satelliteLayer.addTo(map);

      // Define bounds for the image overlay
      // Using coordinates that approximate the original polygon area
      const imageBounds: L.LatLngBoundsExpression = [
        [18.862886, 99.128512], // South-West
        [18.864144, 99.130293], // North-East
      ];

      // NDVI Image overlay
      L.imageOverlay(dashboardBg, imageBounds, {
        opacity: 0.9,
        interactive: true,
      }).addTo(map);

      map.fitBounds(imageBounds, {
        paddingTopLeft: [20, 20],
        paddingBottomRight: [320, 200],
        maxZoom: 18,
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const toggleMapLayer = () => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    if (currentLayer === "satellite") {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      setCurrentLayer("osm");
    } else {
      map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          maxZoom: 18,
        }
      ).addTo(map);
      setCurrentLayer("satellite");
    }
  };

  return (
    <>
      {/* Hero Section: Dashboard Interface Style */}
      <section
        id="dashboard"
        className="pt-8 pb-12 lg:pt-12 lg:pb-20 bg-white relative overflow-hidden"
      >
        {/* Background Map Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] z-0 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 items-center overflow-hidden">
            {/* Text Content */}
            <div className="lg:w-5/12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-blue-100 bg-blue-50 text-primary-700 text-xs font-bold uppercase mb-6">
                <Database className="w-3 h-3" />
                Cropmonitoring
              </div>
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
                ระบบติดตามและประเมิน
                <br />
                <span className="text-primary-700">
                  พื้นที่ปลูกข้าวด้วยดาวเทียม
                </span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 font-light leading-relaxed">
                แพลตฟอร์มบูรณาการข้อมูล Geo-Informatics
                เพื่อการบริหารจัดการแปลงเกษตรแม่นยำ วิเคราะห์สุขภาพพืช
                และติดตามสุขภาพพืชผ่านเว็บแอปพลิเคชัน
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleStartClick}
                  className="bg-primary-600 text-white px-8 py-3.5 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/30 font-display font-bold text-lg flex items-center gap-2 group"
                >
                  <Rocket className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                  เริ่มต้นใช้งานฟรี
                </button>
                <button className="bg-white text-primary-900 border border-gray-200 px-6 py-3.5 rounded-xl hover:bg-gray-50 transition font-display font-medium shadow-sm flex items-center gap-2">
                  <PlayCircle className="w-5 h-5 text-gray-400" /> ดูวิดีโอแนะนำ
                </button>
              </div>

              <div className="mt-8 flex gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary-600" />{" "}
                  Sentinel-2 Data
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-secondary-600" /> Update
                  ทุก 5 วัน
                </div>
              </div>
            </div>

            {/* Visual Interface (Mockup) */}
            <div className="lg:w-7/12 relative">
              {/* Main Dashboard Card */}
              <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden relative z-20">
                {/* Top Bar */}
                <div className="bg-primary-900 text-white px-4 py-3 flex justify-between items-center">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <LayoutDashboard className="w-4 h-4" /> Grovi Dashboard
                  </div>
                  <div className="flex gap-2 items-center text-xs bg-primary-800 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span>Mock Data</span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative h-[350px] md:h-[450px] bg-gray-100 group overflow-hidden">
                  {/* Leaflet Map Container */}
                  <div ref={mapRef} className="w-full h-full z-0"></div>

                  {/* UI Overlay: Left Sidebar (Tools) - Always visible */}
                  <div className="absolute left-2 md:left-4 top-2 md:top-4 flex flex-col gap-2 z-[1000]">
                    <div
                      className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 text-primary-700 transition"
                      onClick={toggleMapLayer}
                      title="Toggle Layer"
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>

                  {/* UI Overlay: NDVI Chart Card (Top Right) - Hidden on mobile, shown on md+ */}
                  <div className="hidden md:block absolute top-4 right-4 bg-white/95 backdrop-blur shadow-lg rounded-xl p-4 border border-gray-200 w-72 lg:w-80 z-[1000]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                        <span className="text-xs font-bold text-gray-700">
                          NDVI
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        สรุปผลการวิเคราะห์
                      </span>
                    </div>

                    {/* NDVI Chart (SVG) */}
                    <div className="mb-3">
                      <svg viewBox="0 0 300 120" className="w-full h-24">
                        {/* Grid lines */}
                        <line
                          x1="0"
                          y1="20"
                          x2="300"
                          y2="20"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="40"
                          x2="300"
                          y2="40"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="60"
                          x2="300"
                          y2="60"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="80"
                          x2="300"
                          y2="80"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />
                        <line
                          x1="0"
                          y1="100"
                          x2="300"
                          y2="100"
                          stroke="#e5e7eb"
                          strokeWidth="0.5"
                        />

                        {/* NDVI Line Chart */}
                        <polyline
                          points="0,95 75,42 150,22 225,18 300,50"
                          fill="none"
                          stroke="#16a34a"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Fill area under curve */}
                        <polygon
                          points="0,100 0,95 75,42 150,22 225,18 300,50 300,100"
                          fill="#16a34a"
                          fillOpacity="0.1"
                        />

                        {/* Data points */}
                        <circle cx="0" cy="95" r="3" fill="#16a34a" />
                        <circle cx="75" cy="42" r="3" fill="#16a34a" />
                        <circle cx="150" cy="22" r="3" fill="#16a34a" />
                        <circle cx="225" cy="18" r="3" fill="#16a34a" />
                        <circle cx="300" cy="50" r="3" fill="#16a34a" />

                        {/* Y-axis labels */}
                        <text x="5" y="15" fontSize="8" fill="#9ca3af">
                          0.8
                        </text>
                        <text x="5" y="55" fontSize="8" fill="#9ca3af">
                          0.5
                        </text>
                        <text x="5" y="95" fontSize="8" fill="#9ca3af">
                          0.2
                        </text>
                      </svg>

                      {/* X-axis labels (months) */}
                      <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-1">
                        <span>ม.ค.</span>
                        <span>มี.ค.</span>
                        <span>พ.ค.</span>
                        <span>ก.ค.</span>
                        <span>ก.ย.</span>
                      </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-blue-50 rounded p-2">
                        <div className="text-[10px] text-gray-500 mb-1">
                          ค่าต่ำสุด
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                          0.541
                        </div>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <div className="text-[10px] text-gray-500 mb-1">
                          ค่าสูงสุด
                        </div>
                        <div className="text-sm font-bold text-green-600">
                          0.721
                        </div>
                      </div>
                      <div className="bg-orange-50 rounded p-2">
                        <div className="text-[10px] text-gray-500 mb-1">
                          ค่าเฉลี่ย
                        </div>
                        <div className="text-sm font-bold text-orange-600">
                          0.186
                        </div>
                      </div>
                    </div>

                    {/* Period Info */}
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="text-[10px] text-gray-500">
                        <span className="font-semibold">ช่วงข้อมูล:</span> ม.ค.
                        2025 - ธ.ค. 2025
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        <span className="font-semibold">จำนวนข้อมูล:</span> 5
                        จุดข้อมูล
                      </div>
                    </div>
                  </div>

                  {/* UI Overlay: NDVI Value Card (Bottom Left) - Hidden on mobile, shown on md+ */}
                  <div className="hidden md:block absolute bottom-4 left-4 bg-white/95 backdrop-blur shadow-lg rounded-lg p-3 w-44 lg:w-52 border border-gray-200 z-[1000] text-center">
                    {/* Header */}
                    <div className="mb-1">
                      <p className="text-[10px] text-gray-600">
                        ค่าเฉลี่ย NDVI ณ วันที่
                      </p>
                      <p className="text-xs font-bold text-gray-800">
                        6 ธันวาคม 2568
                      </p>
                    </div>

                    {/* NDVI Value */}
                    <div className="my-2">
                      <span className="text-2xl lg:text-3xl font-bold text-green-600">
                        0.309
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mb-2">
                      <div
                        className="bg-green-600 h-full rounded-full"
                        style={{ width: "30.9%" }}
                      ></div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-2">
                      <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ปานกลาง - สภาพพอใช้
                      </span>
                    </div>

                    {/* Description */}
                    <div className="text-[10px] text-gray-600 border-t border-gray-100 pt-1.5">
                      ดินข้าวเริ่มต้น - ระยะแตกกอเริ่มต้น
                    </div>
                  </div>
                </div>

                {/* Mobile-only: Stacked Overlay Cards (shown below map on small screens) */}
                <div className="md:hidden flex flex-col gap-3 p-4 bg-gray-50">
                  {/* NDVI Value Card - Mobile */}
                  <div className="bg-white shadow-md rounded-lg p-3 border border-gray-200 text-center">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded"></div>
                        <span className="text-xs font-bold text-gray-700">
                          NDVI ปัจจุบัน
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        6 ธ.ค. 2568
                      </span>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <span className="text-3xl font-bold text-green-600">
                        0.309
                      </span>
                      <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        ปานกลาง
                      </span>
                    </div>
                  </div>

                  {/* Statistics Grid - Mobile */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
                      <div className="text-[10px] text-gray-500 mb-1">
                        ค่าต่ำสุด
                      </div>
                      <div className="text-sm font-bold text-blue-600">
                        0.541
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                      <div className="text-[10px] text-gray-500 mb-1">
                        ค่าสูงสุด
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        0.721
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-2 border border-orange-100">
                      <div className="text-[10px] text-gray-500 mb-1">
                        ค่าเฉลี่ย
                      </div>
                      <div className="text-sm font-bold text-orange-600">
                        0.186
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Statistics & Benefits */}
      <section className="bg-primary-900 text-white py-12 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-primary-700">
            <div className="flex items-start gap-4 p-2">
              <div className="p-3 bg-primary-800 rounded-lg text-primary-200">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Real-time</h3>
                <p className="text-sm text-primary-200 font-light">
                  ติดตามสุขภาพข้าวได้ทุกวัน ไม่ต้องลงพื้นที่
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 md:pl-8">
              <div className="p-3 bg-primary-800 rounded-lg text-primary-200">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Precision</h3>
                <p className="text-sm text-primary-200 font-light">
                  สามารถวางแผนและคาดการณ์ปัญหาได้จากการติดตาม
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 md:pl-8">
              <div className="p-3 bg-primary-800 rounded-lg text-primary-200">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Analytics</h3>
                <p className="text-sm text-primary-200 font-light">
                  วิเคราะห์แนวโน้มในการเพาะปลูกทั้งในอนาคตและอดีต
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2 md:pl-8">
              <div className="p-3 bg-primary-800 rounded-lg text-primary-200">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Save Cost</h3>
                <p className="text-sm text-primary-200 font-light">
                  ลดต้นทุนปุ๋ยยา บริหารจัดการง่าย
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
