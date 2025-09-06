"use client";

import { useEffect, useState } from "react";

export default function TimeZone({ className }: { className: string }) {
  const [timezone, setTimezone] = useState("");
  const [country, setCountry] = useState("");
  const [localTime, setLocalTime] = useState("");

  // Fetch timezone and country from IPAPI
  useEffect(() => {
    async function fetchGeoData() {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setTimezone(data.timezone);
        setCountry(data.country_name);
      } catch (err) {
        console.log("Failed to fetch geolocation data:", err);
      }
    }

    fetchGeoData();
  }, []);

  // Live clock
  useEffect(() => {
    if (!timezone) return;

    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // use true for AM/PM
      }).format(now);
      setLocalTime(formatted);
    };

    updateTime(); // run once immediately
    const interval = setInterval(updateTime, 1000); // update every second

    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className={`${className} flex gap-1`}>
      <span>{country || "Baku"} </span>
      <span className="font-bold">{"\t• \t "}</span>
      <span>{localTime || "00:00:00"} </span>
    </div>
  );
}
