import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import axios from "../config/axios";
import { Search, MapPin } from "lucide-react";

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
  type: string;
  class: string;
}

interface SearchPanelProps {
  map: L.Map | null;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ map }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedInsidePanel = panelRef.current?.contains(
        event.target as Node
      );
      const clickedInsideTrigger = triggerRef.current?.contains(
        event.target as Node
      );

      // Collapse if clicked outside both panel and trigger
      if (!clickedInsidePanel && !clickedInsideTrigger) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);

      // Try API endpoint first
      const response = await axios.get("/utils/search", {
        params: { q: searchQuery },
      });

      setResults(response.data.results || []);
    } catch (error) {
      console.error("Search API failed, trying direct Nominatim:", error);

      // Fallback to direct Nominatim search
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=th&q=${encodeURIComponent(
            searchQuery
          )}&limit=8&addressdetails=1`,
          {
            headers: {
              "User-Agent": "Grovi-CropMonitoring/1.0",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const formattedResults = data.map((item: any) => ({
            display_name: item.display_name,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            type: item.type || "",
            class: item.class || "",
          }));
          setResults(formattedResults);
        } else {
          setResults([]);
        }
      } catch (fallbackError) {
        console.error("Fallback search failed:", fallbackError);
        setResults([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log("Search result clicked:", result);

    if (!map) {
      console.error("Map is not available");
      return;
    }

    try {
      // Remove existing marker
      if (marker) {
        map.removeLayer(marker);
      }

      // Add new marker
      const newMarker = L.marker([result.lat, result.lon])
        .addTo(map)
        .bindPopup(result.display_name)
        .openPopup();

      setMarker(newMarker);

      // Fly to location
      map.flyTo([result.lat, result.lon], 13);

      // Clear results and collapse panel
      setResults([]);
      setQuery("");
      setIsExpanded(false);

      console.log("Successfully navigated to location");
    } catch (error) {
      console.error("Error navigating to location:", error);
    }
  };

  const handleTriggerClick = () => {
    setIsExpanded(true);
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
  };

  const handleSearchButtonClick = () => {
    if (query.trim()) {
      performSearch(query);
    }
  };

  return (
    <>
      {/* Search Trigger - Toggle Button */}
      {!isExpanded && (
        <div
          ref={triggerRef}
          onClick={handleTriggerClick}
          className="absolute top-4 right-4 z-[1000] cursor-pointer bg-white text-gray-700 px-5 py-2.5 rounded-full shadow-lg border border-gray-100 flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl font-sans opacity-60 hover:opacity-100 hover:bg-gray-50"
        >
          <Search size={18} />
          <span className="text-sm font-medium">ค้นหาพื้นที่</span>
        </div>
      )}

      {/* Search Panel - Expanded State */}
      <div
        ref={panelRef}
        className={`absolute top-4 right-4 z-[1000] transition-all duration-300 origin-top-right ${
          isExpanded
            ? "opacity-100 scale-100 translate-y-0 visible"
            : "opacity-0 scale-95 -translate-y-4 invisible pointer-events-none"
        }`}
      >
        <div className="bg-gray-200/80 backdrop-blur-md p-2 rounded-[30px] shadow-2xl border border-white/50 flex flex-col gap-2 w-[400px]">
          {/* Search Bar Container */}
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder="ค้นหาพื้นที่ (เช่น อำเภอเชียงม่วน)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleInputFocus}
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleSearchButtonClick();
                }}
                className="w-full h-10 pl-9 pr-4 bg-white border border-transparent focus:border-green-500 rounded-full text-gray-700 placeholder-gray-400 outline-none transition-all font-sans text-sm shadow-sm"
              />
            </div>
            <button
              onClick={handleSearchButtonClick}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold h-10 px-6 rounded-full shadow-md hover:shadow-green-500/30 transition-all duration-200 min-w-[80px] flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "ค้นหา"
              )}
            </button>
          </div>

          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-inner overflow-hidden border border-gray-100 max-h-[250px] overflow-y-auto custom-scrollbar mx-1 mt-1">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="px-4 py-2.5 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center gap-3 transition-colors group"
                  onClick={() => handleResultClick(result)}
                >
                  <span className="bg-gray-100 p-1.5 rounded-full text-gray-500 group-hover:bg-green-200 group-hover:text-green-700 transition-colors">
                    <MapPin size={14} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-gray-800 font-medium text-sm group-hover:text-green-800">
                      {result.display_name.split(",")[0]}
                    </span>
                    <span className="text-gray-400 text-xs truncate max-w-[280px]">
                      {result.display_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {query && results.length === 0 && !isLoading && (
            <div className="bg-white rounded-2xl p-3 text-center text-gray-400 text-xs border border-gray-100 mx-1 mt-1">
              ไม่พบผลลัพธ์
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchPanel;
