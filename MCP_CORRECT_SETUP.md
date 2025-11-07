# ✅ Playwright MCP Server - CORRECT Setup Guide

**Date:** 2025-11-07
**Package:** `@playwright/mcp` (Official Microsoft package)
**Status:** Ready to install

---

## Quick Setup (15 minutes)

### Step 1: Install Playwright MCP (Official Package)

```bash
# The CORRECT package is @playwright/mcp (NOT @modelcontextprotocol/server-playwright)
npm install -g @playwright/mcp

# Or run without installation using npx
npx @playwright/mcp@latest --version
```

**Verification:**
```bash
npm list -g @playwright/mcp
# Should show: @playwright/mcp@0.0.45 or later
```

---

### Step 2: Configure Claude Desktop

**Create/Edit:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend"
      }
    }
  }
}
```

**Alternative (if globally installed):**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "@playwright/mcp",
      "args": [],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend"
      }
    }
  }
}
```

**Create config directory and file:**
```bash
# Create directory
mkdir -p ~/.config/Claude

# Create config file
cat > ~/.config/Claude/claude_desktop_config.json <<'EOF'
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend"
      }
    }
  }
}
EOF

# Verify file was created
cat ~/.config/Claude/claude_desktop_config.json
```

---

### Step 3: Restart Claude Desktop

```bash
# Kill Claude Desktop process
pkill -f "Claude"

# Wait a moment
sleep 2

# Restart Claude Desktop
# (Use your application launcher or menu)
```

---

### Step 4: Verify MCP Tools Available

**In Claude Desktop, ask:**
```
List all available MCP tools for Playwright
```

**Expected tools (from @playwright/mcp):**
- Browser automation capabilities
- Page navigation
- Element interaction
- Screenshot capture
- Accessibility tree access
- JavaScript evaluation

**Or directly test:**
```
Can you use Playwright MCP to navigate to https://example.com?
```

---

## Package Information

### Official Package: @playwright/mcp

**Source:** https://github.com/microsoft/playwright-mcp
**NPM:** https://www.npmjs.com/package/@playwright/mcp
**Version:** 0.0.45 (as of 2025-10-31)
**Maintainers:** Microsoft Playwright Team
**License:** Apache-2.0

### Key Features

✅ **Fast & Lightweight** - Uses Playwright's accessibility tree
✅ **LLM-Friendly** - Structured data, no vision models needed
✅ **No Screenshots Required** - Operates on accessibility snapshots
✅ **Official Microsoft Package** - Maintained by Playwright team
✅ **Latest Playwright Features** - Always up to date

### Requirements

- **Node.js:** 18 or newer
- **Playwright:** Automatically managed by the package
- **Operating Systems:** Linux, macOS, Windows

---

## Alternative Installation Methods

### Option 1: Using executeautomation/playwright-mcp-server

This is an alternative community package with additional features:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@executeautomation/playwright-mcp-server"]
    }
  }
}
```

**Source:** https://github.com/executeautomation/mcp-playwright

### Option 2: Direct Git Installation

```bash
# Clone the official repo
git clone https://github.com/microsoft/playwright-mcp.git
cd playwright-mcp

# Install dependencies
npm install

# Build
npm run build

# Link globally
npm link
```

Then configure Claude Desktop to use the local installation.

---

## Testing the Setup

### Test 1: Basic Connection

```
In Claude Desktop:

You: "List all Playwright MCP tools available"

Claude: Should list available tools if MCP is configured correctly
```

### Test 2: Navigate to Page

```
You: "Use Playwright to navigate to https://example.com and tell me what you see"

Claude: Should use MCP to open browser and describe page content
```

### Test 3: Run Tests (Your Use Case)

```
You: "You are the Playwright Testing Expert Agent. Use Playwright MCP to run the test file: tests/e2e/dashboard.spec.ts"

Claude: Should execute tests and return structured results
```

---

## For Your Agent OS Workflow

### Updated Agent Instructions

**Playwright Testing Expert Agent should use:**

```typescript
// When configured with @playwright/mcp
Tool: playwright_mcp
Action: execute_test
Path: tests/e2e/dashboard.spec.ts
Options: { reporter: 'json' }
```

**Note:** The exact tool names may differ from the original agent definition. Once MCP is configured, you can update the agent definition with the actual tool names provided by `@playwright/mcp`.

### Updating Agent Definition

After MCP is configured, update:
`/home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md`

Change from:
```
Tool: playwright_execute
```

To actual tool names provided by `@playwright/mcp` (verify in Claude Desktop).

---

## Troubleshooting

### Issue 1: Config File Not Found

**Symptom:** MCP tools not available after restart

**Fix:**
```bash
# Check if config directory exists
ls -la ~/.config/Claude/

# Check if config file exists
cat ~/.config/Claude/claude_desktop_config.json

# Verify JSON is valid
cat ~/.config/Claude/claude_desktop_config.json | jq .
```

### Issue 2: npx Command Fails

**Symptom:** Error when Claude tries to use MCP server

**Fix:**
```bash
# Test npx command manually
npx -y @playwright/mcp@latest --version

# If fails, install globally
npm install -g @playwright/mcp

# Update config to use global installation
```

### Issue 3: PLAYWRIGHT_PROJECT_DIR Not Found

**Symptom:** MCP server can't find test files

**Fix:**
```bash
# Verify path exists
ls -la /home/dev/Development/arQ/frontend

# Verify tests directory
ls -la /home/dev/Development/arQ/frontend/tests/e2e

# Use absolute path in config
```

### Issue 4: Tools Still Not Available

**Symptom:** Claude Desktop doesn't show MCP tools

**Fix:**
1. Completely quit Claude Desktop (not just close window)
2. Check Claude Desktop logs:
   ```bash
   tail -f ~/.config/Claude/logs/main.log
   ```
3. Look for MCP server startup errors
4. Restart Claude Desktop
5. Test again

---

## Verification Checklist

After setup, verify:

- [ ] `@playwright/mcp` package is installed (npm list -g)
- [ ] Config file exists at `~/.config/Claude/claude_desktop_config.json`
- [ ] Config JSON is valid (test with `jq`)
- [ ] PLAYWRIGHT_PROJECT_DIR path is correct
- [ ] Claude Desktop has been fully restarted
- [ ] MCP tools are visible in Claude Desktop
- [ ] Can execute simple Playwright command
- [ ] Can navigate to test URL
- [ ] Can run actual test file

---

## Next Steps After Setup

### 1. Test MCP Integration

```
PM (You): "Navigate to http://localhost:3000 using Playwright MCP"

Claude: Should use MCP to open browser and navigate
```

### 2. Run Your First Test

```
PM (You): "Execute tests/e2e/dashboard.spec.ts and report results"

Claude: Should run tests and return structured output
```

### 3. Execute First Agent OS Loop

```
PM (You): "You are the Playwright Testing Expert Agent.

Read your standards from: /home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md

Use Playwright MCP to run: tests/e2e/dashboard.spec.ts

If any test fails:
- Categorize the error (Backend/Frontend/Database)
- Create ERROR_REPORT.json
- Return it to me for delegation"

Claude: Executes full testing workflow
```

### 4. Complete Full Feedback Loop

Follow the workflow in:
- `/home/dev/.claude/agents/AGENT_OS_WORKFLOW.md`
- `/home/dev/Development/arQ/MCP_AND_VALIDATION_STATUS_REPORT.md`

---

## Resources

### Official Documentation

- **Playwright MCP GitHub:** https://github.com/microsoft/playwright-mcp
- **Playwright Docs:** https://playwright.dev/
- **MCP Specification:** https://modelcontextprotocol.io/

### Your Project Documentation

- **MCP Setup Guide:** `/home/dev/Development/arQ/MCP_CORRECT_SETUP.md` (this file)
- **Status Report:** `/home/dev/Development/arQ/MCP_AND_VALIDATION_STATUS_REPORT.md`
- **Agent Workflow:** `/home/dev/.claude/agents/AGENT_OS_WORKFLOW.md`
- **Testing Expert:** `/home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md`

---

## Summary

**Correct Package:** `@playwright/mcp` (NOT `@modelcontextprotocol/server-playwright`)

**Installation:**
```bash
npm install -g @playwright/mcp
```

**Configuration:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend"
      }
    }
  }
}
```

**Time to Setup:** 15 minutes
**Result:** Playwright MCP server integrated with Claude Desktop
**Benefit:** Enables automated Agent OS testing workflow

---

**Ready to install? Run the commands in Step 1!** 🚀
