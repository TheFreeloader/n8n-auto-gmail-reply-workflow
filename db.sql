CREATE TABLE IF NOT EXISTS resend_auto_replies (
  fingerprint TEXT PRIMARY KEY UNIQUE NOT NULL,
  reply_to TEXT,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);