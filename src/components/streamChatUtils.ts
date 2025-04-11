/**
 * Streams the fullText by tokens (words and preserved whitespace), ensuring that markdown links are streamed as a whole.
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
  speed: number = 20,
  onComplete?: () => void,
  shouldContinue: () => boolean = () => true
): NodeJS.Timeout => {
  // Regex to capture full markdown links
  const linkRegex = /(\[[^\]]+\]\([^)]+\))/g;
  let tokens: string[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Process the markdown text to separate plain tokens from link tokens.
  while ((match = linkRegex.exec(fullText)) !== null) {
    // Extract plain text before the link, if any.
    if (match.index > lastIndex) {
      const plainText = fullText.slice(lastIndex, match.index);
      // Split plain text into tokens (words and whitespace)
      const plainTokens = plainText.split(/(\s+)/).filter(token => token !== "");
      tokens.push(...plainTokens);
    }
    // Add the full link as a single token.
    tokens.push(match[0]);
    lastIndex = linkRegex.lastIndex;
  }
  
  // Process any trailing plain text after the last link.
  if (lastIndex < fullText.length) {
    const plainText = fullText.slice(lastIndex);
    const plainTokens = plainText.split(/(\s+)/).filter(token => token !== "");
    tokens.push(...plainTokens);
  }

  // Begin streaming tokens one by one.
  let index = 0;
  let accumulatedText = "";
  const intervalId = setInterval(() => {
    if (!shouldContinue()) {
      clearInterval(intervalId);
      return;
    }
    if (index < tokens.length) {
      // Append the next token (whether it's a word, whitespace, or a complete link).
      accumulatedText += tokens[index];
      index++;
      onUpdate(accumulatedText);
    } else {
      clearInterval(intervalId);
      if (onComplete) onComplete();
    }
  }, speed);
  
  return intervalId;
};
