#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

// Promisify exec for better async handling
const execAsync = util.promisify(exec);

async function createProject() {
  const targetDir = process.argv[2] || '.';
  const templateDir = path.join(__dirname, '../templates');
  
  try {
    console.log('📁 Copying template files...');
    await fs.copy(templateDir, targetDir);
    console.log('✅ Template files copied successfully');
    
    // Change to the target directory for npm install
    const absoluteTargetDir = path.resolve(targetDir);
    
    console.log('📦 Installing dependencies...');
    console.log('This might take a moment...\n');
    
    // Run npm install in the target directory
    const { stdout, stderr } = await execAsync('npm install', {
      cwd: absoluteTargetDir
    });
    
    // Show npm install output
    if (stdout) console.log(stdout);
    if (stderr) console.log(stderr);
    
    console.log('🎉 Project created successfully!');
    console.log(`\nTo get started:`);
    if (targetDir !== '.') {
      console.log(`  cd ${targetDir}`);
    }
    console.log(`  npm run dev`);
    
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
    
    // More specific error handling
    if (error.message.includes('npm install')) {
      console.error('\n💡 Try running "npm install" manually in the project directory');
    }
    
    process.exit(1);
  }
}

createProject();