import React from "react";
import "./style.css";
import IndividualEvent from "./IndividualEvent";

const App = () => {
  const [error, setError] = React.useState(null);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const [isValidEmail, setIsValidEmail] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [futureEvents, setFutureEvents] = React.useState([]);
  const [pastEvents, setPastEvents] = React.useState([]);
  // Helper function to parse Webflow date format "10.15.2025 7:00 AM"
  const parseWebflowDate = (dateString) => {
    if (!dateString) return null;

    // Replace dots with slashes for better Date parsing
    // Convert "10.15.2025 7:00 AM" to "10/15/2025 7:00 AM"
    const formattedDate = dateString.replace(/\./g, "/");

    return new Date(formattedDate);
  };

  // Helper function to compare dates without time (only show as past when it's a different day)
  const isEventPastDay = (eventDate) => {
    if (!eventDate) return false;

    const today = new Date();
    const eventDateOnly = new Date(
      eventDate.getFullYear(),
      eventDate.getMonth(),
      eventDate.getDate()
    );
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    return eventDateOnly < todayDateOnly;
  };

  // Parse events from DOM structure under #allData
  React.useEffect(() => {
    const parseEventsFromDOM = () => {
      const allDataElement = document.getElementById("allData");
      if (!allDataElement) {
        console.log("no allDataElement");
        return false;
      }

      // Find all title elements (each represents one event)
      const titleElements = allDataElement.querySelectorAll('[id="title"]');
      if (titleElements.length === 0) {
        console.log("no title elements");
        return false;
      }

      const eventsData = [];

      titleElements.forEach((titleElement, index) => {
        // For each title element, find its sibling elements with the other IDs
        const parent = titleElement.parentElement;
        const descElement = parent.querySelector('[id="description"]');
        const timeElement = parent.querySelector('[id="time"]');
        const linkElement = parent.querySelector('[id="link"]');
        const speakersElement = parent.querySelector('[id="speakers"]');
        const hostsElement = parent.querySelector('[id="hosts"]');

        const eventData = {
          id: index + 1,
          title: titleElement.getAttribute("eventtitle") || "",
          time: timeElement?.getAttribute("eventtime") || "",
          description: descElement?.getAttribute("eventdescription") || "",
          link: linkElement?.getAttribute("eventlink") || "",
          speakers: speakersElement?.getAttribute("eventspeakers") || "",
          hosts: hostsElement?.getAttribute("eventhosts") || "",
        };

        //console.log("Event data for item", index + 1, ":", eventData);

        const eventDate = parseWebflowDate(eventData.time);
        eventData.pastEvent = eventDate ? isEventPastDay(eventDate) : false;

        eventsData.push(eventData);
      });
      console.log("eventsData", eventsData);

      // Sort all events by date
      //console.log("eventsData", eventsData);
      eventsData.sort((a, b) => {
        const dateA = parseWebflowDate(a.time);
        const dateB = parseWebflowDate(b.time);
        return dateA - dateB;
      });

      // Separate into future and past events
      const futureEvents = eventsData.filter((event) => !event.pastEvent);
      const pastEvents = eventsData.filter((event) => event.pastEvent);

      // Sort past events in reverse chronological order (most recent first)
      pastEvents.sort((a, b) => {
        const dateA = parseWebflowDate(a.time);
        const dateB = parseWebflowDate(b.time);
        return dateB - dateA;
      });

      setFutureEvents(futureEvents);
      setPastEvents(pastEvents);
      return true;
    };
    //console.log("futureEvents", futureEvents);

    // Try to parse immediately
    if (parseEventsFromDOM()) return;

    // If not available immediately, set up a simple polling mechanism
    const pollInterval = setInterval(() => {
      if (parseEventsFromDOM()) {
        clearInterval(pollInterval);
      }
    }, 100);

    // Clean up after 10 seconds to avoid infinite polling
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
    }, 10000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
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
      {error === "showForm" ? (
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
            <div id="nonPastEvents" className="flex gap-4 justify-between">
              <div className="flex flex-col grow">
                <div
                  id="content"
                  className="border-[1px] border-white p-[4px] bg-black h-fit"
                >
                  <div className="grow border-[1px] border-white ml-[-1px]">
                    {futureEvents.length > 0 &&
                      futureEvents.map((item) => {
                        return (
                          <IndividualEvent
                            item={item}
                            windowWidth={windowWidth}
                            hasLink={true}
                            className=""
                            pastEvent={item.pastEvent}
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="grow" />
              </div>
            </div>
            <div id="pastEvents" className="flex gap-4 justify-between">
              <div className="flex flex-col grow">
                <div
                  id="pastEventsContent"
                  className="border-[1px] border-white p-[4px] bg-black h-fit"
                >
                  <div className="grow border-[1px] border-white ml-[-1px]">
                    <div
                      className={`${
                        windowWidth < 1030 ? "px-4" : "px-6"
                      } py-3 border-b-[1px] border-white text-[1.125rem] font-[700] leading-[1.1] tracking-[-0.02813rem]`}
                    >
                      PAST EVENTS
                    </div>
                    {pastEvents.length > 0 &&
                      pastEvents.map((item) => {
                        return (
                          <IndividualEvent
                            item={item}
                            windowWidth={windowWidth}
                            hasLink={true}
                            className=""
                            pastEvent={item.pastEvent}
                          />
                        );
                      })}
                  </div>
                </div>
                <div className="grow" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
