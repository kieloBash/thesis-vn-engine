export const extractConversation = (str: string) => {
  // Match the text inside double quotes
  const quotedTextMatch = str.match(/"([^"]*)"/);
  const quotedText = quotedTextMatch ? quotedTextMatch[1] : "";

  // Extract the text before the quoted text
  const beforeQuotesMatch = str.match(/^(.*?)"/);
  const withoutQuotes = beforeQuotesMatch ? beforeQuotesMatch[1].trim() : "";

  let speaker = withoutQuotes;
  let altName = "";

  // Split the speaker text based on "as"
  const asMatch = withoutQuotes.match(/(.*) as (.*)/);
  if (asMatch) {
    speaker = asMatch[1].trim();
    altName = asMatch[2].trim();
  }

  return { dialogue: quotedText, speaker, altName };
};
