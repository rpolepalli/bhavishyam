#!/bin/bash
# Detect whether to use Docker or Podman

# Check for Podman first
if command -v podman &> /dev/null; then
    export CONTAINER_RUNTIME=podman
    export COMPOSE_CMD=podman-compose
    echo "Using Podman"
    return 0 2>/dev/null || exit 0
fi

# Check for Docker
if command -v docker &> /dev/null; then
    export CONTAINER_RUNTIME=docker
    export COMPOSE_CMD=docker-compose
    echo "Using Docker"
    return 0 2>/dev/null || exit 0
fi

# Neither found
echo "❌ Neither Docker nor Podman found. Please install one of them."
return 1 2>/dev/null || exit 1