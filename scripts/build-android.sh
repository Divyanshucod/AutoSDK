#!/bin/bash
set -e

sdk=$SDK_VERSION

if [ -z "$sdk" ]; then
  echo "Error: SDK version is missing."
  exit 1
fi

echo "[1/7] Initializing environment"
mkdir -p .autosdk-cache
mkdir -p output

echo "[2/7] Checking Docker Builder Image"
# Build the builder image first
docker build -t autosdk-builder -f docker/Dockerfile .

# If the command is to clean or if specific sdk is passed, we run the container and map output.
echo "[3/7] Generating Android project and integrating SDK Version $sdk"
# Let the docker image do the rest: npm install, react-native build.
# We mount the output path, template, app code etc.
# But everything inside docker should just build the Android artifact.

docker run --rm \
  -e SDK_VERSION=$sdk \
  -v $(pwd)/output:/output \
  -v $(pwd)/.autosdk-cache/npm:/root/.npm \
  autosdk-builder

echo "[7/7] Completed"
echo "Output: $(pwd)/output/app-release.apk"
