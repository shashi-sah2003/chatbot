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

function getWordEndPositions(text: string, offset: number): number[] {
  const ends: number[] = [];
  const regex = /\S+\s*/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    ends.push(offset + match.index + match[0].length);
  }
  return ends;
}

function getStreamPositions(text: string, linkRanges: { start: number; end: number }[]): number[] {
  const positions: number[] = [];
  let prevEnd = 0;
  for (const range of linkRanges) {
    const beforeLink = text.slice(prevEnd, range.start);
    const wordEnds = getWordEndPositions(beforeLink, prevEnd);
    positions.push(...wordEnds);
    positions.push(range.end);
    prevEnd = range.end;
  }
  const afterLastLink = text.slice(prevEnd);
  const remainingWordEnds = getWordEndPositions(afterLastLink, prevEnd);
  positions.push(...remainingWordEnds);
  if (positions.length === 0 || positions[positions.length - 1] < text.length) {
    positions.push(text.length);
  }
  return positions;
}

/**
 * Streams the fullText, displaying text word by word and adding full link syntax at once.
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
  const positions = getStreamPositions(fullText, linkRanges);
  let posIndex = 0;

  const intervalId = setInterval(() => {
    if (!shouldContinue()) {
      clearInterval(intervalId);
      return;
    }
    if (posIndex < positions.length) {
      const index = positions[posIndex];
      onUpdate(fullText.slice(0, index));
      posIndex++;
    } else {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, speed);

  return intervalId;
};