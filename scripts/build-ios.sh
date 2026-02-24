#!/bin/bash
set -e

sdk=$SDK_VERSION

if [ -z "$sdk" ]; then
  echo "Error: SDK version is missing."
  exit 1
fi

echo "[1/7] Initializing environment for iOS Build"
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Xcode not installed"
    exit 1
fi

echo "[2/7] Generating project from template"
# Ensure we build outside the source templates
BUILD_DIR=".autosdk-build-ios"
rm -rf $BUILD_DIR
mkdir -p $BUILD_DIR
cp -r templates/rn-project-template/ $BUILD_DIR/

cd $BUILD_DIR

echo "[3/7] Integrating SDK Version $sdk"
# Update package.json using a temp node script for safety rather than sed
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
pkg.dependencies['react-native-hyperkyc-sdk'] = '$sdk';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

echo "[4/7] Installing JS dependencies"
npm install --no-audit --no-fund

echo "[5/7] Installing iOS Pods"
cd ios
pod install
cd ..

echo "[6/7] Building iOS Application (Release)"
npx react-native run-ios --configuration Release

echo "[7/7] Completed"
# The .app is somewhere in derived data, but simply launching it is usually enough for local dev.
echo "App deployed to iOS Simulator."

cd ..
