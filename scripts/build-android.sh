#!/bin/bash
set -e

sdk=$SDK_VERSION

if [ -z "$sdk" ]; then
  echo "Error: SDK version is missing."
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "[1/7] Initializing environment"
mkdir -p "$PROJECT_ROOT/output"

echo "[2/7] Checking Docker Builder Image"
docker build -t autosdk-builder -f "$PROJECT_ROOT/docker/Dockerfile" "$PROJECT_ROOT"

echo "[3/7] Generating Android project and integrating SDK Version $sdk"
docker run --rm \
  -e SDK_VERSION=$sdk \
  -v "$PROJECT_ROOT/output":/output \
  autosdk-builder

echo "[7/7] Completed"
echo "Output: $PROJECT_ROOT/output/app-release.apk"
