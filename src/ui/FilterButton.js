import React from "react";

export default function FilterButton({ text, onClick, isActive, isDisabled }) {
  return (
    <button
      className={`text-[14px] px-[8px] py-[6px] border-[1px] font-[400] transition-colors leading-[18px] tracking-[-0.4496px] ${
        isActive
          ? "bg-white text-black border-white hover:border-gray-200 hover:text-gray-900"
          : isDisabled
          ? "bg-transparent text-gray-500 border-gray-500 cursor-not-allowed"
          : "bg-transparent text-white border-white40 hover:border-gray-200 hover:text-gray-200"
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {text}
    </button>
  );
}
