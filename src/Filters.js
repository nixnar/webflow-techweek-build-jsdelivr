import React from "react";
import FiltersBody from "./ui/FiltersBody";

export default function Filters({
  city,
  setCity,
  availableFilters,
  activeFilters,
  setActiveFilters,
  showPastEvents,
  setShowPastEvents,
}) {
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [isSticky, setIsSticky] = React.useState(false);
  const stickyTriggerRef = React.useRef(null);

  React.useEffect(() => {
    // Function to measure header height
    const measureHeader = () => {
      // The header contains the Tech Week Schedule title and sponsors
      const headerElement = document.querySelector(".center-outside");
      if (headerElement) {
        const height = headerElement.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    // Initial measurement
    measureHeader();

    // Re-measure on window resize
    window.addEventListener("resize", measureHeader);

    // Cleanup
    return () => window.removeEventListener("resize", measureHeader);
  }, []);

  React.useEffect(() => {
    // Create a sentinel element that will trigger when we're about to become sticky
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.height = "1px";
    sentinel.style.width = "1px";
    sentinel.style.visibility = "hidden";

    // Add the sentinel to the DOM
    const filtersElement = document.getElementById("filters");
    if (filtersElement && filtersElement.parentElement) {
      filtersElement.parentElement.insertBefore(sentinel, filtersElement);
      stickyTriggerRef.current = sentinel;
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When sentinel goes out of view, we're sticky
        setIsSticky(!entry.isIntersecting);
      },
      {
        threshold: 1.0,
      }
    );

    // Start observing
    if (stickyTriggerRef.current) {
      observer.observe(stickyTriggerRef.current);
    }

    // Cleanup
    return () => {
      if (stickyTriggerRef.current) {
        observer.unobserve(stickyTriggerRef.current);
        stickyTriggerRef.current.remove();
      }
    };
  }, []);

  return (
    <div
      id="filters"
      className="w-[22.5rem] min-h-[20rem] border-[1px] border-white p-[4px] bg-black sticky top-4 overflow-hidden"
      style={{
        height: isSticky
          ? `calc(100vh - 2rem)`
          : headerHeight
          ? `calc(100vh - ${headerHeight}px - 9.5rem)`
          : "100vh",
        transition: "height 0.2s ease-out",
      }}
    >
      <div
        className="border-[1px] border-white h-full p-4 overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <FiltersBody
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          availableFilters={availableFilters}
          showPastEvents={showPastEvents}
          setShowPastEvents={setShowPastEvents}
        />
      </div>
    </div>
  );
}
