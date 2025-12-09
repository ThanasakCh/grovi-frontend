import React from "react";
import "../styles/HomePage.css";
import LandingPage from "./LandingPage";
import RiceInfoPage from "./RiceInfoPage";
import UserGuidePage from "./UserGuidePage";
import ResearchPage from "./ResearchPage";
import ContactPage from "./ContactPage";

const HomePage: React.FC = () => {
  return (
    // Only the container logic here
    <div className="relative min-h-screen">
      {/* Main Scrollable Content */}
      <div className="home-page-container pt-20">
        <div id="home" className="relative">
          <LandingPage />
        </div>
        <div id="how-to-use" className="relative">
          <UserGuidePage />
        </div>
        <div id="technology" className="relative">
          <RiceInfoPage />
        </div>
        <div id="research" className="relative">
          <ResearchPage />
        </div>
        <div id="contact" className="relative">
          <ContactPage />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
