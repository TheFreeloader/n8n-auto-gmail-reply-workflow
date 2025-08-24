// Gmail Message Parser for n8n
// Use this in a Code node after your Gmail trigger

const items = $input.all();
const results = [];

for (const item of items) {
  const msg = item.json || {};

  // Extract headers from various possible locations
  const headers =
    msg.headers || msg.rawHeaders || (msg.payload && msg.payload.headers) || {};

  // Create lowercase header keys for easier access
  const h = {};
  Object.keys(headers || {}).forEach((k) => (h[k.toLowerCase()] = headers[k]));

  // Extract basic email information
  const from = (msg.From || msg.from || h["from"] || "").toString();
  const to = (msg.To || msg.to || h["to"] || "").toString();
  const subject = (msg.Subject || msg.subject || h["subject"] || "").toString();
  const snippet = msg.snippet || "";

  // Extract reply-to information
  let replyTo = (
    h["reply-to"] ||
    msg.replyTo ||
    msg.reply_to ||
    from ||
    ""
  ).toString();

  // Clean reply-to: strip angle brackets and whitespace
  replyTo = replyTo.replace(/^.*<([^>]+)>.*$/, "$1").trim();

  // Detection: check if forwarded by Resend
  const forwardedByResend =
    String(from).toLowerCase().includes("onboarding@resend.dev") ||
    Object.keys(h).some((k) => String(h[k]).toLowerCase().includes("resend"));

  // Loop protection: check for auto-reply headers
  const alreadyAutoReplied = !!(
    h["x-auto-reply"] ||
    h["auto-submitted"] ||
    h["x-autoreply"] ||
    h["x-autorespond"]
  );

  // Create fingerprint for duplicate detection
  const messageId = h["message-id"] || h["x-message-id"] || msg.id || null;
  const fingerprint =
    messageId || `${replyTo}|${subject}|${h["date"] || msg.internalDate || ""}`;

  // Determine if we should reply
  const shouldReply = forwardedByResend && !alreadyAutoReplied && !!replyTo;

  // Extract additional useful information
  const threadId = msg.threadId || "";
  const internalDate = msg.internalDate || "";
  const labels = msg.labels || [];
  const sizeEstimate = msg.sizeEstimate || 0;

  results.push({
    json: {
      // Email basics
      id: msg.id,
      threadId,
      from,
      to,
      subject,
      snippet,
      replyTo,

      // Processed information
      forwardedByResend,
      alreadyAutoReplied,
      shouldReply,

      // Identification
      messageId,
      fingerprint,

      // Metadata
      internalDate,
      labels,
      sizeEstimate,

      // Debug information
      rawHeaders: h,
      originalPayload: msg.payload,
    },
  });
}

return results;
