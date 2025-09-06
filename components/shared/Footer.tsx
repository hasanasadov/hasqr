import HoverText from "./HoverText";
import React from "react";
import Link from "next/link";
import { CONTACT } from "@/constants/contact";

const Footer = () => {
  return (
    <div className="mb-12">
      <div className="w-full h-px dark:bg-white/30 bg-black rounded-2xl my-8"></div>
      <div className="flex flex-col md:flex-row text-[18px] md:text-[24px] gap-6">
        <div className="w-full md:w-1/2">
          <Link href={CONTACT.GMAIL} className="w-fit">
            <HoverText text="hasanaliasadov@gmail.com" />
          </Link>
        </div>
        <div className="w-full md:w-1/2 flex flex-col md:gap-4 gap-2">
          <Link className="w-fit" href={CONTACT.INSTAGRAM}>
            <HoverText text="Instagram" />
          </Link>
          <Link className="w-fit" href={CONTACT.LINKEDIN}>
            <HoverText text="LinkedIn" />
          </Link>
          <Link className="w-fit" href={CONTACT.FORM}>
            <HoverText text="Form" />
          </Link>
          <Link className="w-fit" href={CONTACT.GITHUB}>
            <HoverText text="GitHub" />
          </Link>
          <Link className="w-fit" href={CONTACT.WHATSAPP}>
            <HoverText text="Whatsapp" />
          </Link>
          <Link className="w-fit" href={CONTACT.PHONE}>
            <HoverText text="Phone" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
