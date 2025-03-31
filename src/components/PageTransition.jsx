"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "./Loader";

const PageTransition = ({ children }) => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [prevPath, setPrevPath] = useState(pathname);
  const loaderStartTimeRef = useRef(0);
  const minLoaderTime = 400; // Slightly increased for a more polished feel

  // Listen for clicks on internal links, but ignore clicks that navigate to the current page.
  const handleNavigationStart = useCallback((e) => {
    const anchor = e.target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      // Only trigger loader for internal links (not hash links) and when navigating to a new page.
      if (
        href &&
        href.startsWith("/") &&
        !href.startsWith("#") &&
        href !== window.location.pathname
      ) {
        loaderStartTimeRef.current = Date.now();
        setLoading(true);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleNavigationStart);
    return () => {
      document.removeEventListener("click", handleNavigationStart);
    };
  }, [handleNavigationStart]);

  // Ensure the loader stays visible for a minimum time when the route changes.
  useEffect(() => {
    if (pathname !== prevPath) {
      const elapsed = Date.now() - loaderStartTimeRef.current;
      const remainingTime = Math.max(minLoaderTime - elapsed, 0);
      const timer = setTimeout(() => {
        setLoading(false);
        setPrevPath(pathname);
      }, remainingTime);
      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath]);

  // Listen for browser back/forward events.
  useEffect(() => {
    const handlePopState = () => {
      loaderStartTimeRef.current = Date.now();
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, minLoaderTime);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <>
      {/* Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/70 to-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="relative">
              <Loader />
              <motion.div
                className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-indigo-300 text-sm font-medium tracking-wider"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: [0, 1, 1], 
                  y: [10, 0, 0],
                  transition: { 
                    duration: 1.5, 
                    times: [0, 0.3, 1],
                    repeat: Infinity
                  }
                }}
              >
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Content with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 5 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            transition: { 
              delay: loading ? 0.2 : 0, 
              duration: 0.4,
              ease: "easeOut"
            } 
          }}
          exit={{ opacity: 0, y: -5, transition: { duration: 0.2 } }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PageTransition;