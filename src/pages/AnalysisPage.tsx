import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import L from "leaflet";
import { useField } from "../contexts/FieldContext";
import axios from "../config/axios";
import {
  CalendarRange,
  CalendarDays,
  TrendingUp,
  BarChart2,
  Image as ImageIcon,
  FileText,
  FileJson,
  Activity,
  ChevronLeft,
} from "lucide-react";

interface TimeSeriesData {
  date: string;
  value: number;
}

const AnalysisPage: React.FC = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { getField, currentField } = useField();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedVI, setSelectedVI] = useState("NDVI");
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [chartUrl, setChartUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<
    "monthly_range" | "full_year" | "ten_year_avg"
  >("monthly_range");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(3);

  const viTypes = [
    { code: "NDVI", name: "NDVI" },
    { code: "EVI", name: "EVI" },
    { code: "GNDVI", name: "GNDVI" },
    { code: "NDWI", name: "NDWI" },
    { code: "SAVI", name: "SAVI" },
    { code: "VCI", name: "VCI" },
  ];

  useEffect(() => {
    if (!fieldId) {
      navigate("/map");
      return;
    }
    loadField();
  }, [fieldId]);

  useEffect(() => {
    if (currentField && mapContainerRef.current && !mapRef.current) {
      initializeMap();
    }
  }, [currentField]);

  const loadField = async () => {
    if (!fieldId) return;

    try {
      setIsLoading(true);
      await getField(fieldId);
    } catch (error: any) {
      console.error("Failed to load field:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลแปลงได้: " + error.message,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      navigate("/map");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeMap = () => {
    if (!mapContainerRef.current || !currentField || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView([currentField.centroid_lat, currentField.centroid_lng], 15);

    // Add base layers
    const esriSatellite = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles © Esri",
      }
    ).addTo(map);

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    );

    L.control
      .layers(
        {
          "Esri Satellite": esriSatellite,
          OpenStreetMap: osmLayer,
        },
        {},
        {
          position: "topleft",
        }
      )
      .addTo(map);

    // Add field boundary
    if (currentField.geometry) {
      const fieldLayer = L.geoJSON(currentField.geometry, {
        style: {
          color: "#ff0000",
          weight: 2,
          fillOpacity: 0.05,
        },
      }).addTo(map);

      map.fitBounds(fieldLayer.getBounds(), { padding: [20, 20] });
    }

    mapRef.current = map;
  };

  const analyzeFieldVI = async () => {
    if (!fieldId || !currentField) return;

    try {
      setIsAnalyzing(true);

      let startDate: Date, endDate: Date;

      switch (analysisType) {
        case "monthly_range":
          startDate = new Date(selectedYear, startMonth - 1, 1);
          endDate = new Date(selectedYear, endMonth, 0); // Last day of end month
          break;

        case "full_year":
          startDate = new Date(selectedYear, 0, 1); // January 1st
          endDate = new Date(selectedYear, 11, 31); // December 31st
          break;

        case "ten_year_avg":
          endDate = new Date();
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 10);
          break;

        default:
          return;
      }

      // Call GEE service to get timeseries data
      const response = await axios.get(`/vi/timeseries/${fieldId}`, {
        params: {
          vi_type: selectedVI,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          analysis_type: analysisType,
        },
      });

      console.log("📊 API Response:", response.data);

      if (response.data.timeseries && response.data.timeseries.length > 0) {
        const processedData = processTimeSeriesData(response.data.timeseries);
        setTimeSeriesData(processedData);
        generateChart(processedData);
        console.log(
          `✅ Successfully processed ${processedData.length} data points`
        );
      } else {
        setTimeSeriesData([]);
        setChartUrl("");
        console.warn("⚠️ No data returned from API");
        Swal.fire({
          title: "แจ้งเตือน",
          text: "ไม่พบข้อมูลในช่วงเวลาที่เลือก กรุณาเลือกช่วงเวลาอื่น หรือตรวจสอบการเชื่อมต่อ Google Earth Engine",
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
      }
    } catch (error: any) {
      console.error("Failed to analyze field VI:", error);
      setTimeSeriesData([]);
      setChartUrl("");
      const errorMessage =
        error.response?.data?.detail || error.message || "ไม่ทราบสาเหตุ";
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: `เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Earth Engine:\n\n${errorMessage}\n\nกรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ`,
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const processTimeSeriesData = (rawData: any[]): TimeSeriesData[] => {
    console.log("🔄 Processing timeseries data:", rawData);

    if (analysisType === "ten_year_avg") {
      // For 10-year average, data is already yearly averages from GEE
      const result = rawData
        .map((item) => {
          const date = new Date(item.measurement_date || item.date);
          const value = item.vi_value || item.value;

          return {
            date: date.getFullYear().toString(),
            value: value,
          };
        })
        .sort((a, b) => parseInt(a.date) - parseInt(b.date));

      console.log(
        "📊 Processed 10-year data (yearly averages from GEE):",
        result
      );
      return result;
    } else {
      // Monthly data - data is already monthly averages from GEE
      const result = rawData.map((item) => {
        const date = new Date(item.measurement_date || item.date);
        const value = item.vi_value || item.value;

        return {
          date: date.toLocaleDateString("th-TH", {
            month: "short",
            ...(analysisType === "monthly_range" &&
            date.getFullYear() !== new Date().getFullYear()
              ? { year: "numeric" }
              : {}),
          }),
          value: value,
        };
      });

      console.log("📅 Processed monthly data:", result);
      return result;
    }
  };

  const generateChart = (data: TimeSeriesData[]) => {
    if (data.length === 0) return;

    const chartData = {
      type: "line",
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: selectedVI,
            data: data.map((d) => d.value),
            fill: true,
            borderColor: "#2b7a4b",
            backgroundColor: "rgba(43, 122, 75, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
          },
          title: {
            display: true,
            text: getAnalysisDescription(),
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            title: {
              display: true,
              text: `ค่า ${selectedVI}`,
            },
          },
          x: {
            title: {
              display: true,
              text: analysisType === "ten_year_avg" ? "ปี" : "เดือน",
            },
          },
        },
      },
    };

    const encodedData = encodeURIComponent(JSON.stringify(chartData));
    setChartUrl(`https://quickchart.io/chart?c=${encodedData}`);
  };

  const getAvailableYears = (): number[] => {
    const currentYear = new Date().getFullYear();
    // Sentinel-2 has data from 2015, show last 10 years
    const startYear = currentYear - 9;
    return Array.from({ length: 10 }, (_, i) => startYear + i).reverse();
  };

  const getAvailableMonths = (): number[] => {
    return Array.from({ length: 12 }, (_, i) => i + 1);
  };

  const getAnalysisDescription = (): string => {
    switch (analysisType) {
      case "monthly_range":
        const startMonthName = new Date(0, startMonth - 1).toLocaleDateString(
          "th-TH",
          { month: "long" }
        );
        const endMonthName = new Date(0, endMonth - 1).toLocaleDateString(
          "th-TH",
          { month: "long" }
        );
        return `ค่าเฉลี่ยรายเดือน ${selectedVI} ช่วง ${startMonthName} - ${endMonthName} ปี ${selectedYear}`;
      case "full_year":
        return `ค่าเฉลี่ยรายเดือน ${selectedVI} ทั้งปี ${selectedYear} (มกราคม-ธันวาคม)`;
      case "ten_year_avg":
        return `ค่าเฉลี่ยรายปี ${selectedVI} (10 ปีย้อนหลัง) - ปีละ 1 ค่า`;
      default:
        return `ข้อมูล ${selectedVI}`;
    }
  };

  const handleBackClick = () => {
    navigate(`/field/${fieldId}`);
  };

  const downloadChartImage = async () => {
    if (!chartUrl) return;

    try {
      // Fetch the image from QuickChart
      const response = await fetch(chartUrl);
      const blob = await response.blob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        currentField?.name || "field"
      }_${selectedVI}_${analysisType}_${selectedYear}${startMonth}-${endMonth}.png`;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading chart image:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  const downloadAnalysisResults = () => {
    if (timeSeriesData.length === 0) return;
    const data = {
      field_name: currentField?.name,
      vi_type: selectedVI,
      analysis_type: analysisType,
      year: selectedYear,
      start_month: startMonth,
      end_month: endMonth,
      timeseries: timeSeriesData,
      description: getAnalysisDescription(),
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${
      currentField?.name || "field"
    }_${selectedVI}_${analysisType}_${selectedYear}${startMonth}-${endMonth}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (timeSeriesData.length === 0) return;

    try {
      // สร้างหัวตาราง CSV พร้อม BOM สำหรับภาษาไทย
      const headers = ["ชื่อแปลง", "ประเภท VI", "ปี", "เดือน", "ค่า VI"];

      // สร้างข้อมูล CSV
      const csvData = timeSeriesData.map((item) => [
        currentField?.name || "ไม่ทราบ",
        selectedVI,
        item.date,
        item.date.includes("-") ? item.date.split("-")[1] : "", // For monthly data, show month
        item.value.toFixed(4),
      ]);

      // รวมหัวตารางและข้อมูล
      const csvContent = [headers, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");

      // เพิ่ม BOM (Byte Order Mark) สำหรับ UTF-8 เพื่อให้ Excel อ่านภาษาไทยได้ถูกต้อง
      const BOM = "\uFEFF";
      const csvString = BOM + csvContent;

      // สร้างไฟล์ CSV ด้วย encoding ที่ถูกต้อง
      const blob = new Blob([csvString], {
        type: "text/csv;charset=utf-8;",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${
        currentField?.name || "field"
      }_${selectedVI}_${analysisType}_${selectedYear}${startMonth}-${endMonth}.csv`;

      // ดาวน์โหลดไฟล์
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // ล้าง URL
      URL.revokeObjectURL(url);

      console.log("ดาวน์โหลดข้อมูล CSV สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดาวน์โหลด CSV:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "เกิดข้อผิดพลาดในการดาวน์โหลด CSV กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
    }
  };

  if (isLoading) {
    return (
      <section className="page active">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <div>กำลังโหลด...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="page active analysis-page">
      <div className="work-anal">
        <div className="map-pane">
          <div ref={mapContainerRef} className="map" />

          {/* Toolbar */}
          <div
            className="toolbar"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1000,
              marginTop: "50px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              backgroundColor: "transparent",
              padding: "0px",
            }}
          >
            {/* Zoom Control */}
            <div
              style={{
                width: "40px",
                height: "80px",
                backgroundColor: "#FFFFFF",
                borderRadius: "20px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                border: "none",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <button
                className="toolbtn-zoom"
                title="ซูมเข้า"
                onClick={() => mapRef.current?.zoomIn()}
                style={{
                  flex: 1,
                  border: "none",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#006400",
                }}
              >
                +
              </button>
              <div
                style={{
                  width: "100%",
                  height: "1px",
                  backgroundColor: "rgba(0, 100, 0, 0.2)",
                }}
              ></div>
              <button
                className="toolbtn-zoom"
                title="ซูมออก"
                onClick={() => mapRef.current?.zoomOut()}
                style={{
                  flex: 1,
                  border: "none",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#006400",
                }}
              >
                −
              </button>
            </div>

            {/* Compass Button */}
            <button
              className="toolbtn-circle"
              title="เข็มทิศ"
              onClick={() =>
                Swal.fire({
                  title: "กำลังพัฒนา",
                  text: "เข็มทิศ (จะพัฒนาในเวอร์ชันถัดไป)",
                  icon: "info",
                  confirmButtonText: "ตกลง",
                })
              }
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"
                  fill="#006400"
                />
                <circle cx="12" cy="12" r="2" fill="#006400" />
              </svg>
            </button>

            {/* Measurement Button */}
            <button
              className="toolbtn-circle"
              title="วัดระยะทาง"
              onClick={() =>
                Swal.fire({
                  title: "กำลังพัฒนา",
                  text: "โหมดวัดระยะ (จะพัฒนาในเวอร์ชันถัดไป)",
                  icon: "info",
                  confirmButtonText: "ตกลง",
                })
              }
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 21L21 3" stroke="#006400" strokeWidth="2" />
                <path d="M3 3h6v6" stroke="#006400" strokeWidth="2" />
                <path d="M15 15h6v6" stroke="#006400" strokeWidth="2" />
                <circle cx="6" cy="6" r="1" fill="#006400" />
                <circle cx="18" cy="18" r="1" fill="#006400" />
              </svg>
            </button>

            {/* Location Button */}
            <button
              className="toolbtn-circle"
              title="ตำแหน่งของฉัน"
              onClick={() =>
                mapRef.current?.locate({
                  setView: true,
                  maxZoom: 19,
                  enableHighAccuracy: true,
                })
              }
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" fill="#006400" />
                <circle
                  cx="12"
                  cy="12"
                  r="8"
                  stroke="#006400"
                  strokeWidth="2"
                  fill="none"
                />
                <path d="M12 2v4" stroke="#006400" strokeWidth="2" />
                <path d="M12 18v4" stroke="#006400" strokeWidth="2" />
                <path d="M2 12h4" stroke="#006400" strokeWidth="2" />
                <path d="M18 12h4" stroke="#006400" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>

        <aside className="sidebar">
          <div className="backbar">
            <button
              className="backbtn"
              onClick={handleBackClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ChevronLeft size={16} /> ย้อนกลับ
            </button>
            <h3 style={{ margin: 0 }}>การวิเคราะห์</h3>
          </div>

          {/* Tab Navigation */}
          <div className="seg">
            <button className="active" style={{ cursor: "default" }}>
              Trend Analysis
            </button>
          </div>

          {/* Trend Panel */}
          {
            <div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                  marginBottom: "15px",
                  flexWrap: "wrap",
                }}
              >
                <label htmlFor="typeSelect">
                  <b>VI:</b>
                </label>
                <select
                  id="typeSelect"
                  value={selectedVI}
                  onChange={(e) => setSelectedVI(e.target.value)}
                  disabled={isAnalyzing}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "white",
                    fontSize: "14px",
                    cursor: "pointer",
                    minWidth: "100px",
                  }}
                >
                  {viTypes.map((vi) => (
                    <option key={vi.code} value={vi.code}>
                      {vi.name}
                    </option>
                  ))}
                </select>
                <button
                  className="cta"
                  style={{
                    background: isAnalyzing ? "#f0f0f0" : "var(--brand)",
                    color: isAnalyzing ? "#999" : "#fff",
                    border: `1px solid ${isAnalyzing ? "#ccc" : "black"}`,
                    cursor: isAnalyzing ? "not-allowed" : "pointer",
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    borderRadius: "4px",
                  }}
                  onClick={analyzeFieldVI}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Activity className="animate-spin" size={18} />{" "}
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      <BarChart2 size={18} /> วิเคราะห์
                    </>
                  )}
                </button>
              </div>

              {/* Analysis Type Selection */}
              <div style={{ marginBottom: "15px" }}>
                <label>
                  <b>ประเภทการวิเคราะห์:</b>
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                >
                  <button
                    className={`btn ${
                      analysisType === "monthly_range"
                        ? "btn-green"
                        : "btn-outline"
                    }`}
                    onClick={() => setAnalysisType("monthly_range")}
                    style={{
                      fontSize: "14px",
                      padding: "10px 12px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    disabled={isAnalyzing}
                  >
                    <CalendarRange size={18} /> ช่วงเดือน -
                    เลือกเดือนที่ต้องการในปีที่เลือก
                  </button>
                  <button
                    className={`btn ${
                      analysisType === "full_year" ? "btn-green" : "btn-outline"
                    }`}
                    onClick={() => setAnalysisType("full_year")}
                    style={{
                      fontSize: "14px",
                      padding: "10px 12px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    disabled={isAnalyzing}
                  >
                    <CalendarDays size={18} /> ทั้งปี - แสดงข้อมูลทั้งปีที่เลือก
                  </button>
                  <button
                    className={`btn ${
                      analysisType === "ten_year_avg"
                        ? "btn-green"
                        : "btn-outline"
                    }`}
                    onClick={() => setAnalysisType("ten_year_avg")}
                    style={{
                      fontSize: "14px",
                      padding: "10px 12px",
                      textAlign: "left",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                    disabled={isAnalyzing}
                  >
                    <TrendingUp size={18} /> 10 ปีย้อนหลัง - ค่าเฉลี่ยรายปี
                  </button>
                </div>
              </div>

              {/* Year Selection for full_year and monthly_range modes */}
              {(analysisType === "full_year" ||
                analysisType === "monthly_range") && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <label>
                    <b>ปี:</b>
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    style={{
                      marginLeft: "8px",
                      padding: "6px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      backgroundColor: "white",
                      fontSize: "14px",
                    }}
                    disabled={isAnalyzing}
                  >
                    {getAvailableYears().map((year) => (
                      <option key={year} value={year}>
                        {year} พ.ศ. {year + 543}
                      </option>
                    ))}
                  </select>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#6c757d",
                      marginTop: "5px",
                    }}
                  >
                    * ข้อมูล Sentinel-2 มีให้ย้อนหลังถึงปี 2015
                  </div>
                </div>
              )}

              {/* Month Range Selection for monthly_range mode */}
              {analysisType === "monthly_range" && (
                <div
                  style={{
                    marginBottom: "15px",
                    padding: "10px",
                    background: "#f8f9fa",
                    borderRadius: "8px",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <label>
                      <b>เดือนเริ่มต้น:</b>
                    </label>
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(parseInt(e.target.value))}
                      style={{
                        marginLeft: "8px",
                        padding: "6px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        fontSize: "14px",
                      }}
                      disabled={isAnalyzing}
                    >
                      {getAvailableMonths().map((month) => (
                        <option key={`start-${month}`} value={month}>
                          {new Date(0, month - 1).toLocaleDateString("th-TH", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label>
                      <b>เดือนสิ้นสุด:</b>
                    </label>
                    <select
                      value={endMonth}
                      onChange={(e) => setEndMonth(parseInt(e.target.value))}
                      style={{
                        marginLeft: "8px",
                        padding: "6px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        backgroundColor: "white",
                        fontSize: "14px",
                      }}
                      disabled={isAnalyzing}
                    >
                      {getAvailableMonths().map((month) => (
                        <option
                          key={`end-${month}`}
                          value={month}
                          disabled={month < startMonth}
                        >
                          {new Date(0, month - 1).toLocaleDateString("th-TH", {
                            month: "long",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {timeSeriesData.length > 0 && (
                <div style={{ marginTop: "20px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h3>ผลการวิเคราะห์</h3>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={downloadChartImage}
                        className="btn btn-outline"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        title="ดาวน์โหลดกราฟเป็นรูปภาพ"
                      >
                        <ImageIcon size={14} /> รูปภาพ
                      </button>
                      <button
                        onClick={downloadCSV}
                        className="btn btn-outline"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        title="ดาวน์โหลดข้อมูล CSV"
                      >
                        <FileText size={14} /> CSV
                      </button>
                      <button
                        onClick={downloadAnalysisResults}
                        className="btn btn-outline"
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                        title="ดาวน์โหลดข้อมูล JSON"
                      >
                        <FileJson size={14} /> JSON
                      </button>
                    </div>
                  </div>

                  {chartUrl && (
                    <div
                      style={{
                        marginBottom: "20px",
                        border: "1px solid #ddd",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <img
                        src={chartUrl}
                        alt="Analysis Chart"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  )}

                  <div
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
                      border: "1px solid #eee",
                    }}
                  >
                    <table style={{ width: "100%", fontSize: "14px" }}>
                      <thead style={{ background: "#f8f9fa" }}>
                        <tr>
                          <th style={{ padding: "8px", textAlign: "left" }}>
                            {analysisType === "ten_year_avg" ? "ปี" : "วันที่"}
                          </th>
                          <th style={{ padding: "8px", textAlign: "right" }}>
                            ค่า {selectedVI}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeSeriesData.map((data, index) => (
                          <tr
                            key={index}
                            style={{ borderBottom: "1px solid #eee" }}
                          >
                            <td style={{ padding: "8px" }}>{data.date}</td>
                            <td style={{ padding: "8px", textAlign: "right" }}>
                              {data.value.toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          }
        </aside>
      </div>
    </section>
  );
};

export default AnalysisPage;
