import React from "react";
export default function IndividualEvent({
  item,
  windowWidth,
  hasLink,
  className,
  pastEvent,
}) {
  const hosts = item.hosts ? item.hosts.split("|") : [];

  const formattedTime = (time) => {
    if (!time) return "Time TBD";

    const date = parseCustomDate(time);
    //console.log("date", date);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Time TBD";
    }

    // Get month abbreviation
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];

    // Get day with proper ordinal suffix
    const day = date.getDate();
    // Get time in 12-hour format
    let hour = date.getHours();
    const minute = date.getMinutes();
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 should be 12
    const formattedMinute = minute < 10 ? "0" + minute : minute;

    return `${month.toUpperCase()} ${day}, ${hour}:${formattedMinute} ${ampm}`;
  };

  function parseCustomDate(dateStr) {
    // Example input: "7.22.2025 5:00 PM"
    const match = dateStr.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4}) (\d{1,2}):(\d{2}) (AM|PM)$/);
    if (!match) return null;
    let [, month, day, year, hour, minute, ampm] = match;
    month = parseInt(month, 10) - 1; // JS months are 0-based
    day = parseInt(day, 10);
    year = parseInt(year, 10);
    hour = parseInt(hour, 10);
    minute = parseInt(minute, 10);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return new Date(year, month, day, hour, minute);
  }

  function getSpeakers(speakers) {
    if (speakers.includes("|")) {
      return speakers.replace("|", ", ");
    }
    return speakers;
  }

  return (
    <div
      key={item.title}
      className={`border-b-[1px] border-white flex flex-col ${
        windowWidth < 1030 ? "p-3" : "p-6"
      }`}
    >
      <div
        className={`flex justify-start flex-col gap-1.5 text-[1.125rem] font-[700] leading-[1.1] tracking-[-0.02813rem] ${
          windowWidth < 1030 ? "gap-0.75" : ""
        }`}
      >
        <div
          id="firstLine"
          className={`flex items-center gap-4 ${
            windowWidth < 1030 ? "text-[0.75rem] gap-2" : ""
          }`}
        >
          <div className="flex gap-2" id="hosts">
            {hosts.map((host) => (
              <p
                key={host}
                className="bg-gradient-to-r from-[#d9e361] to-[#65d9b5] bg-clip-text text-transparent uppercase"
              >
                {host}
              </p>
            ))}
          </div>
          <div>|</div>
          <div id="date">
            <p className="text-nowrap">
              {console.log("item.time", item.time)}
              {formattedTime(item.time)}
            </p>
          </div>
        </div>
        <div id="secondLine" className="flex items-center gap-4">
          <div
            id="speakers"
            className={`uppercase`}
          >
            <p className={`uppercase leading-[1.3] text-[1.5rem] font-[600] ${windowWidth < 1030 ? "text-[1.25rem]" : ""
              }`}
            >
              {getSpeakers(item.speakers)}
            </p>
          </div>
        </div>
        <div id="thirdLine" className="flex items-center gap-4">
          <p
            className={`text-[1.375rem] leading-[1.2] tracking-[-0.04rem] font-[500] ${
              windowWidth < 1030 ? "text-[1.25rem]" : ""
            }`}
          >
            {item.title}
          </p>
        </div>
        <div
          id="fourthLine"
          className="flex items-center gap-4 max-w-[53rem] font-[400] text-[1.25rem] leading-[1.35] tracking-[-0.0375rem]"
        >
          <p>{item.description}</p>
        </div>
        {!pastEvent && (
          <a
            href={item.link}
            target="_blank"
            className={`flex items-center justify-center gap-3 w-fit bg-white text-black px-3 py-[0.37rem] ${
              windowWidth < 1030 ? "mt-2" : "mt-4"
            } hover:bg-[#2cd4df] transition-all duration-300 text-[1rem] leading-[1.35] tracking-[0.0395rem]`}
          >
            <p className="translate-y-[0.03rem]">REGISTER NOW</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="9"
              height="25"
              viewBox="0 0 9 25"
              fill="none"
            >
              <g clip-path="url(#clip0_3588_153966)">
                <path
                  d="M1.70459 18.664L7.63376 12.7348L1.70459 6.80566"
                  stroke="black"
                  stroke-width="1.97639"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3588_153966">
                  <rect
                    width="7.90556"
                    height="23.7167"
                    fill="white"
                    transform="translate(0.716797 0.876465)"
                  />
                </clipPath>
              </defs>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
