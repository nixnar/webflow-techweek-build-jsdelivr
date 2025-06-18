import React from "react";

const FilterCategory = React.forwardRef(function FilterCategory(
  { children, text, filtered, onClickFunction },
  ref
) {
  return (
    <div
      id={text}
      className="flex flex-col gap-3 text-[1rem] font-[400] leading-[1.1] tracking-[-0.0281rem]"
      ref={ref}
    >
      <div className="flex gap-2">
        <div className="text-white">{text}</div>
        {filtered && (
          <button
            onClick={onClickFunction}
            className="transition-all duration-200 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-all duration-200 group-hover:rotate-90"
            >
              <path
                d="M0.726501 9.97656L0.0233765 9.27344L4.29291 5L0.0233765 0.730469L0.726501 0.0195312L4.99994 4.29297L9.26947 0.0195312L9.98041 0.730469L5.70697 5L9.98041 9.27344L9.26947 9.97656L4.99994 5.70703L0.726501 9.97656Z"
                fill="white"
              />
            </svg>
          </button>
        )}
      </div>
      {children}
    </div>
  );
});

export default FilterCategory;
