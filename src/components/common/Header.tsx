import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    // Only track scroll on home page
    if (location.pathname !== "/") return;

    const root = document.getElementById("root");
    if (!root) return;

    const handleScroll = () => {
      const sections = [
        "home",
        "rice-info",
        "user-guide",
        "research",
        "contact",
      ];

      const triggerPoint = root.clientHeight * 0.4; // 40% from top of root

      // Check if we are at the bottom of the scrollable area
      if (root.clientHeight + root.scrollTop >= root.scrollHeight - 100) {
        setActiveSection(sections[sections.length - 1]);
        return;
      }

      let current = sections[0];
      const rootTop = root.getBoundingClientRect().top;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Check position relative to root's top
          if (rect.top - rootTop <= triggerPoint) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    root.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => root.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const handleSignIn = () => {
    navigate("/auth");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const scrollToSection = (sectionId: string) => {
    // If not on home page, navigate to home first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const renderAuthSection = () => {
    if (!isAuthenticated) {
      return (
        <div className="auth">
          <a onClick={handleSignIn} className="login-btn">
            เข้าสู่ระบบ
          </a>
        </div>
      );
    }

    return (
      <div className="auth">
        <span>สวัสดี, {user?.name || user?.username || "ผู้ใช้"}</span>
        <a onClick={handleLogout} className="logout-btn">
          ออกจากระบบ
        </a>
      </div>
    );
  };

  // Don't render header on certain pages if needed
  if (location.pathname === "/compare" || location.pathname === "/auth") {
    return null;
  }

  // Check if we're on home page for section-based navigation
  const isHomePage = location.pathname === "/";

  return (
    <header>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="brand">
          <div className="logo">
            <img src="/src/iconlog0_grovi.png" alt="Grovi Logo" />
          </div>
        </div>
        <nav className="nav-menu">
          <a
            onClick={() =>
              isHomePage ? scrollToSection("home") : handleNavigation("/")
            }
            className={isHomePage && activeSection === "home" ? "active" : ""}
          >
            หน้าหลัก
          </a>
          <a
            onClick={() => handleNavigation("/map")}
            className={location.pathname === "/map" ? "active" : ""}
          >
            แผนที่
          </a>
          <a
            onClick={() => scrollToSection("rice-info")}
            className={
              isHomePage && activeSection === "rice-info" ? "active" : ""
            }
          >
            ข้าวคืออะไร
          </a>
          <a
            onClick={() => scrollToSection("user-guide")}
            className={
              isHomePage && activeSection === "user-guide" ? "active" : ""
            }
          >
            วิธีการใช้งาน
          </a>
          <a
            onClick={() => scrollToSection("research")}
            className={
              isHomePage && activeSection === "research" ? "active" : ""
            }
          >
            เกี่ยวกับวิจัย
          </a>
          <a
            onClick={() => scrollToSection("contact")}
            className={
              isHomePage && activeSection === "contact" ? "active" : ""
            }
          >
            ช่องทางการติดต่อ
          </a>
        </nav>
      </div>
      <div className="header-right">
        <div className="language-selector">
          <span>🇹🇭</span>
          <span>ไทย</span>
        </div>
        {renderAuthSection()}
      </div>
    </header>
  );
};

export default Header;
