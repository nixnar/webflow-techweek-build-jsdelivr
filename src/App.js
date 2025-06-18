import React from "react";
import "./style.css";
import fetchData from "./FetchData";
import CitySelector from "./CitySelector";
import Filters from "./Filters";
import timeTodayOfWeek from "./utils/timetodayofweek";
import timeToAmPm from "./utils/timetoampm";
import sortFilters from "./utils/sortFilters";
import applyFilters from "./utils/applyFilters";
import MobileFilters from "./MobileFilters";
import MobileCityDropdown from "./MobileCityDropdown";
import IndividualEvent from "./IndividualEvent";

const afterNow = (date) => {
  // Get current date in NY timezone
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(now);
  
  // Extract parts by type instead of assuming array order
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;
  const todayString = `${year}-${month}-${day}`;

  // Get event date string (YYYY-MM-DD format) - events are already in NY timezone
  const eventString = date.split('T')[0];

  // Compare date strings directly - return true if event is today or in the future
  return eventString >= todayString;
};

const App = () => {
  const [data, setData] = React.useState([]);
  const [pastEvents, setPastEvents] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [city, setCity] = React.useState("NYC");
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [filterToggle, setFilterToggle] = React.useState(false);
  const [searchMode, setSearchMode] = React.useState(false);
  const [showPastEvents, setShowPastEvents] = React.useState(false);
  const [isValidEmail, setIsValidEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [availableFilters, setAvailableFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
    search: "",
  });
  const [activeFilters, setActiveFilters] = React.useState({
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
    search: "",
  });

  // Parse URL parameters on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("filter");
    //console.log(searchParam);
    if (searchParam) {
      setActiveFilters((prev) => ({
        ...prev,
        search: searchParam,
      }));
    }
  }, []);

  const submitForm = async (e) => {
    if (e) e.preventDefault();

    try {
      const response = await fetch("https://api.tech-week.com/submit_email/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
        credentials: "include",
      });

      const data = await response.json();
      //console.log(data);
      window.location.reload();
    } catch (error) {
      //console.error("Error:", error);
      setError("incognito");
    }
  };

  // Validate email input
  const validateEmail = (value) => {
    setEmail(value);
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    setIsValidEmail(emailPattern.test(value));
  };

  React.useEffect(() => {
    setActiveFilters((prev) => ({
      date: [],
      neighborhood: [],
      start_time: [],
      topics: [],
      types: [],
      search: prev.search,
    }));
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchData(city);

        // Check if result is the error code 10
        if (result === 10) {
          setIsLoading(false);
          setError("showForm");

          return;
        }

        result.find((event) => {
          if (event.id === "917cc4f0-3568-4738-951b-63093c8882f1") {
          } else if (event.id === "38614fde-35b0-43d8-8bf9-a05cb397ba76") {
            event.start_time = "2025-06-05T13:00:00";
          } else if (event.id === "f990bcfb-d089-4ea7-8b9b-63bf9d4ad80a") {
            event.start_time = "2025-06-03T17:30:00";
          }
        });

        // Separate past and current/future events
        const currentEvents = result.filter((event) => {
          return afterNow(event.start_time);
        });
        
        const pastEventsResult = result.filter((event) => {
          return !afterNow(event.start_time);
        });
        
        // Apply format transformations to both current and past events
        const formatEvents = (events) => {
          events.forEach((event) => {
            event.formats = event.formats.map((format) => {
              if (format.startsWith("B") || format.startsWith(" B")) {
                return "Breakfast, Brunch or Lunch";
              } else if (format.startsWith("Ha")) {
                return "Happy Hour";
              } else if (format.startsWith("Match")) {
                return "Matchmaking";
              } else if (format.startsWith("Pan")) {
                return "Panel / Fireside Chat";
              } else if (format.startsWith("Pitch")) {
                return "Pitch Event / Demo Day";
              } else if (
                format.startsWith("Round") ||
                format.startsWith("Work")
              ) {
                return "Roundtable / Workshop";
              }

              return format;
            });
            event.themes = event.themes.map((theme) => {
              if (theme.startsWith("Crypto") || theme.startsWith("Crpyto")) {
                return "Crypto / Web3";
              } else if (theme.startsWith("Deep")) {
                return "Deep Tech";
              } else if (theme.startsWith("GTM")) {
                return "GTM";
              } else if (theme.startsWith("International")) {
                return "International / Expansion";
              } else if (theme.startsWith("Men") || theme.startsWith("men")) {
                return "";
              }

              return theme;
            });
          });
        };

        formatEvents(currentEvents);
        formatEvents(pastEventsResult);

        // Separate events by tier
        const tier1Events = currentEvents.filter(
          (event) => event.starred_on_calendar === "TIER_1"
        );
        const tier2Events = currentEvents.filter(
          (event) => event.starred_on_calendar === "TIER_2"
        );

        const tier3Events = currentEvents.filter(
          (event) => event.starred_on_calendar === "TIER_3"
        );

        const regularEvents = currentEvents.filter(
          (event) =>
            !event.starred_on_calendar ||
            (event.starred_on_calendar !== "TIER_1" &&
              event.starred_on_calendar !== "TIER_2" &&
              event.starred_on_calendar !== "TIER_3")
        );

        // Randomize TIER_1 events
        for (let i = tier1Events.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tier1Events[i], tier1Events[j]] = [tier1Events[j], tier1Events[i]];
        }

        // Randomize TIER_2 events
        for (let i = tier2Events.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tier2Events[i], tier2Events[j]] = [tier2Events[j], tier2Events[i]];
        }

        // Randomize TIER_3 events
        for (let i = tier3Events.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tier3Events[i], tier3Events[j]] = [tier3Events[j], tier3Events[i]];
        }

        // Sort regular events by start time
        regularEvents.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );

        // Combine all events in the desired order
        const sortedResult = [
          ...tier3Events,
          ...tier1Events,
          ...tier2Events,
          ...regularEvents,
        ];
        // Apply time transformations after sorting
        sortedResult.forEach((item) => {
          item.day = timeTodayOfWeek(item.start_time);
          item.time = timeToAmPm(item.start_time);
        });

        // Sort and format past events (most recent first)
        const sortedPastEvents = pastEventsResult.sort(
          (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );
        sortedPastEvents.forEach((item) => {
          item.day = timeTodayOfWeek(item.start_time);
          item.time = timeToAmPm(item.start_time);
        });

        setData(sortedResult);
        setPastEvents(sortedPastEvents);
        setAvailableFilters(sortFilters(sortedResult));
      } catch (err) {
        setError(err.message);
        //console.error("Error fetching data:", err);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 100);
      }
    };

    loadData();
  }, [city]);

  //reset filtered data when city changes
  React.useEffect(() => {
    setFilteredData(data);
  }, [city]);

  // Update available filters based on showPastEvents
  React.useEffect(() => {
    if (showPastEvents && pastEvents.length > 0) {
      setAvailableFilters(sortFilters(pastEvents));
      // Clear active filters when switching to past events to avoid confusion
      setActiveFilters((prev) => ({
        date: [],
        neighborhood: [],
        start_time: [],
        topics: [],
        types: [],
        search: prev.search, // Keep search term
      }));
    } else if (data.length > 0) {
      setAvailableFilters(sortFilters(data));
      // Clear active filters when switching back to current events
      setActiveFilters((prev) => ({
        date: [],
        neighborhood: [],
        start_time: [],
        topics: [],
        types: [],
        search: prev.search, // Keep search term
      }));
    }
  }, [showPastEvents, pastEvents, data]);

  //filter data based on active filters
  React.useEffect(() => {
    const dataToFilter = showPastEvents ? pastEvents : data;
    let filtered = applyFilters(dataToFilter, activeFilters);
    // Apply custom sorting based on activeFilters.date
    if (filtered.length > 0) {
      // First separate events by tier
      const tier1Events = filtered.filter(
        (event) => event.starred_on_calendar === "TIER_1"
      );
      const tier2Events = filtered.filter(
        (event) => event.starred_on_calendar === "TIER_2"
      );
      const tier3Events = filtered.filter(
        (event) => event.starred_on_calendar === "TIER_3"
      );
      const regularEvents = filtered.filter(
        (event) =>
          !event.starred_on_calendar ||
          (event.starred_on_calendar !== "TIER_1" &&
            event.starred_on_calendar !== "TIER_2" &&
            event.starred_on_calendar !== "TIER_3")
      );

      // Randomize TIER_1 events (using a stable sort to maintain existing randomization)
      const sortedTier1 = [...tier1Events];
      const sortedTier3 = [...tier3Events];

      // Apply different sorting based on date filter status
      if (activeFilters.date.length > 0) {
        // When dates are selected: randomized tier_1, then randomized tier_2, then time sorted regular events
        const sortedTier2 = [...tier2Events];
        const sortedTier3 = [...tier3Events];
        const sortedRegular = [...regularEvents].sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );
        filtered = [
          ...sortedTier3,
          ...sortedTier1,
          ...sortedTier2,
          ...sortedRegular,
        ];
      } else {
        // When no dates selected: randomized tier_1, then time sorted all other events (including tier_2)
        const otherEvents = [...tier2Events, ...regularEvents].sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time)
        );
        filtered = [...sortedTier3, ...sortedTier1, ...otherEvents];
      }
    }
    //console.log(activeFilters);
    setFilteredData(filtered);
  }, [activeFilters, data, showPastEvents, pastEvents]);

  // Add resize event listener
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="tailwind">
      {isLoading ? (
        <div className="flex w-full justify-center text-white select-none">
          <div className="max-w-[1400px] grow flex flex-col gap-4">
            <div
              id="loading"
              className="border-[1px] border-white p-[4px] bg-black h-fit"
            >
              <div className="flex w-full justify-between items-center border-[1px] border-white p-[4px] sticky top-0 bg-black">
                <p className="w-full text-center text-xl uppercase text-white text-[1.65rem] font-[600] py-4">
                  Loading Amazing Events...
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : error === "showForm" ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/70"></div>
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="text-center text-white p-12 max-w-2xl">
              <div className="mb-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ENTER YOUR EMAIL TO ACCESS THE TECH WEEK 2025 CALENDAR
              </h2>
              <form className="mt-8 flex" onSubmit={(e) => submitForm(e)}>
                <input
                  id="email"
                  type="email"
                  placeholder="Register Email"
                  className="bg-white text-black p-3 flex-grow outline-none border-none"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className={`p-3 border border-white ${
                    isValidEmail
                      ? "bg-black text-white hover:bg-gray-900 cursor-pointer"
                      : "bg-gray-500 text-gray-300 cursor-not-allowed"
                  }`}
                  disabled={!isValidEmail}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : error === "incognito" ? (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          <div className="absolute inset-0 backdrop-blur-sm bg-black/70"></div>
          <div className="relative h-full w-full flex items-center justify-center">
            <div className="text-center text-white p-12 max-w-2xl">
              <div className="mb-8 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 16l2-7"></path>
                  <path d="M12 19h.01"></path>
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"></path>
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                ERROR DETECTED
              </h2>
              <p className="text-xl mb-6">
                Your email address maybe incorrect. You might be in incognito
                mode or blocked cookies.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-white text-black p-3 hover:bg-gray-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full justify-center text-white select-none">
          <div className="max-w-[1400px] grow flex flex-col gap-4">
            <div className="mobile:hidden">
              <div id="city" className="flex gap-4">
                <CitySelector
                  data={["NEW YORK", "JUN 02 - JUN 08"]}
                  setCity={setCity}
                  currentCity={city}
                  city={"NYC"}
                />
                <CitySelector
                  data={["SAN FRANCISCO", "OCT 06 - OCT 12"]}
                  //setCity={setCity}
                  currentCity={city}
                  city={"SF"}
                />
                <CitySelector
                  data={["LOS ANGELES", "OCT 13 - OCT 19"]}
                  //setCity={setCity}
                  currentCity={city}
                  city={"LA"}
                />
              </div>
            </div>

            <div id="contentAndFilters" className="flex gap-4 justify-between">
              <div className="flex flex-col gap-4 grow">
                {/*tier3Events.length > 0 && (
                  <div className="flex flex-col border-[1px] border-white p-[4px] bg-black h-fit">
                    <div className="grow border-[1px] border-white ml-[-1px] border-b-0">
                      {tier3Events.map((item) =>  
                        item.invite_url !== "Invite Only" ? (
                          <a href={item.invite_url} target="_blank">
                            <IndividualEvent
                              key={item.id}
                              item={item}
                              activeFilters={activeFilters}
                              windowWidth={windowWidth}
                              hasLink={true}
                              className=""
                            />
                          </a>
                        ) : (
                          <IndividualEvent
                            key={item.id}
                            item={item}
                            activeFilters={activeFilters}
                            windowWidth={windowWidth}
                            hasLink={false}
                            className="group-hover:"
                          />
                        )
                      )}
                    </div>
                  </div>
                ) }
                <div className="mb-[-0.5rem]">ALL EVENTS</div>*/}
                <div
                  id="content"
                  className="border-[1px] border-white p-[4px] bg-black h-fit"
                >
                  {windowWidth <= 1030 && (
                    <div className="flex w-full justify-between items-center border-[1px] border-white p-[4px] sticky top-0 bg-black">
                      <MobileCityDropdown city={city} setCity={setCity} />
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setSearchMode(true);
                            setFilterToggle(!filterToggle);
                          }}
                          className="uppercase font-medium text-[0.875rem] flex items-center gap-[0.375rem] py-[0.375rem] px-[0.5rem] text-black"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M5.25002 1.16663C3.00177 1.16663 1.16669 3.00171 1.16669 5.24996C1.16669 7.49821 3.00177 9.33329 5.25002 9.33329C6.26969 9.33329 7.20128 8.95297 7.91832 8.33069L8.16669 8.57906V9.33329L11.6667 12.8333L12.8334 11.6666L9.33335 8.16663H8.57912L8.33075 7.91825C8.95303 7.20121 9.33335 6.26963 9.33335 5.24996C9.33335 3.00171 7.49827 1.16663 5.25002 1.16663ZM5.25002 2.33329C6.86776 2.33329 8.16669 3.63222 8.16669 5.24996C8.16669 6.8677 6.86776 8.16663 5.25002 8.16663C3.63228 8.16663 2.33335 6.8677 2.33335 5.24996C2.33335 3.63222 3.63228 2.33329 5.25002 2.33329Z"
                              fill="white"
                            />
                          </svg>
                          {/*<p>SEARCH</p>*/}
                        </button>
                        <button
                          onClick={() => {
                            setSearchMode(false);
                            setFilterToggle(!filterToggle);
                          }}
                          className="uppercase font-medium text-[0.875rem] flex items-center gap-[0.375rem] py-[0.375rem] px-[0.5rem] bg-white text-black"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M2.625 1.75V3.47949C2.625 3.91016 2.83691 4.31348 3.19238 4.55957L6.125 6.78125V12.25L7.875 10.5V6.78125L10.8076 4.55957C11.1631 4.31348 11.375 3.91016 11.375 3.47949V1.75H2.625ZM3.5 2.625H10.5V3.47949C10.5 3.62305 10.4282 3.75635 10.3086 3.83838L10.3018 3.8418L7.29053 6.125H6.70947L3.69824 3.8418L3.69141 3.83838C3.57178 3.75635 3.5 3.62305 3.5 3.47949V2.625Z"
                              fill="black"
                            />
                          </svg>
                          <p>FILTERS</p>
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="grow border-[1px] border-white ml-[-1px]">
                    {filteredData.length > 0 ? (
                      Array.isArray(filteredData) &&
                      filteredData.map((item) => {
                        if (item.invite_url !== "Invite Only") {
                          return (
                            <a
                              key={item.id}
                              href={item.invite_url}
                              target="_blank"
                            >
                              <IndividualEvent
                                item={item}
                                activeFilters={activeFilters}
                                windowWidth={windowWidth}
                                hasLink={true}
                                className=""
                              />
                            </a>
                          );
                        } else {
                          return (
                            <IndividualEvent
                              key={item.id}
                              item={item}
                              activeFilters={activeFilters}
                              windowWidth={windowWidth}
                              hasLink={false}
                              className="group-hover:"
                            />
                          );
                        }
                      })
                    ) : (
                      <div className="w-full text-center text-white p-4">
                        NO EVENTS MATCH YOUR FILTERS
                      </div>
                    )}
                  </div>
                </div>
                <div className="grow" />
              </div>
              {windowWidth > 1030 ? (
                <div className="flex flex-col gap-4 relative">
                  <Filters
                    city={city}
                    setCity={setCity}
                    availableFilters={availableFilters}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    showPastEvents={showPastEvents}
                    setShowPastEvents={setShowPastEvents}
                  />
                  <div className="grow" />
                </div>
              ) : (
                filterToggle && (
                  <MobileFilters
                    city={city}
                    setCity={setCity}
                    availableFilters={availableFilters}
                    activeFilters={activeFilters}
                    setActiveFilters={setActiveFilters}
                    filterToggle={filterToggle}
                    setFilterToggle={setFilterToggle}
                    searchMode={searchMode}
                    showPastEvents={showPastEvents}
                    setShowPastEvents={setShowPastEvents}
                  />
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
