"use client";
import React, { useState, useEffect, useRef } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { streamChat } from "@/components/streamChatUtils";
import { useStreaming } from "./StreamingContext";

interface AnimatedHTMLTextProps {
  htmlString: string;
  speed?: number;
  isLoading?: boolean;
  onComplete?: () => void;
}

const AnimatedHTMLText: React.FC<AnimatedHTMLTextProps> = ({
  htmlString,
  speed = 10,
  isLoading = false,
  onComplete,
}) => {
  const [displayedHTML, setDisplayedHTML] = useState("");
  const completedRef = useRef(false);
  const { setIsStreaming, setIsStreamingComplete } = useStreaming();

  useEffect(() => {
    // Mark streaming as active when the component mounts.
    setDisplayedHTML("");
    setIsStreaming(true);
    setIsStreamingComplete(false);
    completedRef.current = false;

    const intervalId = streamChat(htmlString, setDisplayedHTML, speed, () => {
      if (!completedRef.current) {
        completedRef.current = true;
        // Once streaming is complete, update the context
        if (onComplete) onComplete();
        setIsStreaming(false);
        setIsStreamingComplete(true);
      }
    });
    return () => clearInterval(intervalId);
  }, [htmlString, speed, onComplete, setIsStreaming, setIsStreamingComplete]);

  const sanitizedHTML = DOMPurify.sanitize(displayedHTML);
  let parsedContent;
  try {
    parsedContent = parse(sanitizedHTML);
  } catch (error) {
    parsedContent = <span>{displayedHTML}</span>;
  }

  return (
    <div className="w-full">
      <div>{parsedContent}</div>
    </div>
  );
};

export default AnimatedHTMLText;
