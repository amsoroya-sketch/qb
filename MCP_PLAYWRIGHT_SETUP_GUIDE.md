# 🎭 Playwright MCP Server Setup & Usage Guide

**Status:** ⚠️ **NOT YET CONFIGURED** (Critical blocker for Agent OS workflow)
**Priority:** 🔴 **CRITICAL** - Required for automated testing workflow
**Estimated Setup Time:** 15-30 minutes

---

## Executive Summary

The Playwright MCP (Model Context Protocol) Server enables **Claude agents to execute and control Playwright tests programmatically**. This is the foundation of the Agent OS testing workflow where:

1. **Playwright Testing Expert Agent** runs tests via MCP
2. **Receives structured JSON results** with errors
3. **Auto-categorizes errors** (Backend/Frontend/Database)
4. **Delegates to Developer Agents** for fixes
5. **Re-tests automatically** after fixes
6. **Learns and prevents** future errors

**Without MCP Server configured, the entire Agent OS workflow is blocked.**

---

## Current Status

### ❌ MCP Server: NOT CONFIGURED

**Checked:** `~/.config/Claude/claude_desktop_config.json`
**Result:** File not found or MCP server not configured

**Impact:**
- Cannot use `playwright_execute` tool
- Cannot get structured JSON test results
- Cannot auto-categorize errors
- Cannot trigger Agent OS workflow
- Must run tests manually via `npx playwright test`

### ✅ Test Infrastructure: READY

**Verified:**
- 18 test files exist in `/home/dev/Development/arQ/frontend/tests/e2e/`
- 157 tests total (3,528 test variants across browsers)
- Playwright config properly set up
- Tests can run traditionally (without MCP)

---

## Installation Steps

### Step 1: Install Playwright MCP Server

```bash
# Option A: Global installation (recommended)
npm install -g @modelcontextprotocol/server-playwright

# Option B: Project-local installation
cd /home/dev/Development/arQ/frontend
npm install --save-dev @modelcontextprotocol/server-playwright

# Verify installation
npx @modelcontextprotocol/server-playwright --version
```

### Step 2: Configure Claude Desktop

**Create or edit:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-playwright"
      ],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend",
        "NODE_ENV": "test"
      }
    }
  }
}
```

**For global installation:**
```json
{
  "mcpServers": {
    "playwright": {
      "command": "@modelcontextprotocol/server-playwright",
      "args": [],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/home/dev/Development/arQ/frontend",
        "NODE_ENV": "test"
      }
    }
  }
}
```

### Step 3: Restart Claude Desktop

```bash
# Kill Claude Desktop process
pkill -f "Claude"

# Or use the GUI to quit and restart

# Restart Claude Desktop
# (Application should be in your applications menu)
```

### Step 4: Verify MCP Tools Are Available

In Claude, check if these tools are now available:
- `playwright_execute` - Run test files
- `playwright_navigate` - Navigate browser
- `playwright_click` - Click elements
- `playwright_fill` - Fill form fields
- `playwright_screenshot` - Capture screenshots
- `playwright_console` - Get console logs

You should see these in the tool list or Claude will confirm when you ask.

---

## MCP Tools Overview

### 1. `playwright_execute` (Primary Tool)

**Purpose:** Run Playwright test files and get structured results

**Usage:**
```typescript
Tool: playwright_execute
Input: {
  testFile: "tests/e2e/dashboard.spec.ts",
  options: {
    reporter: "json",
    project: "chromium",
    workers: 1
  }
}
```

**Output (Structured JSON):**
```json
{
  "status": "passed" | "failed",
  "totalTests": 15,
  "passed": 14,
  "failed": 1,
  "skipped": 0,
  "duration": 45000,
  "failures": [
    {
      "testName": "should display dashboard stats",
      "file": "tests/e2e/dashboard.spec.ts",
      "line": 45,
      "error": {
        "message": "Request failed with status code 404",
        "type": "ApiError",
        "stack": "...",
        "url": "GET /api/v1/progress/me/dashboard"
      },
      "screenshot": "/tmp/dashboard-error.png"
    }
  ]
}
```

### 2. `playwright_screenshot`

**Purpose:** Capture screenshot for debugging

**Usage:**
```typescript
Tool: playwright_screenshot
Input: {
  outputPath: "/tmp/error-screenshot.png"
}
```

### 3. `playwright_navigate`

**Purpose:** Navigate browser to URL

**Usage:**
```typescript
Tool: playwright_navigate
Input: {
  url: "http://localhost:3000/dashboard"
}
```

### 4. `playwright_click`

**Purpose:** Click element on page

**Usage:**
```typescript
Tool: playwright_click
Input: {
  selector: "button[type='submit']"
}
```

### 5. `playwright_fill`

**Purpose:** Fill form field

**Usage:**
```typescript
Tool: playwright_fill
Input: {
  selector: "input[name='email']",
  value: "test@example.com"
}
```

### 6. `playwright_console`

**Purpose:** Get browser console logs

**Usage:**
```typescript
Tool: playwright_console
Input: {}
```

**Output:**
```json
{
  "logs": [
    { "type": "error", "text": "Failed to load resource", "timestamp": "..." },
    { "type": "warning", "text": "...", "timestamp": "..." }
  ]
}
```

---

## Agent OS Workflow with MCP

### Traditional Way (Manual - No MCP)

```bash
# PM manually runs tests
cd /home/dev/Development/arQ/frontend
npx playwright test

# Output to console (unstructured)
# PM reads errors manually
# PM identifies error type manually
# PM delegates to developer agent manually
# Developer fixes
# PM runs tests again manually
```

**Problems:**
- Manual coordination
- Unstructured output
- No auto-categorization
- Slow feedback loop
- No automated learning

### Agent OS Way (Automated - With MCP)

```
┌─────────────────────────────────────────────────────────┐
│ STEP 1: PM DELEGATES TO PLAYWRIGHT AGENT               │
└─────────────────────────────────────────────────────────┘

PM: "Run dashboard tests using MCP"

┌─────────────────────────────────────────────────────────┐
│ STEP 2: PLAYWRIGHT AGENT USES MCP                      │
└─────────────────────────────────────────────────────────┘

Agent uses: playwright_execute
Input: { testFile: "tests/e2e/dashboard.spec.ts" }

MCP returns structured JSON:
{
  "status": "failed",
  "failures": [{
    "error": "Request failed with status code 404",
    "url": "GET /api/v1/progress/me/dashboard"
  }]
}

┌─────────────────────────────────────────────────────────┐
│ STEP 3: PLAYWRIGHT AGENT AUTO-CATEGORIZES              │
└─────────────────────────────────────────────────────────┘

Agent logic:
if (error.includes("status code 404")) {
  errorType = "Backend";
  errorCategory = "API_404";
  delegateTo = "Backend Developer Agent";
}

Agent uses: playwright_screenshot
Screenshot saved: /tmp/dashboard-404.png

┌─────────────────────────────────────────────────────────┐
│ STEP 4: PLAYWRIGHT AGENT CREATES ERROR REPORT          │
└─────────────────────────────────────────────────────────┘

Agent creates: ERROR_REPORT.json
{
  "errorType": "Backend",
  "errorCategory": "API_404",
  "delegateTo": "Backend Developer Agent",
  "apiEndpoint": "GET /api/v1/progress/me/dashboard",
  "screenshot": "/tmp/dashboard-404.png",
  "suggestedFix": "Check if route exists in ProgressController"
}

Agent returns to PM: ERROR_REPORT.json

┌─────────────────────────────────────────────────────────┐
│ STEP 5: PM DELEGATES TO BACKEND DEVELOPER               │
└─────────────────────────────────────────────────────────┘

PM: "Read ERROR_REPORT.json and fix"

Backend Developer Agent:
- Reads ERROR_REPORT.json
- Investigates backend code
- Finds missing route
- Fixes code
- Updates own standards (NESTJS_BACKEND_DEVELOPER.md)
- Creates FIX_REPORT.json

┌─────────────────────────────────────────────────────────┐
│ STEP 6: PM DELEGATES RETEST TO PLAYWRIGHT AGENT        │
└─────────────────────────────────────────────────────────┘

PM: "Read FIX_REPORT.json and re-test dashboard"

Playwright Agent uses: playwright_execute
MCP returns: { "status": "passed", "allTestsPassed": true }

Agent updates own standards (PLAYWRIGHT_TESTING_EXPERT.md)
Agent returns: RETEST_SUMMARY.json

┌─────────────────────────────────────────────────────────┐
│ STEP 7: LOOP COMPLETE - AGENTS LEARNED                 │
└─────────────────────────────────────────────────────────┘

PM creates: LOOP_METRICS.json
{
  "loopDuration": "22 minutes",
  "agentsImproved": ["Playwright Tester", "Backend Developer"],
  "willErrorRecur": false
}
```

**Benefits:**
- ✅ Automated error detection
- ✅ Structured error reports
- ✅ Auto-categorization and delegation
- ✅ Fast feedback loop (<30 min)
- ✅ Agents learn and improve
- ✅ Errors prevented in future

---

## Testing the MCP Setup

### Test 1: Verify MCP Tools Available

**In Claude, ask:**
```
Do you have access to playwright_execute tool?
```

**Expected response:**
```
Yes, I have access to the following Playwright MCP tools:
- playwright_execute
- playwright_screenshot
- playwright_navigate
- playwright_click
- playwright_fill
- playwright_console
```

### Test 2: Run Simple Test

**In Claude, delegate to Playwright Testing Expert Agent:**
```
You are the Playwright Testing Expert Agent.

Use playwright_execute to run: tests/e2e/dashboard.spec.ts

Return the test results in structured format.
```

**Expected:** Agent uses MCP tool and returns JSON results

### Test 3: Execute Full Agent OS Loop

**Follow the workflow in the previous section**

---

## Current Test Execution (Without MCP)

### Test Results Summary

**Command run:** `npm run test -- --reporter=json --reporter=list`

**Status:** Tests running but encountering backend connection issues

**Errors encountered:**
```
⚠ Could not reset lockouts: Error: Cannot find module '@prisma/client'
⚠ Backend not available - skipping user registration
ℹ Tests that require backend will be skipped or mocked
```

**Tests executed:** 3,528 test variants (157 unique tests across multiple browsers)

**Sample failures:**
- 37 achievements tests failing (backend not running)
- Timeout errors (18-21 seconds)
- API connection errors (404s, timeouts)

### Required Pre-Testing Setup

**Before running tests, ensure:**

1. **Backend is running:**
```bash
cd /home/dev/Development/arQ/backend
npm run start:dev
# Backend should be at http://localhost:3001
```

2. **Database is running:**
```bash
docker-compose up postgres redis -d
```

3. **Prisma client generated:**
```bash
cd /home/dev/Development/arQ/backend
npx prisma generate
```

4. **Test data seeded:**
```bash
cd /home/dev/Development/arQ/backend
npm run seed
```

---

## Comparison: Traditional vs MCP Execution

### Traditional Execution

**Command:**
```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

**Output:** Console text (unstructured)
```
Running 15 tests using 1 worker

  ✘  should display dashboard stats (5.2s)
     Error: Request failed with status code 404

  ✓  should display navigation (2.1s)
  ✓  should display user info (1.8s)

14 passed, 1 failed
```

**Problems:**
- Requires manual parsing of console output
- No structured error data
- No automatic categorization
- Must manually create error report
- No automated screenshot capture
- Slow feedback loop

### MCP Execution

**Tool Use:**
```typescript
playwright_execute({
  testFile: "tests/e2e/dashboard.spec.ts",
  options: { reporter: "json" }
})
```

**Output:** Structured JSON
```json
{
  "status": "failed",
  "totalTests": 15,
  "passed": 14,
  "failed": 1,
  "failures": [{
    "testName": "should display dashboard stats",
    "file": "tests/e2e/dashboard.spec.ts",
    "line": 45,
    "error": {
      "message": "Request failed with status code 404",
      "type": "ApiError",
      "url": "GET /api/v1/progress/me/dashboard"
    },
    "screenshot": "/tmp/dashboard-error.png"
  }]
}
```

**Benefits:**
- ✅ Structured data ready for parsing
- ✅ Error details automatically captured
- ✅ Screenshot automatically saved
- ✅ Easy to categorize programmatically
- ✅ ERROR_REPORT.json can be auto-generated
- ✅ Fast agent-to-agent handoff

---

## Troubleshooting

### Issue 1: MCP Server Not Starting

**Symptom:** Tools not available in Claude

**Check:**
```bash
# Verify installation
npx @modelcontextprotocol/server-playwright --version

# Check config file exists
cat ~/.config/Claude/claude_desktop_config.json

# Check Claude Desktop logs
tail -f ~/.config/Claude/logs/main.log
```

**Fix:**
- Ensure `@modelcontextprotocol/server-playwright` is installed
- Verify config JSON is valid (use `jq` to validate)
- Restart Claude Desktop completely
- Check that PLAYWRIGHT_PROJECT_DIR path is correct

### Issue 2: Tests Fail with "Project not found"

**Symptom:** MCP returns error about project directory

**Fix:**
```json
{
  "mcpServers": {
    "playwright": {
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "/absolute/path/to/frontend"
      }
    }
  }
}
```

### Issue 3: Tests Fail with Backend Errors

**Symptom:** All tests fail with 404/500 errors

**Fix:**
```bash
# Start backend
cd /home/dev/Development/arQ/backend
npm run start:dev

# Start database
docker-compose up -d

# Verify backend is running
curl http://localhost:3001/api/v1/health
```

---

## Next Steps

### Immediate (P0 - Critical)

1. **Install MCP Server** (15 min)
   ```bash
   npm install -g @modelcontextprotocol/server-playwright
   ```

2. **Configure Claude Desktop** (5 min)
   - Create/edit config file
   - Add Playwright MCP server entry
   - Restart Claude Desktop

3. **Verify MCP Tools** (5 min)
   - Ask Claude if playwright_execute is available
   - Test with simple command

### Short-term (P1 - High)

4. **Execute First Agent OS Loop** (4-6 hours)
   - Delegate to Playwright Testing Expert
   - Run tests via MCP
   - Process ERROR_REPORT.json
   - Delegate to Developer Agent
   - Complete full loop

5. **Document Loop Metrics** (30 min)
   - Track loop duration
   - Document agents involved
   - Record learnings captured
   - Measure improvement

### Medium-term (P2)

6. **Optimize Loop Time** (ongoing)
   - Target: <15 minutes per loop
   - Improve error categorization logic
   - Streamline agent handoffs

7. **Scale to All Test Files** (ongoing)
   - Run full test suite via MCP
   - Process all errors systematically
   - Build comprehensive error knowledge base

---

## Success Criteria

MCP setup is successful when:

- ✅ `playwright_execute` tool is available in Claude
- ✅ Can run tests and get structured JSON results
- ✅ Screenshots auto-capture on failures
- ✅ Playwright Testing Expert Agent can use MCP directly
- ✅ ERROR_REPORT.json can be auto-generated
- ✅ Complete Agent OS loop executes in <30 minutes
- ✅ Agents successfully update their own standards
- ✅ Loop metrics are tracked and improving

---

## Resources

**Agent Definitions:**
- `/home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md` (70KB)
- `/home/dev/.claude/agents/AGENT_OS_WORKFLOW.md` (31KB)

**Test Infrastructure:**
- `/home/dev/Development/arQ/frontend/tests/e2e/` (18 files, 157 tests)
- `/home/dev/Development/arQ/frontend/playwright.config.ts`

**Documentation:**
- `/home/dev/Development/arQ/MCP_ASSESSMENT_REPORT.md` (22K words)
- `/home/dev/Development/arQ/frontend/tests/AGENT_OS_INTEGRATION_SUMMARY.md`

**MCP Documentation:**
- https://github.com/modelcontextprotocol/servers
- https://github.com/anthropics/anthropic-tools

---

**Status:** ⚠️ **READY TO CONFIGURE**
**Blocking:** Entire Agent OS testing workflow
**Priority:** 🔴 **CRITICAL**
**Estimated Time:** 15-30 minutes
**Impact:** **UNBLOCKS EVERYTHING**

---

**Generated:** 2025-11-07
**Version:** 1.0
**Next Action:** Install MCP Server (see Step 1 above)
