export default function applyFilters(data, activeFilters) {
  // Check if any filters are active
  const hasActiveFilters = Object.entries(activeFilters).some(
    ([key, value]) => {
      if (key === "search" && typeof value === "string") {
        return value.trim() !== ""; // For search, check if string is not empty
      }
      return Array.isArray(value) && value.length > 0; // For array filters, check length
    }
  );

  if (!hasActiveFilters) {
    return data;
  }

  return data.filter((item) => {
    // For each filter category (date, neighborhood, etc.)
    return Object.keys(activeFilters).every((filterCategory) => {
      // Handle search differently since it's a string, not an array
      if (filterCategory === "search") {
        // If search is empty, don't filter
        if (!activeFilters.search || activeFilters.search.trim() === "") {
          return true;
        }

        // Search in event name, hosts, and any other relevant fields
        const searchTerm = activeFilters.search.toLowerCase();
        return (
          item.event_name.toLowerCase().includes(searchTerm) ||
          (item.hosts &&
            item.hosts.some((host) =>
              host.toLowerCase().includes(searchTerm)
            )) ||
          (item.neighborhood &&
            item.neighborhood.toLowerCase().includes(searchTerm))
        );
      }

      // For non-search filters (arrays)
      if (
        !activeFilters[filterCategory] ||
        activeFilters[filterCategory].length === 0
      ) {
        return true;
      }

      // Handle different categories
      switch (filterCategory) {
        case "date":
          return activeFilters.date.includes(item.day);

        case "neighborhood":
          return activeFilters.neighborhood.includes(item.neighborhood);

        case "start_time":
          return activeFilters.start_time.includes(item.time);

        case "topics":
          // Check if any of the item's themes match any selected topic filters
          return (
            item.themes &&
            item.themes.some((theme) => activeFilters.topics.includes(theme))
          );

        case "types":
          // Check if any of the item's formats match any selected type filters
          return (
            item.formats &&
            item.formats.some((format) => activeFilters.types.includes(format))
          );

        default:
          return true;
      }
    });
  });
}
