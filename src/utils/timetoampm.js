export default function timeToAmPm(time) {
  const dateObj = new Date(time);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const ampm = hours < 12 ? "AM" : "PM";
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight

  return `${displayHours}:${minutes} ${ampm}`;
}
