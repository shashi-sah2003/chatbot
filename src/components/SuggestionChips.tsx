"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import routeSuggestions from "@/utils/querySuggestions";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

interface SuggestionChipsProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const SuggestionChips = ({ onSelectSuggestion }: SuggestionChipsProps) => {
  const pathname = usePathname();
  const allSuggestions = routeSuggestions[pathname as keyof typeof routeSuggestions] || routeSuggestions["/"];
  
  const [currentBatch, setCurrentBatch] = useState(0);
  const suggestionCount = 4;
  
  const batchCount = Math.ceil(allSuggestions.length / suggestionCount);
  
  const startIndex = currentBatch * suggestionCount;
  const currentSuggestions = allSuggestions.slice(startIndex, startIndex + suggestionCount);
  
  const showNextBatch = () => {
    setCurrentBatch((prev) => (prev + 1) % batchCount);
  };
  
  const showRefreshButton = allSuggestions.length > suggestionCount;
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap gap-2 mt-6 mb-2 justify-center">
        {currentSuggestions.map((suggestion, index) => (
          <button
            key={`${currentBatch}-${index}`}
            onClick={() => onSelectSuggestion(suggestion)}
            className="bg-zinc-700 hover:bg-zinc-600 text-white text-sm px-4 py-2 rounded-full transition-colors"
          >
            {suggestion.length > 60 ? suggestion.substring(0, 27) + "..." : suggestion}
          </button>
        ))}
      </div>
      
      {showRefreshButton && (
        <button 
          onClick={showNextBatch}
          className="mt-2 text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm"
          aria-label="Show more suggestions"
        >
          <ArrowPathIcon className="h-3 w-3" /> 
          More suggestions
        </button>
      )}
    </div>
  );
};

export default SuggestionChips;