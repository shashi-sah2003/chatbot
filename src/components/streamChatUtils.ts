/**
 * Finds the start and end positions of all markdown links in the text.
 * @param text - The markdown string to parse.
 * @returns An array of objects with start and end indices of each link.
 */
function getLinkRanges(text: string): { start: number; end: number }[] {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g; // Matches [label](url)
  const ranges = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    ranges.push({ start: match.index, end: regex.lastIndex });
  }
  return ranges;
}

/**
 * Streams the fullText, displaying only labels during animation and adding full link syntax at once.
 * @param fullText - The complete markdown string to stream.
 * @param onUpdate - Callback to update the displayed text.
 * @param speed - Interval (in milliseconds) between updates.
 * @param onComplete - Optional callback when streaming is complete.
 * @param shouldContinue - Function to check if streaming should continue.
 * @returns The interval ID.
 */
export const streamChat = (
  fullText: string,
  onUpdate: (partialText: string) => void,
  speed: number = 10,
  onComplete?: () => void,
  shouldContinue: () => boolean = () => true
): NodeJS.Timeout => {
  const linkRanges = getLinkRanges(fullText);
  let index = 0;
  const intervalId = setInterval(() => {
    if (!shouldContinue()) {
      clearInterval(intervalId);
      return;
    }

    // Check if the current index is the start of a link
    const currentLink = linkRanges.find((range) => range.start === index);
    if (currentLink) {
      // If at the start of a link, jump to the end to include the full link
      index = currentLink.end;
    } else {
      // Otherwise, increment by one character
      index++;
    }

    onUpdate(fullText.slice(0, index));

    if (index >= fullText.length) {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, speed);
  return intervalId;
};