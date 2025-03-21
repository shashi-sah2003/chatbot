import React from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

interface AIResponseProps {
  htmlString: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ htmlString }) => {
  const sanitizedHTML = DOMPurify.sanitize(htmlString);
  const parsedContent = parse(sanitizedHTML);

  return (
    <div className="w-full bg-[#2f2f2f] text-white pt-0 pl-4 pr-4 pb-0 rounded-lg">
      {parsedContent}
    </div>
  );
};

export default AIResponse;