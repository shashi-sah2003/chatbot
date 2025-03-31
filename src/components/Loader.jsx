// components/Loader.jsx
"use client";
import { motion } from "framer-motion";
import React from "react";

const Loader = () => {
  // Define animations for the dots
  const dotVariants = {
    initial: { scale: 0.8, opacity: 0.4 },
    animate: { scale: 1, opacity: 1 }
  };

  // Define staggered transitions for the dots
  const dotTransition = (delay) => ({
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse",
    ease: "easeInOut",
    delay
  });

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Spinner ring */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div 
          className="w-16 h-16 rounded-full border-t-4 border-b-4 border-indigo-500/70"
          animate={{ 
            rotate: 360
          }}
          transition={{ 
            duration: 1.5, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        
        {/* Inner ring */}
        <motion.div 
          className="absolute top-1 left-1 w-14 h-14 rounded-full border-r-4 border-l-4 border-indigo-300/70"
          animate={{ 
            rotate: -360
          }}
          transition={{ 
            duration: 2, 
            ease: "linear", 
            repeat: Infinity 
          }}
        />
        
        {/* Center element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-indigo-400 rounded-full"
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