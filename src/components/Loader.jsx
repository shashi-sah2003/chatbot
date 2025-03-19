// components/Loader.jsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

const Loader = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center"
      >
        <div className="blur-xl bg-white p-6 rounded-lg">
          <p>Loading...</p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Loader;
