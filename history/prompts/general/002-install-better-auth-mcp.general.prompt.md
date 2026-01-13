---
id: 002
title: Install Better Auth MCP
stage: general
date: 2026-01-08
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: master
user: user
command: npx @better-auth/cli mcp --claude-code
labels: ["setup", "mcp", "better-auth"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - C:\Users\dell\.claude.json
tests:
  -
---

## Prompt

npx @better-auth/cli mcp --claude-code

## Response snapshot

Added HTTP MCP server better-auth with URL: https://mcp.chonkie.ai/better-auth/better-auth-builder/mcp to local config
File modified: C:Usersdell.claude.json [project: C:UsersdellOneDriveDesktophackathon2phase-2]

✓ Claude Code MCP installed successfully!

✨ Next Steps:
• The MCP server will be added to your Claude Code configuration
• You can now use Better Auth features directly in Claude Code

## Outcome

- ✅ Impact: Tooling setup completed
- 🧪 Tests: N/A
- 📁 Files: Updated global claude config
- 🔁 Next prompts: Use better-auth features
- 🧠 Reflection: Standard MCP installation command execution.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
