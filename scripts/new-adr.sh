#!/usr/bin/env bash
# new-adr.sh
# Implements: ARCHITECTURE-DECISIONS.md
# Creates a new ADR with auto-incremented number

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Print functions
success() { echo -e "${GREEN}✓${NC} $1"; }
warning() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; exit 1; }

# Usage
usage() {
    echo "Usage: $0 <kebab-case-title>"
    echo ""
    echo "Creates a new ADR in /docs/decisions/ with auto-incremented number."
    echo ""
    echo "Example:"
    echo "  $0 use-postgres-for-database"
    echo "  → Creates 0001-use-postgres-for-database.md"
    exit 1
}

# Validate input
if [ -z "$1" ]; then
    error "Missing required argument: kebab-case-title"
    usage
fi

SLUG="$1"

# Validate slug format (kebab-case)
if [[ ! "$SLUG" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
    error "Title must be kebab-case (lowercase letters, numbers, hyphens only)"
fi

# Find the decisions directory
DECISIONS_DIR="docs/decisions"
if [ ! -d "$DECISIONS_DIR" ]; then
    DECISIONS_DIR="./decisions"
fi
if [ ! -d "$DECISIONS_DIR" ]; then
    error "Cannot find decisions directory. Run from project root."
fi

# Find the template
TEMPLATE="$DECISIONS_DIR/_template.md"
if [ ! -f "$TEMPLATE" ]; then
    # Fall back to lab-standards template path
    TEMPLATE="lab-templates/docs/decisions/_adr-template.md"
fi
if [ ! -f "$TEMPLATE" ]; then
    error "Cannot find ADR template at $TEMPLATE"
fi

# Find the next ADR number
LAST_NUM=$(ls -1 "$DECISIONS_DIR" | grep -E '^[0-9]{4}-' | sort -r | head -1 | cut -c1-4 || echo "0000")
NEXT_NUM=$(printf "%04d" $((10#$LAST_NUM + 1)))

# Create the new ADR
NEW_FILE="$DECISIONS_DIR/${NEXT_NUM}-${SLUG}.md"

if [ -f "$NEW_FILE" ]; then
    error "File already exists: $NEW_FILE"
fi

# Copy template and replace placeholder
cp "$TEMPLATE" "$NEW_FILE"

# Convert slug to title case for the heading
TITLE=$(echo "$SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')

# Replace NNNN and Title in the template
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/NNNN/$NEXT_NUM/g" "$NEW_FILE"
    sed -i '' "s/# $NEXT_NUM — Title/# $NEXT_NUM — $TITLE/g" "$NEW_FILE"
else
    # Linux
    sed -i "s/NNNN/$NEXT_NUM/g" "$NEW_FILE"
    sed -i "s/# $NEXT_NUM — Title/# $NEXT_NUM — $TITLE/g" "$NEW_FILE"
fi

success "Created: $NEW_FILE"
echo ""
echo "Next steps:"
echo "  1. Edit $NEW_FILE"
echo "  2. Set status to 'Proposed'"
echo "  3. Fill in context, decision, and consequences"
echo "  4. Open a PR for review"
echo "  5. Update status to 'Accepted' after approval"
