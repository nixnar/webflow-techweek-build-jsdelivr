export default function sortFilters(result) {
  const newFilters = {
    date: [],
    neighborhood: [],
    start_time: [],
    topics: [],
    types: [],
  };
  result.forEach((item) => {
    if (!newFilters.date.includes(item.day)) {
      newFilters.date.push(item.day);
    }
    if (
      item.neighborhood &&
      !newFilters.neighborhood.includes(item.neighborhood)
    ) {
      newFilters.neighborhood.push(item.neighborhood);
    }
    if (!newFilters.start_time.includes(item.time)) {
      newFilters.start_time.push(item.time);
    }

    if (item.themes) {
      item.themes.forEach((theme) => {
        if (!newFilters.topics.includes(theme) && theme !== "") {
          newFilters.topics.push(theme);
        }
      });
    }

    if (item.formats) {
      item.formats.forEach((format) => {
        if (!newFilters.types.includes(format) && format !== "") {
          newFilters.types.push(format);
        }
      });
    }
  });

  // Custom sort for days of the week (Monday first, Sunday last)
  const dayOrder = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
    Sunday: 7,
  };

  newFilters.date.sort((a, b) => {
    return dayOrder[a] - dayOrder[b];
  });

  // Custom sort for time (AM first, PM last)
  newFilters.start_time.sort((a, b) => {
    // Helper function to convert time string to minutes since midnight
    const timeToMinutes = (timeStr) => {
      const [time, period] = timeStr.split(" ");
      const [hour, minute] = time.split(":").map(Number);

      let hours24 = hour;
      if (period === "AM") {
        if (hour === 12) hours24 = 0; // 12 AM is midnight
      } else {
        // PM
        if (hour !== 12) hours24 = hour + 12; // 12 PM stays 12, others add 12
      }

      return hours24 * 60 + minute;
    };

    return timeToMinutes(a) - timeToMinutes(b);
  });

  // Standard alphabetical sort for other filters
  newFilters.neighborhood.sort();
  newFilters.topics.sort();
  newFilters.types.sort();

  return newFilters;
}
