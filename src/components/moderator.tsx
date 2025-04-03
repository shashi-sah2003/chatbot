// Moderator function to filter out inappropriate or inefficient queries
export const moderateMessage = (message: string) => {
    const query = message.trim();
    
    // Check for empty messages
    if (!query) {
      return {
        shouldBlock: true,
        response: "Please enter a question about the university."
      };
    }
    
    // Check for messages with more than 200 characters
    if (query.length > 200) {
      return {
        shouldBlock: true,
        response: "Please keep your questions under 200 characters for better responses.",
        isToast: true
      };
    }

        
    // Check for offensive language (basic filter)
    const offensiveWords = ["damn", "shit", "fuck", "asshole", "bitch", "crap"];
    if (offensiveWords.some(word => query.toLowerCase().includes(word))) {
      return {
        shouldBlock: true,
        response: "I cannot process requests containing inappropriate language. Please be respectful."
      };
    }
      // Check for pronouns (which suggest context-dependent queries)
      const pronounRegex = /\b(they|them|their|he|him|his|she|her|hers|these|those)\b/i;
      if (pronounRegex.test(query)) {
        return {
          shouldBlock: true,
          response: "I cannot answer queries with pronouns as I don't maintain conversation context. Please provide a complete question with specific details."
        };
      }
    
    // Check for generic greetings/salutations
    const greetingsRegex = /^(hi|hello|hey|thanks|thank you|bye|goodbye|ok|okay)[.!?]?$/i;
    if (greetingsRegex.test(query)) {
      return {
        shouldBlock: true,
        response: query.toLowerCase().includes("thank") 
          ? "You're welcome! What else would you like to know about the university?"
          : query.toLowerCase().match(/bye|goodbye/i)
            ? "Goodbye! Feel free to return if you have more questions about the university."
            : "Hello! How can I help you with university information today?"
      };
    }

    // Check for messages with less than 3 words
    const wordCount = query.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 3) {
      return {
        shouldBlock: true,
        response: "Your query is too generic. Please provide more details about what you're looking for."
      };
    }
    
    
    
  
    
    // Check for repetitive characters/gibberish
    const repetitiveCharsRegex = /(.)\1{4,}/;
    if (repetitiveCharsRegex.test(query)) {
      return {
        shouldBlock: true,
        response: "Sorry, I couldn't understand that. Please ask a clear question about the university."
      };
    }

    
    // Check for emoji-only messages
    const emojiRegex = /[\p{Emoji}]/gu;
    const textWithoutEmojis = query.replace(emojiRegex, '').trim();
    if (textWithoutEmojis.length === 0 || textWithoutEmojis.length < query.length * 0.3) {
      return {
        shouldBlock: true,
        response: "Please use words to ask your question about the university."
      };
    }
    
    // Check for bot meta questions
    const botMetaKeywords = ["your name", "who are you", "who created you", "what are you"];
    if (botMetaKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return {
        shouldBlock: true,
        response: "I am a chatbot designed to help with information about the university, including results, notices, and past questions."
      };
    }
    
    // Check for general knowledge questions (out of scope)
    const generalKnowledgeKeywords = ["weather", "joke", "recipe", "movie", "capital of", "translate", "who won"];
    if (generalKnowledgeKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
      return {
        shouldBlock: true,
        response: "My apologies, I can only answer questions related to university data like results, notices, and past questions."
      };
    }
    
    // Check for URL/link spam
    const urlRegex = /^\s*(https?:\/\/|www\.)\S+\s*$/i;
    if (urlRegex.test(query)) {
      return {
        shouldBlock: true,
        response: "I cannot process links directly. Please ask your question using text."
      };
    }
    
    // If no conditions match, allow the query to proceed to the backend
    return {
      shouldBlock: false
    };
  };
  