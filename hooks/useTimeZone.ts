import { useEffect, useState } from "react";

export function useTimeZoneString(): string {
  const [localTimeString, setLocalTimeString] = useState("...");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    async function fetchAndStartClock() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const timezone = data.timezone;
        const country = data.country_name;

        const updateTime = () => {
          const now = new Date();
          const formatted = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }).format(now);

          setLocalTimeString(`${country} • ${formatted}`);
        };

        updateTime();
        interval = setInterval(updateTime, 1000);
      } catch (error) {
        console.log(error);
        setLocalTimeString("Baku • 00:00:00");
      }
    }

    fetchAndStartClock();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  return localTimeString;
}
