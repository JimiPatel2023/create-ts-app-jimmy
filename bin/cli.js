#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

async function createProject() {
  const targetDir = process.argv[2] || '.';
  const templateDir = path.join(__dirname, '../templates');
  
  try {
    await fs.copy(templateDir, targetDir);
    console.log(`✅ TypeScript project created in ${targetDir}`);
  } catch (error) {
    console.error('❌ Error creating project:', error.message);
  }
}

createProject();