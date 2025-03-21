export function extractTextFromHtml(htmlString: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}
