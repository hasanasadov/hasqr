"use client";

import ContactForm from "@/app/(client)/contact/ContactForm";
import HoverText from "@/components/shared/HoverText";
import Footer from "@/components/shared/Footer";
import React from "react";
import Link from "next/link";
import { CONTACT } from "@/constants/contact";
import { motion } from "framer-motion";

// export const metadata = {
//   title: "Contact - Hasanali Asadov",
//   description: "Əlaqə səhifəsi - Hasanali Asadov portfolio.",
// };

const AboutPage = () => {
  const AboutPageHeroText =
    "If you prefer not to fill out forms, feel free to email me directly and let's talk about the next big thing!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-screen  md:p-8"
    >
      <h1 className="text-[26px] md:text-[36px] lg:text-[48px] leading-tight lg:w-8/12 mb-12">
        {AboutPageHeroText}
      </h1>

      <div className="flex flex-col md:flex-row md:gap-24 gap-6 justify-between w-full">
        <div className="md:w-1/3 w-full">
          <div className="w-full md:w-1/2 flex flex-col md:gap-4 gap-2 text-2xl">
            <Link href={CONTACT.GMAIL}>
              <HoverText text="hasanaliasadov@gmail.com" />
            </Link>
            <Link href={CONTACT.PHONE}>
              <HoverText text="+994 50 206 86 05" />
            </Link>
          </div>
        </div>
        <div className="md:w-2/3 w-full">
          <ContactForm />
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default AboutPage;
