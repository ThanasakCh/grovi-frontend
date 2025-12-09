import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogIn, LogOut } from "lucide-react";
import logo from "../../assets/images/logo.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState("dashboard");

  const sections = [
    { id: "dashboard", targetId: "home", label: "ภาพรวม" },
    { id: "map", targetId: "map-link", label: "แผนที่" },
    { id: "how-to-use", targetId: "how-to-use", label: "คู่มือใช้งาน" },
    { id: "technology", targetId: "technology", label: "เทคโนโลยี" },
    { id: "research", targetId: "research", label: "งานวิจัย" },
    { id: "contact", targetId: "contact", label: "ติดต่อเรา" },
  ];

  // ScrollSpy Logic - Only active on Home Page
  useEffect(() => {
    if (location.pathname !== "/") {
      // If on Map page, set active section to 'map'
      if (location.pathname === "/map") {
        setActiveSection("map");
      }
      return;
    }

    const scrollContainer = document.getElementById("root") || document.body;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      // 1. Check if at bottom of page
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setActiveSection("contact");
        return;
      }

      // 2. Check each section position
      const threshold = window.innerHeight * 0.4;

      let currentActive = "dashboard";

      for (const section of sections) {
        if (section.id === "map") continue;

        const element = document.getElementById(section.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentActive = section.id;
          }
        }
      }

      setActiveSection(currentActive);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]); // Re-run when path changes

  const handleNavClick = (
    sectionId: string,
    targetId: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();

    // Special logic for Map
    if (sectionId === "map") {
      if (isAuthenticated) {
        navigate("/map");
      } else {
        navigate("/auth");
      }
      return;
    }

    // Normal Sections
    if (location.pathname === "/") {
      // If already on Home, scroll to section
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setActiveSection(sectionId);
      }
    } else {
      // If not on Home, navigate to Home then scroll (need hash handling in HomePage usually,
      // but for now let's just go to root and hopefully user scrolls manually or we add hash logic later.
      // Actually navigate("/", { state: ... }) is better but let's stick to simple navigate
      navigate("/");
      // Ideally we would pass state to scroll after nav, but let's simulate by just going to / for now.
      // Or use a timeout if we really wanted to (hacky).
      // Given the request "Just make the navbar same", navigating to home is active enough.
      // But standard way is navigate("/#" + targetId) and handle hash in HomePage useEffect.
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <nav className="fixed w-full z-50 glass-nav transition-all duration-300 top-0 left-0 border-b border-gray-100/50 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="Grovi Logo" className="h-10 w-auto" />
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl text-primary-900 leading-none">
                GROVI
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Crop Monitoring Platform
              </span>
            </div>
          </div>

          {/* Center Menu */}
          <div className="hidden lg:flex space-x-2 items-center bg-gray-100/50 p-1.5 rounded-full border border-gray-200">
            {sections.map((item) => (
              <a
                key={item.id}
                href={`#${item.targetId}`}
                onClick={(e) => handleNavClick(item.id, item.targetId, e)}
                className={`px-6 py-2 text-sm font-medium rounded-full transition ${
                  activeSection === item.id
                    ? "text-primary-900 bg-white shadow-sm"
                    : "text-gray-600 hover:text-primary-900"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-3">
            {/* System Status - Always visible but changes state */}
            <div className="hidden md:flex flex-col text-right mr-3">
              <span className="text-xs text-gray-500">สถานะระบบ</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAuthenticated
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                ></span>
                <span
                  className={`text-xs font-bold ${
                    isAuthenticated ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isAuthenticated ? "Online" : "Offline"}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <>
                <div className="hidden md:flex flex-col text-right mr-2 border-l border-gray-200 pl-3">
                  <span className="text-xs text-gray-500">ยินดีต้อนรับ</span>
                  <span className="text-sm font-bold text-gray-700">
                    {user?.name || "User"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg text-sm font-display font-medium shadow-lg shadow-red-600/20 transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/auth")}
                className="bg-primary-900 hover:bg-primary-800 text-white px-6 py-2.5 rounded-lg text-sm font-display font-medium shadow-lg shadow-primary-900/20 transition flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
