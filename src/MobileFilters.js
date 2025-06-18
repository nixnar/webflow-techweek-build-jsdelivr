import React from "react";
import FiltersBody from "./ui/FiltersBody";
export default function MobileFilters({
  city,
  setCity,
  availableFilters,
  activeFilters,
  setActiveFilters,
  filterToggle,
  setFilterToggle,
  searchMode,
  showPastEvents,
  setShowPastEvents,
}) {
  const searchRef = React.useRef(null);

  React.useEffect(() => {
    if (filterToggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [filterToggle]);

  // When opening in search mode, scroll to search section
  React.useEffect(() => {
    if (filterToggle && searchMode && searchRef.current) {
      searchRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [filterToggle, searchMode]);

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Overlay - takes up full screen */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-all duration-300"
        onClick={() => setFilterToggle(false)}
      ></div>

      <div className="flex justify-end w-full">
        <div className="w-[90%] h-full bg-black border-l border-white relative z-10 overflow-hidden">
          <div
            className="h-full p-6 overflow-y-scroll"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Filters</h2>
              <button
                className="flex items-center justify-center"
                onClick={() => setFilterToggle(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <path
                    d="M0.726501 9.97656L0.0233765 9.27344L4.29291 5L0.0233765 0.730469L0.726501 0.0195312L4.99994 4.29297L9.26947 0.0195312L9.98041 0.730469L5.70697 5L9.98041 9.27344L9.26947 9.97656L4.99994 5.70703L0.726501 9.97656Z"
                    fill="white"
                  />
                </svg>
              </button>
            </div>

            <FiltersBody
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              availableFilters={availableFilters}
              searchRef={searchRef}
              searchMode={searchMode}
              showPastEvents={showPastEvents}
              setShowPastEvents={setShowPastEvents}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
