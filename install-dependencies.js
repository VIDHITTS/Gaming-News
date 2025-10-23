#!/usr/bin/env node

/**
 * Installation script for API improvements dependencies
 * Run this script to install all required dependencies
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing API improvements dependencies...\n');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ package.json not found!');
    process.exit(1);
}

// Read current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Dependencies to install
const newDependencies = {
    'express-rate-limit': '^7.1.5',
    'express-slow-down': '^2.0.1',
    'node-cache': '^5.1.2',
    'compression': '^1.7.4',
    'helmet': '^7.1.0'
};

console.log('📦 Installing dependencies:');
Object.entries(newDependencies).forEach(([dep, version]) => {
    console.log(`   - ${dep}@${version}`);
});

console.log('\n⏳ Installing...');

try {
    // Install dependencies
    execSync('npm install', { stdio: 'inherit' });
    
    console.log('\n✅ Dependencies installed successfully!');
    
    // Verify installation
    console.log('\n🔍 Verifying installation...');
    const installedDeps = Object.keys(newDependencies);
    
    installedDeps.forEach(dep => {
        try {
            require(dep);
            console.log(`   ✅ ${dep} - OK`);
        } catch (error) {
            console.log(`   ❌ ${dep} - Failed to load`);
        }
    });
    
    console.log('\n🎉 Installation complete!');
    console.log('\n📋 Next steps:');
    console.log('   1. Set up your YouTube API key in .env file:');
    console.log('      YOUTUBE_API_KEY=your_api_key_here');
    console.log('   2. Start the server: npm start');
    console.log('   3. Test the API: curl http://localhost:3000/api/health');
    
} catch (error) {
    console.error('\n❌ Installation failed:', error.message);
    process.exit(1);
}
