#!/bin/bash

################################################################################
# Playwright MCP Server Setup Script
#
# This script automates the installation and configuration of Playwright MCP
# server for Claude Desktop to enable Agent OS testing workflow.
#
# Usage: ./setup-mcp-playwright.sh
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/dev/Development/arQ/frontend"
CLAUDE_CONFIG_DIR="$HOME/.config/Claude"
CLAUDE_CONFIG_FILE="$CLAUDE_CONFIG_DIR/claude_desktop_config.json"

################################################################################
# Helper Functions
################################################################################

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

################################################################################
# Pre-flight Checks
################################################################################

print_header "Playwright MCP Server Setup"

echo "This script will:"
echo "  1. Check system requirements"
echo "  2. Install Playwright MCP server"
echo "  3. Configure Claude Desktop"
echo "  4. Verify installation"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Installation cancelled"
    exit 1
fi

print_header "Step 1: System Requirements Check"

# Check Node.js
print_info "Checking Node.js installation..."
if check_command node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"

    # Check if version is 18 or higher
    NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_error "Node.js 18 or higher required. Current: $NODE_VERSION"
        exit 1
    fi
else
    print_error "Node.js not found. Please install Node.js 18 or higher."
    exit 1
fi

# Check npm
print_info "Checking npm installation..."
if check_command npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: $NPM_VERSION"
else
    print_error "npm not found. Please install npm."
    exit 1
fi

# Check if project directory exists
print_info "Checking project directory..."
if [ -d "$PROJECT_DIR" ]; then
    print_success "Project directory found: $PROJECT_DIR"
else
    print_error "Project directory not found: $PROJECT_DIR"
    exit 1
fi

# Check if tests directory exists
print_info "Checking tests directory..."
if [ -d "$PROJECT_DIR/tests/e2e" ]; then
    TEST_COUNT=$(find "$PROJECT_DIR/tests/e2e" -name "*.spec.ts" | wc -l)
    print_success "Tests directory found with $TEST_COUNT test files"
else
    print_warning "Tests directory not found at $PROJECT_DIR/tests/e2e"
fi

################################################################################
# Step 2: Install Playwright MCP
################################################################################

print_header "Step 2: Installing Playwright MCP Server"

print_info "Installing @playwright/mcp globally..."
if npm install -g @playwright/mcp; then
    print_success "Playwright MCP installed successfully"
else
    print_error "Failed to install Playwright MCP"
    exit 1
fi

# Verify installation
print_info "Verifying installation..."
if npm list -g @playwright/mcp &> /dev/null; then
    MCP_VERSION=$(npm list -g @playwright/mcp --depth=0 | grep @playwright/mcp | awk '{print $2}')
    print_success "Playwright MCP version: $MCP_VERSION"
else
    print_error "Playwright MCP installation verification failed"
    exit 1
fi

################################################################################
# Step 3: Configure Claude Desktop
################################################################################

print_header "Step 3: Configuring Claude Desktop"

# Create config directory if it doesn't exist
print_info "Creating Claude config directory..."
if [ ! -d "$CLAUDE_CONFIG_DIR" ]; then
    mkdir -p "$CLAUDE_CONFIG_DIR"
    print_success "Created directory: $CLAUDE_CONFIG_DIR"
else
    print_success "Directory already exists: $CLAUDE_CONFIG_DIR"
fi

# Backup existing config if it exists
if [ -f "$CLAUDE_CONFIG_FILE" ]; then
    BACKUP_FILE="$CLAUDE_CONFIG_FILE.backup.$(date +%Y%m%d_%H%M%S)"
    print_warning "Existing config found. Creating backup: $BACKUP_FILE"
    cp "$CLAUDE_CONFIG_FILE" "$BACKUP_FILE"
    print_success "Backup created"
fi

# Create config file
print_info "Creating Claude Desktop configuration..."
cat > "$CLAUDE_CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ],
      "env": {
        "PLAYWRIGHT_PROJECT_DIR": "$PROJECT_DIR",
        "NODE_ENV": "test"
      }
    }
  }
}
EOF

if [ $? -eq 0 ]; then
    print_success "Configuration file created: $CLAUDE_CONFIG_FILE"
else
    print_error "Failed to create configuration file"
    exit 1
fi

# Validate JSON
print_info "Validating configuration JSON..."
if check_command jq; then
    if jq empty "$CLAUDE_CONFIG_FILE" 2>/dev/null; then
        print_success "Configuration JSON is valid"
    else
        print_error "Configuration JSON is invalid"
        exit 1
    fi
else
    print_warning "jq not found. Skipping JSON validation."
fi

# Display configuration
print_info "Configuration file contents:"
echo ""
cat "$CLAUDE_CONFIG_FILE"
echo ""

################################################################################
# Step 4: Verify Setup
################################################################################

print_header "Step 4: Verification"

# Test npx command
print_info "Testing npx @playwright/mcp command..."
if npx -y @playwright/mcp@latest --version &> /dev/null; then
    print_success "npx command works correctly"
else
    print_warning "npx command test failed (may work in Claude Desktop)"
fi

# Check if Claude Desktop is running
print_info "Checking if Claude Desktop is running..."
if pgrep -f "Claude" > /dev/null; then
    print_warning "Claude Desktop is currently running"
    echo ""
    echo "  You need to restart Claude Desktop for changes to take effect."
    echo "  Options:"
    echo "    1. Quit Claude Desktop and restart manually"
    echo "    2. Run: pkill -f 'Claude' && sleep 2 && (start Claude Desktop)"
    echo ""
    read -p "Would you like to kill Claude Desktop now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Killing Claude Desktop process..."
        pkill -f "Claude"
        sleep 2
        print_success "Claude Desktop stopped. Please restart it manually."
    else
        print_info "Please restart Claude Desktop manually when ready."
    fi
else
    print_success "Claude Desktop is not running"
fi

################################################################################
# Step 5: Summary & Next Steps
################################################################################

print_header "Setup Complete!"

echo -e "${GREEN}✓ Playwright MCP Server installed${NC}"
echo -e "${GREEN}✓ Claude Desktop configured${NC}"
echo -e "${GREEN}✓ Configuration validated${NC}"
echo ""
echo -e "${BLUE}Configuration File:${NC} $CLAUDE_CONFIG_FILE"
echo -e "${BLUE}Project Directory:${NC} $PROJECT_DIR"
echo -e "${BLUE}MCP Version:${NC} $MCP_VERSION"
echo ""

print_header "Next Steps"

echo "1. Start/Restart Claude Desktop"
echo ""
echo "2. Verify MCP tools are available in Claude:"
echo "   Ask: 'Do you have access to Playwright MCP tools?'"
echo ""
echo "3. Test basic functionality:"
echo "   Ask: 'Use Playwright to navigate to https://example.com'"
echo ""
echo "4. Run your first test:"
echo "   Ask: 'Execute tests/e2e/dashboard.spec.ts using Playwright MCP'"
echo ""
echo "5. Start Agent OS workflow:"
echo "   Delegate to Playwright Testing Expert Agent"
echo "   File: /home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md"
echo ""

print_header "Troubleshooting"

echo "If MCP tools are not available after restart:"
echo ""
echo "1. Check configuration:"
echo "   cat $CLAUDE_CONFIG_FILE"
echo ""
echo "2. Check Claude Desktop logs:"
echo "   tail -f ~/.config/Claude/logs/main.log"
echo ""
echo "3. Verify installation:"
echo "   npm list -g @playwright/mcp"
echo ""
echo "4. Test npx command:"
echo "   npx -y @playwright/mcp@latest --version"
echo ""
echo "5. Review setup guide:"
echo "   cat /home/dev/Development/arQ/MCP_CORRECT_SETUP.md"
echo ""

print_header "Documentation"

echo "Setup Guide:"
echo "  /home/dev/Development/arQ/MCP_CORRECT_SETUP.md"
echo ""
echo "Status Report:"
echo "  /home/dev/Development/arQ/MCP_AND_VALIDATION_STATUS_REPORT.md"
echo ""
echo "Agent Workflow:"
echo "  /home/dev/.claude/agents/AGENT_OS_WORKFLOW.md"
echo ""
echo "Testing Expert Agent:"
echo "  /home/dev/.claude/agents/PLAYWRIGHT_TESTING_EXPERT.md"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
