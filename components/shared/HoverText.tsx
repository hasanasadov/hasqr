"use client";
import { motion, easeOut, easeIn } from "framer-motion";
import { useState } from "react";

const HoverText = ({
  text,
  text2,
  hovered: hoveredFromParent,
}: {
  text: string;
  text2?: string;
  hovered?: boolean;
}) => {
  const [localHovered, setLocalHovered] = useState(false);
  const hovered = hoveredFromParent ?? localHovered;

  const letters = text.split("");
  const letters2 = text2 ? text2.split("") : letters;
  const maxLength = Math.max(letters.length, letters2.length);
  const baseDelay = 0.01;

  const hoverUpVariants = {
    initial: () => ({ y: 0, opacity: 1 }),
    animate: (i: number) => ({
      y: -20,
      opacity: 0,
      transition: {
        delay: i * baseDelay,
        duration: 0.25,
        ease: easeOut,
      },
    }),
  };

  const returnDownVariants = {
    initial: () => ({ y: -20, opacity: 0 }),
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * baseDelay + 0.05,
        duration: 0.25,
        ease: easeOut,
      },
    }),
  };

  const enterVariants = {
    initial: () => ({ y: 20, opacity: 0 }),
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * baseDelay + 0.01,
        duration: 0.25,
        ease: easeOut,
      },
    }),
    exit: (i: number) => ({
      y: 20,
      opacity: 0,
      transition: {
        delay: i * baseDelay,
        duration: 0.25,
        ease: easeIn,
      },
    }),
  };

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => {
        if (hoveredFromParent === undefined) setLocalHovered(true);
      }}
      onMouseLeave={() => {
        if (hoveredFromParent === undefined) setLocalHovered(false);
      }}
    >
      {/* Top Layer: Original Text */}
      <span className="absolute top-0 left-0 whitespace-pre">
        {Array.from({ length: maxLength }).map((_, i) => (
          <motion.span
            key={`main-${i}`}
            custom={i}
            variants={hovered ? hoverUpVariants : returnDownVariants}
            initial="initial"
            animate="animate"
            className="inline-block"
          >
            {letters[i] || ""}
          </motion.span>
        ))}
      </span>

      {/* Bottom Layer: New Text on Hover */}
      <span className="relative whitespace-pre">
        {Array.from({ length: maxLength }).map((_, i) => (
          <motion.span
            key={`clone-${i}`}
            custom={i}
            variants={enterVariants}
            initial="initial"
            animate={hovered ? "animate" : "exit"}
            className="inline-block"
          >
            {letters2[i] || ""}
          </motion.span>
        ))}
      </span>
    </div>
  );
};

export default HoverText;
