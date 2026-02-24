#!/bin/bash
set -e

sdk=$SDK_VERSION

if [ -z "$sdk" ]; then
  echo "Error: SDK_VERSION env variable is missing inside container."
  exit 1
fi

echo "[Docker] Copying template to workspace"
# We do this so the base template node_modules is preserved, and we only install new stuff
cp -r /workspace/rn-project-template /workspace/app
cd /workspace/app

echo "[Docker] Integrating SDK Version $sdk"
# Update package.json using a temp node script
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json'));
pkg.dependencies['react-native-hyperkyc-sdk'] = '$sdk';
fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
"

echo "[Docker] Installing JS dependencies"
# Point to npm cache if mounted, otherwise it just installs
npm install --no-audit --no-fund --cache /root/.npm

echo "[Docker] Building Android Release APK..."
cd android
./gradlew assembleRelease
cd ..

echo "[Docker] Copying Output"
# /output is mounted from host
if [ -f android/app/build/outputs/apk/release/app-release.apk ]; then
  cp android/app/build/outputs/apk/release/app-release.apk /output/
  echo "[Docker] Successfully generated app-release.apk"
else
  echo "[Docker] ERROR: app-release.apk was not found!"
  exit 1
fi
