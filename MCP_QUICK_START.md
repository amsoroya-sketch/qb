# 🚀 Playwright MCP - Quick Start

**One-Line Setup:** `./setup-mcp-playwright.sh`

---

## Option 1: Automated Setup (Recommended)

```bash
# Run the setup script
cd /home/dev/Development/arQ
./setup-mcp-playwright.sh

# Follow the prompts
# Restart Claude Desktop when prompted
```

**Time:** 5 minutes ⏱️

---

## Option 2: Manual Setup

### 1. Install (2 min)

```bash
npm install -g @playwright/mcp
```

### 2. Configure (2 min)

```bash
mkdir -p ~/.config/Claude

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
```

### 3. Restart (1 min)

```bash
pkill -f "Claude"
# Then restart Claude Desktop manually
```

---

## Verify Installation

**In Claude Desktop, ask:**
```
Do you have access to Playwright MCP tools?
```

**Expected:** "Yes, I can use Playwright for browser automation..."

---

## Test It

```
Navigate to https://example.com using Playwright and describe what you see
```

---

## Start Agent OS Workflow

```
You are the Playwright Testing Expert Agent.

Read your standards: /home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md

Use Playwright MCP to run: tests/e2e/dashboard.spec.ts

Report any failures with ERROR_REPORT.json
```

---

## Troubleshooting

**Tools not available?**
```bash
# Check config
cat ~/.config/Claude/claude_desktop_config.json

# Check installation
npm list -g @playwright/mcp

# Check logs
tail -f ~/.config/Claude/logs/main.log
```

**Still not working?**
- Completely quit Claude Desktop (not just close window)
- Wait 5 seconds
- Restart Claude Desktop
- Try again

---

## Documentation

- **Full Setup Guide:** `MCP_CORRECT_SETUP.md`
- **Status Report:** `MCP_AND_VALIDATION_STATUS_REPORT.md`
- **Setup Script:** `setup-mcp-playwright.sh`

---

**Ready?** Run: `./setup-mcp-playwright.sh` 🎭
