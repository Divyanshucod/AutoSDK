#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const command = args[0];
const target = args[1];

const PLATFORMS = ['android', 'ios'];

// Helper to parse --sdk=version and --debug flags
function parseFlags(argsList) {
    const flags = { sdk: null, debug: false };
    for (const arg of argsList) {
        if (arg.startsWith('--sdk=')) {
            flags.sdk = arg.split('=')[1];
        } else if (arg === '--debug') {
            flags.debug = true;
        }
    }
    return flags;
}

const flags = parseFlags(args);

if (command === 'doctor') {
    console.log('Running AutoSDK Doctor...');
    try {
        execSync(`bash ${path.join(__dirname, '../scripts/doctor.sh')}`, { stdio: 'inherit' });
    } catch (e) {
        process.exit(1);
    }
    process.exit(0);
}

if (command === 'clean') {
    console.log('Cleaning AutoSDK build cache...');
    const cacheDir = path.join(process.cwd(), '.autosdk');
    if (fs.existsSync(cacheDir)) {
        fs.rmSync(cacheDir, { recursive: true, force: true });
        console.log('Cleaned .autosdk directory.');
    } else {
        console.log('Nothing to clean.');
    }
    process.exit(0);
}


if (command !== 'build') {
    console.error(`Usage:
    autosdk build [android|ios] --sdk=<version> [--debug]
    autosdk doctor
    autosdk clean
    `);
    process.exit(1);
}

if (!PLATFORMS.includes(target)) {
    console.error(`Invalid platform: ${target}. Must be 'android' or 'ios'.`);
    process.exit(1);
}

if (!flags.sdk) {
    console.error(`Error: --sdk version is required. Example: --sdk=2.5.0`);
    process.exit(1);
}

console.log(`Starting AutoSDK Build for ${target.toUpperCase()}`);
console.log(`SDK Version: ${flags.sdk}`);
console.log(`Debug Mode: ${flags.debug ? 'ON' : 'OFF'}`);

try {
    const scriptPath = path.join(__dirname, `../scripts/build-${target}.sh`);
    const env = { ...process.env, SDK_VERSION: flags.sdk };
    if (flags.debug) {
        env.DEBUG_MODE = '1';
    }
    
    // Execute the respective bash script
    execSync(`bash ${scriptPath}`, { stdio: 'inherit', env });
} catch (error) {
    console.error('\nBUILD FAILED');
    console.error('An error occurred during the build process.');
    if (flags.debug) {
        console.error(error);
    }
    process.exit(1);
}
