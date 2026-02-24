#!/bin/bash

echo -e "\n=== Environment Check ==="

function check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "❌ $2: Missing\n   Recommendation: $3"
        return 1
    else
        echo -e "✅ $2: OK"
        return 0
    fi
}

check_command "docker" "Docker" "Install Docker Desktop"
check_command "node" "Node.js" "Install Node.js (>= 18.x)"
check_command "npm" "npm" "Install npm"

if [[ "$OSTYPE" == "darwin"* ]]; then
    check_command "xcodebuild" "Xcode" "Install Xcode from App Store"
fi

# Check disk space (mostly just logging the available space on current drive)
AVAILABLE_GB=$(df -g . | awk 'NR==2 {print $4}')
if [ -n "$AVAILABLE_GB" ] && [ "$AVAILABLE_GB" -lt "10" ]; then
    echo -e "⚠️  Disk Space: Warning (Less than 10GB available)"
else
    echo -e "✅ Disk Space: OK"
fi

echo -e "=========================\n"
