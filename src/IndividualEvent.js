import React from "react";
export default function IndividualEvent({
  item,
  windowWidth,
  hasLink,
  className,
  activeFilters,
}) {
  const isStarred =
    item.starred_on_calendar === "TIER_1" ||
    item.starred_on_calendar === "TIER_3" ||
    (item.starred_on_calendar === "TIER_2" && activeFilters.date.length > 0);

  return (
    <div
      key={item.id}
      className={`group flex flex-col w-full bg-black border-b-[1px] border-white ${
        windowWidth > 1030 ? "p-2 gap-[0.25rem]" : "p-2 gap-[0.25rem]"
      } ${
        item.starred_on_calendar === "TIER_3"
          ? "bg-gradient-to-br from-20% from-brand/20 to-90% to-black"
          : ""
      } `}
    >
      <div
        className={`flex w-full justify-between items-start gap-4 font-[500] tracking-[-0.45px] uppercase ${
          windowWidth > 1030
            ? "text-[0.75rem] leading-[0.75rem]"
            : "text-[0.5rem] leading-[0.5rem]"
        }`}
      >
        <div
          className={`flex ${
            windowWidth > 1030 ? "gap-3" : "gap-[0.25rem]"
          } justify-between items-center`}
        >
          <div
            className={`flex justify-center items-center ${
              windowWidth > 1030 ? "gap-2" : "gap-1"
            }`}
          >
            {isStarred && (
              <div className="flex justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="w-[12px] h-[12px] object-contain"
                >
                  <path
                    d="M9.9999 14.8972L15.6924 18.333L14.1816 11.858L19.2107 7.50134L12.5882 6.93967L9.9999 0.833008L7.41156 6.93967L0.789062 7.50134L5.81823 11.858L4.3074 18.333L9.9999 14.8972Z"
                    fill="#14E8FF"
                  />
                </svg>
              </div>
            )}
            <div className="text-brand text-pretty w-fit">
              {item.hosts.join(", ")}
            </div>
          </div>
          <div
            className={`${
              windowWidth > 1030 ? "text-[0.5rem]" : "text-[0.4rem]"
            }`}
          >
            |
          </div>
          <div className="text-grayText text-nowrap">
            {item.day} {item.time}
          </div>
        </div>
        <div className="text-grayText text-nowrap">{item.neighborhood}</div>
      </div>
      <div className="flex justify-between items-center gap-2">
        <div
          className={`${
            windowWidth > 1030 ? "text-[17px]" : "text-[0.75rem]"
          } font-[500] leading-[1.2] tracking-[-0.04rem] capitalize group-hover:text-[#aaa] ${className}`}
        >
          {item.event_name}
          {!hasLink && " (Invite Only)"}
        </div>
        <div className="flex-shrink-0 transition-all duration-300">
          {hasLink &&
            (windowWidth > 1030 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <mask
                  id="mask0_757_422387"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="14"
                  height="14"
                >
                  <rect width="14" height="14" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_757_422387)">
                  <path
                    d="M1.14397 14L0 12.856L11.2218 1.63424H0.92607V0H14V13.0739H12.3658V2.77821L1.14397 14Z"
                    fill="white"
                    className="group-hover:fill-brand"
                  />
                </g>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
              >
                <mask
                  id="mask0_590_355924"
                  style={{ maskType: "alpha" }}
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="10"
                  height="10"
                >
                  <rect
                    x="0.449951"
                    y="0.901245"
                    width="9.06889"
                    height="9.06889"
                    fill="#D9D9D9"
                  />
                </mask>
                <g mask="url(#mask0_590_355924)">
                  <path
                    d="M1.19099 9.97013L0.449951 9.2291L7.71918 1.95987H1.04984V0.901245H9.51884V9.37024H8.46021V2.70091L1.19099 9.97013Z"
                    fill="white"
                    className="group-hover:fill-brand"
                  />
                </g>
              </svg>
            ))}
        </div>
      </div>
    </div>
  );
}
