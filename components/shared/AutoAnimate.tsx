"use client";
import { motion, easeOut, easeIn } from "framer-motion";
import { useEffect, useState } from "react";

const AutoAnimate = ({
  text,
  text2,
  interval = 4000,
}: {
  text: string;
  text2?: string;
  interval?: number;
}) => {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setHovered((prev) => !prev);
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

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
    <div className="relative inline-block cursor-default">
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
            {text[i] || ""}
          </motion.span>
        ))}
      </span>

      {/* Bottom Layer: New Text on "hover" */}
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

export default AutoAnimate;
