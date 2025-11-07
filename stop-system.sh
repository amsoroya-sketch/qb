#!/bin/bash

# arQ System Stop Script
# Gracefully stops all system components
# Version: 1.0.0

set -e

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOG_DIR="$SCRIPT_DIR/logs"

# Ports to check
BACKEND_PORT=3001
FRONTEND_PORT=3005

# Docker containers
POSTGRES_CONTAINER="arq-postgres"
REDIS_CONTAINER="arq-redis"

# Tmux session
TMUX_SESSION="arq-system"

# ============================================================================
# COLORS & FORMATTING
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BOLD}${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                 arQ System Shutdown Manager                   ║"
    echo "║                     Version 1.0.0                              ║"
    echo "╚════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_section() {
    echo ""
    echo -e "${BOLD}${BLUE}▶ $1${NC}"
    echo -e "${BLUE}$(printf '─%.0s' {1..70})${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${CYAN}ℹ️  $1${NC}"
}

print_step() {
    echo -e "  ▸ $1"
}

# ============================================================================
# STOP FUNCTIONS
# ============================================================================

stop_tmux_session() {
    if tmux has-session -t "$TMUX_SESSION" 2>/dev/null; then
        print_step "Stopping tmux session: $TMUX_SESSION"
        tmux kill-session -t "$TMUX_SESSION"
        print_success "Tmux session stopped"
        return 0
    else
        print_info "No tmux session found"
        return 1
    fi
}

stop_process_by_port() {
    local port=$1
    local service=$2

    local pids=$(lsof -ti :$port 2>/dev/null || true)

    if [ -n "$pids" ]; then
        print_step "Stopping $service on port $port (PIDs: $pids)"
        echo "$pids" | xargs kill -15 2>/dev/null || true
        sleep 2

        # Force kill if still running
        pids=$(lsof -ti :$port 2>/dev/null || true)
        if [ -n "$pids" ]; then
            print_warning "Force stopping $service (PIDs: $pids)"
            echo "$pids" | xargs kill -9 2>/dev/null || true
        fi

        print_success "$service stopped"
        return 0
    else
        print_info "$service not running on port $port"
        return 1
    fi
}

stop_process_by_pid_file() {
    local pid_file=$1
    local service=$2

    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            print_step "Stopping $service (PID: $pid)"
            kill -15 "$pid" 2>/dev/null || true
            sleep 2

            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                print_warning "Force stopping $service (PID: $pid)"
                kill -9 "$pid" 2>/dev/null || true
            fi

            print_success "$service stopped"
        else
            print_info "$service not running (stale PID file)"
        fi
        rm -f "$pid_file"
        return 0
    else
        return 1
    fi
}

stop_docker_containers() {
    local stop_docker=false

    if [ "$1" = "--docker" ] || [ "$1" = "-d" ]; then
        stop_docker=true
    fi

    if [ "$stop_docker" = true ]; then
        print_step "Stopping PostgreSQL container..."
        docker stop "$POSTGRES_CONTAINER" > /dev/null 2>&1 || print_info "PostgreSQL container not running"

        print_step "Stopping Redis container..."
        docker stop "$REDIS_CONTAINER" > /dev/null 2>&1 || print_info "Redis container not running"

        print_success "Docker containers stopped"
    else
        print_info "Docker containers left running (use --docker to stop)"
    fi
}

# ============================================================================
# MAIN FUNCTION
# ============================================================================

main() {
    print_header

    # Parse arguments
    local stop_docker_flag=""
    if [ "$1" = "--docker" ] || [ "$1" = "-d" ]; then
        stop_docker_flag="--docker"
    fi

    print_section "Stopping Application Servers"

    # Try to stop tmux session first
    if ! stop_tmux_session; then
        # If no tmux session, try PID files
        if [ -d "$LOG_DIR" ]; then
            stop_process_by_pid_file "$LOG_DIR/backend.pid" "Backend" || true
            stop_process_by_pid_file "$LOG_DIR/frontend.pid" "Frontend" || true
        fi

        # Finally, try to stop by port
        stop_process_by_port $BACKEND_PORT "Backend" || true
        stop_process_by_port $FRONTEND_PORT "Frontend" || true
    fi

    # Stop Docker containers if requested
    if [ -n "$stop_docker_flag" ]; then
        print_section "Stopping Docker Containers"
        stop_docker_containers "$stop_docker_flag"
    fi

    # Summary
    print_section "Shutdown Complete"
    echo ""
    echo -e "${BOLD}${GREEN}✓ All services stopped${NC}"
    echo ""

    if [ -z "$stop_docker_flag" ]; then
        echo -e "${YELLOW}Note: Docker containers are still running${NC}"
        echo -e "To stop Docker containers, run: ${CYAN}$0 --docker${NC}"
        echo ""
    fi

    echo -e "To start the system again, run: ${CYAN}$SCRIPT_DIR/start-system.sh${NC}"
    echo ""
}

# ============================================================================
# SCRIPT EXECUTION
# ============================================================================

main "$@"
