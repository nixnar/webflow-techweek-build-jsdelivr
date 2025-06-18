export default async function fetchData(city) {
  try {
    const timestamp = new Date().getTime();
    const response2 = await fetch(
      `https://api.tech-week.com/list_events/?city=${city}&_=${timestamp}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (!response2.ok) {
      //console.log("not ok", response2);
    } else {
      const data = await response2.json();
      //console.log("ok", data);
      return data;
    }
  } catch (error) {
    return 10;
  }
}
