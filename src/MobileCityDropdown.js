import React from "react";

const MobileCityDropdown = ({ city, setCity }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".city-dropdown-container")) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative city-dropdown-container">
      <div
        className="border-[1px] leading-[21.75px] border-white py-[0.375rem] px-2 uppercase cursor-pointer flex items-center justify-between min-w-[120px]"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <span className="text-white text-[0.875rem] font-medium">
          {city === "NYC"
            ? "NEW YORK"
            : city === "SF"
            ? "SAN FRANCISCO"
            : "LOS ANGELES"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-2 transition-transform duration-300 ${
            dropdownOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Dropdown options with animation */}
      <div
        className={`absolute left-0 mt-1 border-[1px] border-white bg-black w-full z-10 
                   transition-all duration-300 origin-top
                   ${
                     dropdownOpen
                       ? "opacity-100 scale-y-100 max-h-[500px]"
                       : "opacity-0 scale-y-0 max-h-0 overflow-hidden"
                   }`}
      >
        <div
          className="py-[0.375rem] px-2 uppercase hover:bg-white hover:text-black cursor-pointer text-[0.875rem] font-medium"
          onClick={() => {
            setCity("NYC");
            setDropdownOpen(false);
          }}
        >
          NEW YORK
        </div>
      </div>
    </div>
  );
};

export default MobileCityDropdown;

/*
<div
          className="py-[0.375rem] px-2 uppercase hover:bg-white hover:text-black text-gray-400 cursor-not-allowed text-[0.875rem] font-medium"
          //onClick={() => {
          //setCity("SF");
          //setDropdownOpen(false);
          //}}
        >
          SAN FRANCISCO
        </div>
        <div
          className="py-[0.375rem] px-2 uppercase hover:bg-white hover:text-black text-gray-400 cursor-not-allowed text-[0.875rem] font-medium"
          //onClick={() => {
          //setCity("LA");
          //setDropdownOpen(false);
          //}}
        >
          LOS ANGELES
        </div>*/
