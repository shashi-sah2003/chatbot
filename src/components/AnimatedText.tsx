"use client";

import React, { useState, useEffect, useRef } from "react";
import { streamChat } from "@/components/streamChatUtils";
import { motion } from "framer-motion";
import { useStreaming } from "./StreamingContext";

interface AnimatedTextProps {
  text: string;
  speed?: number;
  isLoading?: boolean;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  speed = 10,
  isLoading = false,
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const completedRef = useRef(false);
  const { setIsStreaming, setIsStreamingComplete } = useStreaming();

  useEffect(() => {
    // Mark streaming as active when the component mounts.
    setIsStreaming(true);
    setIsStreamingComplete(false);
    setDisplayedText("");
    completedRef.current = false;

    const intervalId = streamChat(text, setDisplayedText, speed, () => {
      if (!completedRef.current) {
        completedRef.current = true;
        // Update the streaming state after completion.
        setIsStreaming(false);
        setIsStreamingComplete(true);
        if (onComplete) onComplete();
      }
    });

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete, setIsStreaming, setIsStreamingComplete]);

  const isComplete = displayedText === text;

  const loaderAnimation = (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
      }}
      className="flex items-center text-xs text-gray-400 mt-1"
    >
      {"Responding_back_from_server".split("").map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        ...
      </motion.span>
    </motion.div>
  );

  return (
    <div>
      <span>{displayedText}</span>
      {isLoading && !isComplete ? (
        loaderAnimation
      ) : (
        !isComplete && <span className="cursor animate-blink">|</span>
      )}
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 0.1s infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedText;
