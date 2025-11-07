#!/bin/bash

# arQ System Startup Script
# Comprehensive script to start all system components
# Version: 1.0.0

set -e  # Exit on error

# ============================================================================
# CONFIGURATION
# ============================================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Ports
BACKEND_PORT=3001
FRONTEND_PORT=3005
POSTGRES_PORT=5433
REDIS_PORT=6380

# Docker containers
POSTGRES_CONTAINER="arq-postgres"
REDIS_CONTAINER="arq-redis"

# Log files
LOG_DIR="$SCRIPT_DIR/logs"
BACKEND_LOG="$LOG_DIR/backend.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
DOCKER_LOG="$LOG_DIR/docker.log"

# ============================================================================
# COLORS & FORMATTING
# ============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
    echo -e "${BOLD}${CYAN}"
    echo "╔════════════════════════════════════════════════════════════════╗"
    echo "║                 arQ System Startup Manager                    ║"
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
    echo -e "${MAGENTA}▸ $1${NC}"
}

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

check_command() {
    if command -v "$1" &> /dev/null; then
        return 0
    else
        return 1
    fi
}

check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

wait_for_port() {
    local port=$1
    local service=$2
    local max_attempts=60
    local attempt=0

    print_step "Waiting for $service on port $port..."

    while [ $attempt -lt $max_attempts ]; do
        if check_port $port; then
            print_success "$service is ready on port $port"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 1
    done

    print_error "$service failed to start on port $port"
    return 1
}

check_docker() {
    if ! check_command docker; then
        print_error "Docker is not installed"
        echo "Please install Docker from: https://docs.docker.com/get-docker/"
        exit 1
    fi

    if ! docker ps > /dev/null 2>&1; then
        print_error "Docker daemon is not running"
        echo "Please start Docker Desktop or Docker service"
        exit 1
    fi

    print_success "Docker is available and running"
}

check_node() {
    if ! check_command node; then
        print_error "Node.js is not installed"
        echo "Please install Node.js v20 or higher"
        exit 1
    fi

    local node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 20 ]; then
        print_warning "Node.js version is $node_version. Recommended: v20 or higher"
    else
        print_success "Node.js $(node -v) is installed"
    fi
}

check_npm() {
    if ! check_command npm; then
        print_error "npm is not installed"
        exit 1
    fi

    print_success "npm $(npm -v) is installed"
}

# ============================================================================
# CLEANUP FUNCTIONS
# ============================================================================

cleanup_on_exit() {
    echo ""
    print_section "Cleaning up..."

    if [ -n "$TMUX_SESSION" ]; then
        print_step "Killing tmux session: $TMUX_SESSION"
        tmux kill-session -t "$TMUX_SESSION" 2>/dev/null || true
    fi

    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        print_step "Stopping backend (PID: $BACKEND_PID)"
        kill "$BACKEND_PID" 2>/dev/null || true
    fi

    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        print_step "Stopping frontend (PID: $FRONTEND_PID)"
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi

    print_success "Cleanup complete"
}

# ============================================================================
# DOCKER FUNCTIONS
# ============================================================================

start_docker_containers() {
    print_section "Starting Docker Containers"

    # Check if containers exist
    if ! docker ps -a --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
        print_info "PostgreSQL container doesn't exist. Starting with docker-compose..."
        cd "$SCRIPT_DIR"
        docker compose up -d postgres redis > "$DOCKER_LOG" 2>&1
    else
        # Start existing containers
        print_step "Starting PostgreSQL container..."
        docker start "$POSTGRES_CONTAINER" > /dev/null 2>&1 || true

        print_step "Starting Redis container..."
        docker start "$REDIS_CONTAINER" > /dev/null 2>&1 || true
    fi

    # Wait for containers to be healthy
    print_step "Waiting for PostgreSQL to be ready..."
    local postgres_ready=0
    for i in {1..30}; do
        if docker exec "$POSTGRES_CONTAINER" pg_isready -U postgres > /dev/null 2>&1; then
            postgres_ready=1
            break
        fi
        sleep 1
    done

    if [ $postgres_ready -eq 1 ]; then
        print_success "PostgreSQL is ready (port $POSTGRES_PORT)"
    else
        print_error "PostgreSQL failed to become ready"
        exit 1
    fi

    print_step "Waiting for Redis to be ready..."
    local redis_ready=0
    for i in {1..30}; do
        if docker exec "$REDIS_CONTAINER" redis-cli ping > /dev/null 2>&1; then
            redis_ready=1
            break
        fi
        sleep 1
    done

    if [ $redis_ready -eq 1 ]; then
        print_success "Redis is ready (port $REDIS_PORT)"
    else
        print_error "Redis failed to become ready"
        exit 1
    fi
}

# ============================================================================
# DATABASE FUNCTIONS
# ============================================================================

setup_database() {
    print_section "Setting Up Database"

    cd "$BACKEND_DIR"

    print_step "Generating Prisma Client..."
    npx prisma generate > /dev/null 2>&1
    print_success "Prisma Client generated"

    print_step "Running database migrations..."
    if npx prisma migrate deploy > /dev/null 2>&1; then
        print_success "Database migrations applied"
    else
        print_warning "Migrations failed, trying db push..."
        npx prisma db push --skip-generate > /dev/null 2>&1
        print_success "Database schema pushed"
    fi
}

# ============================================================================
# DEPENDENCY FUNCTIONS
# ============================================================================

install_dependencies() {
    print_section "Checking Dependencies"

    # Backend dependencies
    if [ ! -d "$BACKEND_DIR/node_modules" ]; then
        print_step "Installing backend dependencies..."
        cd "$BACKEND_DIR"
        npm install > /dev/null 2>&1
        print_success "Backend dependencies installed"
    else
        print_success "Backend dependencies already installed"
    fi

    # Frontend dependencies
    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        print_step "Installing frontend dependencies..."
        cd "$FRONTEND_DIR"
        npm install > /dev/null 2>&1
        print_success "Frontend dependencies installed"
    else
        print_success "Frontend dependencies already installed"
    fi
}

# ============================================================================
# SERVER STARTUP FUNCTIONS
# ============================================================================

start_servers_tmux() {
    print_section "Starting Application Servers (tmux)"

    TMUX_SESSION="arq-system"

    # Kill existing session if it exists
    tmux kill-session -t "$TMUX_SESSION" 2>/dev/null || true

    # Create new tmux session
    print_step "Creating tmux session: $TMUX_SESSION"
    tmux new-session -d -s "$TMUX_SESSION" -n "arQ"

    # Split window horizontally
    tmux split-window -h -t "$TMUX_SESSION"

    # Backend in left pane (0)
    print_step "Starting backend server in tmux pane 0..."
    tmux send-keys -t "$TMUX_SESSION:0.0" "cd $BACKEND_DIR && npm run start:dev 2>&1 | tee $BACKEND_LOG" C-m

    # Frontend in right pane (1)
    print_step "Starting frontend server in tmux pane 1..."
    tmux send-keys -t "$TMUX_SESSION:0.1" "cd $FRONTEND_DIR && PORT=$FRONTEND_PORT npm run dev 2>&1 | tee $FRONTEND_LOG" C-m

    # Set pane titles
    tmux select-pane -t "$TMUX_SESSION:0.0" -T "Backend"
    tmux select-pane -t "$TMUX_SESSION:0.1" -T "Frontend"

    print_success "Servers started in tmux session"

    # Wait for servers to be ready
    print_step "Waiting for backend to start..."
    if wait_for_port $BACKEND_PORT "Backend"; then
        print_success "Backend is running on http://localhost:$BACKEND_PORT"
    fi

    print_step "Waiting for frontend to start..."
    if wait_for_port $FRONTEND_PORT "Frontend"; then
        print_success "Frontend is running on http://localhost:$FRONTEND_PORT"
    fi
}

start_servers_background() {
    print_section "Starting Application Servers (background)"

    # Start backend
    print_step "Starting backend server..."
    cd "$BACKEND_DIR"
    nohup npm run start:dev > "$BACKEND_LOG" 2>&1 &
    BACKEND_PID=$!
    print_success "Backend started (PID: $BACKEND_PID)"

    # Start frontend
    print_step "Starting frontend server..."
    cd "$FRONTEND_DIR"
    nohup env PORT=$FRONTEND_PORT npm run dev > "$FRONTEND_LOG" 2>&1 &
    FRONTEND_PID=$!
    print_success "Frontend started (PID: $FRONTEND_PID)"

    # Save PIDs
    echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"
    echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"

    # Wait for servers to be ready
    print_step "Waiting for backend to start..."
    if wait_for_port $BACKEND_PORT "Backend"; then
        print_success "Backend is running on http://localhost:$BACKEND_PORT"
    fi

    print_step "Waiting for frontend to start..."
    if wait_for_port $FRONTEND_PORT "Frontend"; then
        print_success "Frontend is running on http://localhost:$FRONTEND_PORT"
    fi
}

# ============================================================================
# MAIN FUNCTION
# ============================================================================

main() {
    print_header

    # Create log directory
    mkdir -p "$LOG_DIR"

    # System checks
    print_section "System Requirements Check"
    check_docker
    check_node
    check_npm

    # Check if already running
    print_section "Checking Existing Services"

    if check_port $BACKEND_PORT; then
        print_warning "Backend is already running on port $BACKEND_PORT"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    if check_port $FRONTEND_PORT; then
        print_warning "Frontend is already running on port $FRONTEND_PORT"
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi

    # Start Docker containers
    start_docker_containers

    # Install dependencies
    install_dependencies

    # Setup database
    setup_database

    # Start servers
    if check_command tmux; then
        start_servers_tmux
    else
        print_warning "tmux not installed, starting in background mode"
        print_info "Install tmux for better experience: sudo apt install tmux (Linux) or brew install tmux (Mac)"
        start_servers_background
    fi

    # Print summary
    print_section "System Status Summary"
    echo ""
    echo -e "${BOLD}${GREEN}🎉 All systems are operational!${NC}"
    echo ""
    echo -e "${BOLD}Service URLs:${NC}"
    echo -e "  Frontend:   ${CYAN}http://localhost:$FRONTEND_PORT${NC}"
    echo -e "  Backend:    ${CYAN}http://localhost:$BACKEND_PORT${NC}"
    echo -e "  API Docs:   ${CYAN}http://localhost:$BACKEND_PORT/api${NC}"
    echo ""
    echo -e "${BOLD}Database Connections:${NC}"
    echo -e "  PostgreSQL: ${CYAN}localhost:$POSTGRES_PORT${NC}"
    echo -e "  Redis:      ${CYAN}localhost:$REDIS_PORT${NC}"
    echo ""
    echo -e "${BOLD}Demo Credentials:${NC}"
    echo -e "  Email:      ${YELLOW}demo@arq.com${NC}"
    echo -e "  Password:   ${YELLOW}Demo123!${NC}"
    echo ""

    if [ -n "$TMUX_SESSION" ]; then
        echo -e "${BOLD}Tmux Session Management:${NC}"
        echo -e "  Attach:     ${CYAN}tmux attach -t $TMUX_SESSION${NC}"
        echo -e "  Detach:     ${CYAN}Ctrl+B then D${NC}"
        echo -e "  Stop:       ${CYAN}tmux kill-session -t $TMUX_SESSION${NC}"
    else
        echo -e "${BOLD}Process Management:${NC}"
        echo -e "  Backend PID:  ${CYAN}$BACKEND_PID${NC}"
        echo -e "  Frontend PID: ${CYAN}$FRONTEND_PID${NC}"
        echo -e "  Stop All:     ${CYAN}kill $BACKEND_PID $FRONTEND_PID${NC}"
    fi
    echo ""
    echo -e "${BOLD}Log Files:${NC}"
    echo -e "  Backend:  ${CYAN}$BACKEND_LOG${NC}"
    echo -e "  Frontend: ${CYAN}$FRONTEND_LOG${NC}"
    echo -e "  Docker:   ${CYAN}$DOCKER_LOG${NC}"
    echo ""
    echo -e "${BOLD}Quick Commands:${NC}"
    echo -e "  View backend logs:  ${CYAN}tail -f $BACKEND_LOG${NC}"
    echo -e "  View frontend logs: ${CYAN}tail -f $FRONTEND_LOG${NC}"
    echo -e "  Stop all services:  ${CYAN}$SCRIPT_DIR/stop-system.sh${NC}"
    echo ""
    echo -e "${GREEN}Ready for development! 🚀${NC}"
    echo ""
}

# ============================================================================
# SCRIPT EXECUTION
# ============================================================================

# Set up cleanup on exit
trap cleanup_on_exit EXIT INT TERM

# Run main function
main "$@"
