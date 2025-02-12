"use client";
import React, { useState, useEffect } from "react";

interface AnimatedTextProps {
  text: string;
  interval?: number; // Delay (in milliseconds) between each word
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, interval = 200 }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Compute the words array inside the effect to avoid unnecessary re-runs.
    const words = text.split(" ");
    setDisplayedText(""); // Reset the displayed text when 'text' changes
    let currentWordIndex = 0;

    const timer = setInterval(() => {
      setDisplayedText((prev) =>
        prev ? `${prev} ${words[currentWordIndex]}` : words[currentWordIndex]
      );
      currentWordIndex++;

      // Once all words have been displayed, clear the timer.
      if (currentWordIndex >= words.length) {
        clearInterval(timer);
      }
    }, interval);

    // Cleanup the interval if the component unmounts or text/interval changes.
    return () => clearInterval(timer);
  }, [text, interval]);

  return <>{displayedText}</>;
};

export default AnimatedText;
