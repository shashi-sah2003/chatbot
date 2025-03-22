"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import "prismjs/themes/prism-tomorrow.css";
import { streamChat } from "@/components/streamChatUtils";
import { useStreaming } from "./StreamingContext";

interface AnimatedMarkdownTextProps {
  markdownString: string;
  speed?: number;
  onComplete?: () => void;
}

const AnimatedMarkdownText: React.FC<AnimatedMarkdownTextProps> = ({
  markdownString,
  speed = 10,
  onComplete,
}) => {
  const [displayedMarkdown, setDisplayedMarkdown] = useState("");
  const completedRef = useRef(false);
  const { setIsStreaming, setIsStreamingComplete } = useStreaming();

  useEffect(() => {
    // Reset state and mark streaming as active.
    setDisplayedMarkdown("");
    setIsStreaming(true);
    setIsStreamingComplete(false);
    completedRef.current = false;

    const intervalId = streamChat(
      markdownString,
      setDisplayedMarkdown,
      speed,
      () => {
        if (!completedRef.current) {
          completedRef.current = true;
          if (onComplete) onComplete();
          setIsStreaming(false);
          setIsStreamingComplete(true);
        }
      }
    );
    return () => clearInterval(intervalId);
  }, [markdownString, speed, onComplete, setIsStreaming, setIsStreamingComplete]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
      components={{
        // Custom link handling
        a: ({ node, ...props }) => (
          <a {...props} target="_blank" rel="noopener noreferrer" />
        ),
        // Custom table handling
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto">
            <table {...props} className="min-w-full" />
          </div>
        ),
      }}
    >
      {displayedMarkdown}
    </ReactMarkdown>
  );
};

interface MarkdownRendererProps {
  content: string;
  speed?: number;
  isLoading?: boolean;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, speed }) => {
  return (
    <div className=" max-w-full p-0 m-0">
      <AnimatedMarkdownText markdownString={content} speed={speed} />
    </div>
  );
};

export default MarkdownRenderer;
