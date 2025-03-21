"use client";
import React from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

interface AIResponseProps {
  htmlString: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ htmlString }) => {
  // Sanitize the HTML string first.
  const sanitizedHTML = DOMPurify.sanitize(htmlString);
  // Parse the sanitized HTML into React nodes.
  const parsedContent = parse(sanitizedHTML);

  return (
    <div className="w-full bg-[#212121] text-white pt-0 pl-4 pr-4 pb-0 rounded-lg">
      {parsedContent}
    </div>
  );
};

export default AIResponse;
