# YSHAI - System Workflow Documentation

This folder contains **sequence diagrams** that define the core workflows of YSHAI — an Arabic-first AI social media scheduler.

These diagrams are aligned with:

- ✅ SRS v2.0
- ✅ ER Diagram
- ✅ NestJS Module Architecture

## Diagrams

### 1. [sequence-create-post.mmd](diagrams/sequence-create-post.mmd)

→ User creates a post with AI-generated Arabic caption.

### 2. [sequence-oauth-login.mmd](diagrams/sequence-oauth-login.mmd)

→ OAuth login flow with JWT session management.

### 3. [sequence-publish-job.mmd](diagrams/sequence-publish-job.mmd)

→ Background worker publishes scheduled posts.

### 4. [sequence-approval-flow.mmd](diagrams/sequence-approval-flow.mmd)

→ Team-based post approval workflow.

### 5. [sequence-bulk-upload.mmd](diagrams/sequence-bulk-upload.mmd)

→ Upload CSV to schedule multiple posts at once.

### 6. [sequence-ai-moderation.mmd](diagrams/sequence-ai-moderation.mmd)

→ AI-generated content is checked for policy violations.

### 7. [sequence-subscription-payment.mmd](diagrams/sequence-subscription-payment.mmd)

→ User subscribes and pays via HyperPay/PayTabs.

### 8. [sequence-social-webhook.mmd](diagrams/sequence-social-webhook.mmd)

→ Social platform sends status update (e.g., post failed).

## How to View

- Open any `.mmd` file in [Mermaid Live Editor](https://mermaid.live)
- Or use VS Code with the **Mermaid Preview** extension

> 💡 Tip: Press `Ctrl+Click` to follow links in Mermaid Live Editor.
