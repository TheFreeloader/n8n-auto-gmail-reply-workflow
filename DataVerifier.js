const gmailData = $("Gmail Trigger").first().json;

// Extract email from snippet
const replyToMatch = gmailData.snippet?.match(/From\s+([^\s]+@[^\s]+)/);
const replyTo = replyToMatch ? replyToMatch[1] : null;

// Prepare data with fallbacks
const fingerprint =
  gmailData.id || gmailData.threadId || `fallback-${Date.now()}`;
const subject = gmailData.Subject || "No Subject";

// Debug logging
console.log("Code node debug:", {
  id: gmailData.id,
  threadId: gmailData.threadId,
  snippet: gmailData.snippet,
  subject: gmailData.Subject,
  extractedReplyTo: replyTo,
  finalFingerprint: fingerprint,
});

return [
  {
    json: {
      fingerprint,
      replyTo,
      subject,
      originalGmailData: gmailData, // for debugging
    },
  },
];
