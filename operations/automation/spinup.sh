#!/bin/bash

# FFTC Project Spinup Script
# Usage: ./spinup.sh [project-name]

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
RESET='\033[0m'

echo ""
echo "=========================================="
echo "  FFTC Project Spinup"
echo "=========================================="
echo ""

# Check for project name argument
if [ -z "$1" ]; then
  echo -e "${RED}Error: Project name required${RESET}"
  echo "Usage: ./spinup.sh [project-name]"
  exit 1
fi

PROJECT_NAME=$1
echo "Creating project: $PROJECT_NAME"
echo ""

# Clone the template repository
echo "Cloning project template..."
# git clone <template-repo-url> "$PROJECT_NAME"
# cd "$PROJECT_NAME"

# Verify project structure
echo "Verifying project structure..."

if [ -f "tokens.json" ]; then
  echo -e "${GREEN}  ✓ Design tokens present${RESET}"
else
  echo -e "${YELLOW}  ⚠ tokens.json not found — design tokens may not be configured${RESET}"
fi

if [ -f "package.json" ]; then
  echo -e "${GREEN}  ✓ package.json present${RESET}"
else
  echo -e "${RED}  ✗ package.json not found${RESET}"
fi

if [ -f "CLAUDE.md" ]; then
  echo -e "${GREEN}  ✓ CLAUDE.md present${RESET}"
else
  echo -e "${YELLOW}  ⚠ CLAUDE.md not found${RESET}"
fi

echo ""
echo "Project setup complete!"
echo ""
