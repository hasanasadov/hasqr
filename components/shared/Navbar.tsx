"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTimeZoneString } from "@/hooks/useTimeZone";
import { usePathname } from "next/navigation";
import { PATHS } from "@/constants/paths";
import AutoAnimate from "./AutoAnimate";
import HoverText from "./HoverText";
import ArrowLeft from "../ui/ArrowLeft";
import RenderIf from "@/utils/RenderIf";
import TimeZone from "./TimeZone";
import Switch from "./Toggle";
import Link from "next/link";

const Navbar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const timeZoneStr = useTimeZoneString();
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setShowNavbar(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`
        ${isHomePage ? "block" : "sticky"}
        backdrop-blur-[3px]
         top-0 left-0 w-full z-50 transition-transform duration-300
        ${showNavbar ? "translate-y-0" : "-translate-y-full"}
        ${!isHomePage ? "md:px-8-" : ""}
        flex items-center justify-between h-[60px] bg-transparent
      `}
      style={{ willChange: "transform", transition: "all 0.5s ease-in-out" }}
    >
      <div className="flex items-center gap-8 md:gap-12 lg:gap-[100px] text-[14px] md:text-[16px] ">
        <Link
          href={`${PATHS.HOME}`}
          className="whitespace-nowrap flex items-center gap-2 cursor-pointer overflow-hidden"
        >
          <RenderIf condition={!!isHomePage}>
            <HoverText text="Hasanali Asadov" />
          </RenderIf>
          <RenderIf condition={!isHomePage}>
            <ArrowLeft />
            <HoverText text={"Home"} />
          </RenderIf>
        </Link>
        <div className="whitespace-nowrap">
          <div className="hidden md:inline-block">Qr Code Generator</div>
          <div className="inline-block md:hidden">
            <AutoAnimate text="Qr Code Generator" text2={timeZoneStr} />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-[100px]">
        <TimeZone className="hidden md:flex" />
        <div className="min-w-12">
          <Switch />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
