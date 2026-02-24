
AutoSDK Builder

AutoSDK Builder is an internal cross-platform build orchestration tool designed to generate and compile React Native test applications with configurable SDK versions.

It abstracts Android Docker builds and native iOS builds behind a single CLI interface.

What This Tool Provides

1. One unified CLI for Android & iOS builds

2. Docker-isolated Android build environment

3. Native macOS iOS compilation using Xcode

4. SDK version injection via CLI flag

5. Deterministic and reproducible builds

6. Clean separation between generation and platform compilation

7. Apple Silicon compatibility support

8. Internal environment diagnostics (doctor command)

## Architecture Overview

The tool follows a hybrid build strategy:

Platform	Build Environment
Android	Docker (Linux container)
iOS	Host macOS (Xcode toolchain)
Why this design?

Android tooling works reliably in Linux containers.

iOS builds require macOS kernel and Apple toolchains.

Docker ensures Android builds are reproducible across machines.

Host-native build ensures correct iOS compilation.

## How to Run Internally

1. Verify Your Environment
node cli/autosdk.js doctor

This checks:

Docker installation

Docker daemon status

Xcode availability (for iOS)

CocoaPods availability

Node version compatibility

2. Build Android (Docker-based)
node cli/autosdk.js build android --sdk=2.5.0

What happens internally:

Docker image is prepared (if not already cached)

React Native project is generated

SDK version is injected

Gradle compiles APK inside container

Output is exported to host

3. Build iOS (Native macOS)
node cli/autosdk.js build ios --sdk=2.5.0

What happens internally:

Xcode presence verified

Dependencies installed

CocoaPods installed

Native iOS project compiled using xcodebuild

## Output Location

After successful builds:

Android:

output/android/app-release.apk

iOS:

ios/build/Build/Products/Release-iphonesimulator/

## Requirements & Warnings

### Docker Requirement

Testing requires the Docker daemon to be actively running to compile Android applications.

If Docker is not running:

Error: Docker daemon not detected.
CocoaPods Requirement (iOS)

The iOS compilation script expects CocoaPods (pod) to be globally installed.

Install if missing:

sudo gem install cocoapods

### Apple Silicon (M1/M2/M3/M4/M5+) Users

The Android build environment uses a linux/amd64 Docker image because official React Native Android images lack ARM64 support.

The --platform=linux/amd64 flag in docker/Dockerfile forces emulation.

Required Setup

Ensure Rosetta for x86_64/amd64 emulation is enabled in Docker Desktop:

Settings → Features in Development → 
Use Rosetta for x86/amd64 emulation on Apple Silicon

Without this enabled, Android builds may fail or perform poorly.

### Performance Notes

First build may take 10–20 minutes due to:

Android SDK installation

NDK installation

Gradle dependency resolution

Subsequent builds are significantly faster due to Docker and Gradle caching.

### Available Commands

Command	        Description
doctor	        Validate system dependencies
build android	Generate and compile Android APK
build ios	    Generate and compile iOS build
clean	        Remove temporary build artifacts