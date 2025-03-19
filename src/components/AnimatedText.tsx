"use client";
import React, { useState, useEffect, useRef } from "react";
import { streamChat } from "@/components/streamChatUtils"; // Adjust the path as needed

interface AnimatedTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, speed = 20, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const completedRef = useRef(false);

  useEffect(() => {
    // Reset text when a new string is passed in
    setDisplayedText("");
    completedRef.current = false;
    const intervalId = streamChat(text, setDisplayedText, speed, () => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete && onComplete();
      }
    });
    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  const isComplete = displayedText === text;

  return (
    <>
      <span>{displayedText}</span>
      {!isComplete && <span className="cursor animate-blink">|</span>}
      <style jsx>{`
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </>
  );
};

export default AnimatedText;
