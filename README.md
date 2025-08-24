# n8n-auto-gmail-reply-workflow

A concise README for the n8n workflow that auto-replies to messages forwarded by `onboarding@resend.dev`.

## Overview
This workflow listens for Gmail messages forwarded by `onboarding@resend.dev`, sends a templated HTML auto-reply to the original sender, and records a fingerprint in PostgreSQL to prevent duplicate replies.

## Requirements
- n8n (self-hosted or n8n cloud)
- Gmail account with OAuth2 credentials configured in n8n
- PostgreSQL database accessible from n8n
- Forwarding from `onboarding@resend.dev` to the Gmail account

## Quick setup
1. Import the workflow: In n8n go to Workflows → Import and choose `My workflow.json`.
2. Create and attach a Gmail OAuth2 credential to the **Gmail Trigger** and **Send Auto-Reply (Gmail)** nodes.
3. Create and attach a Postgres credential to the **Postgres - Check Dedupe** and **Postgres - Mark Replied** nodes.
4. Create the deduplication table in Postgres (SQL below).
5. Activate the workflow.

## Deduplication table (SQL)
Run once in your Postgres database:

```sql
CREATE TABLE IF NOT EXISTS resend_auto_replies (
	fingerprint TEXT PRIMARY KEY UNIQUE NOT NULL,
	reply_to TEXT,
	subject TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## How it works (short)
- Gmail Trigger polls for new messages.
- A function node parses headers and detects whether the message was forwarded by `onboarding@resend.dev` and extracts a reply-to address.
- The workflow checks Postgres for a matching fingerprint; if none, it sends the reply and records the fingerprint.

## Customization
- Edit the HTML template in **Send Auto-Reply (Gmail)** to change message content.
- Update the function node parsing logic if forwarded message format differs from what the node expects.

## Troubleshooting
- Verify Gmail and Postgres credentials in n8n.
- Confirm the dedupe table exists and the Postgres user has INSERT/SELECT privileges.
- Inspect the function node output and n8n execution logs for parsing/runtime errors.

## Notes
- This workflow is specifically tailored for forwards from `onboarding@resend.dev`. Adapt detection logic for other senders.