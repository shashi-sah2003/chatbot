"use client";
import { motion, Transition } from "framer-motion";
import React from "react";

const Loader: React.FC = () => {
  // Define animations for the dots
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.4 },
    animate: { scale: 1, opacity: 1 },
  };

  // Define staggered transitions for the dots with a delay parameter typed as a number.
  const dotTransition = (delay: number): Transition => ({
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay,
  });

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Spinner ring - responsive sizes */}
      <div className="relative">
        {/* Outer ring - responsive sizes based on screen */}
        <motion.div 
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-t-3 sm:border-t-4 border-b-3 sm:border-b-4 border-indigo-500/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
        />
        
        {/* Inner ring - responsive sizes based on screen */}
        <motion.div 
          className="absolute top-1 left-1 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full border-r-3 sm:border-r-4 border-l-3 sm:border-l-4 border-indigo-300/70"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, ease: "linear", repeat: Infinity }}
        />
        
        {/* Center element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full"
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={dotTransition(i * 0.15)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
