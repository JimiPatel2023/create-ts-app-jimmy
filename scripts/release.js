#!/usr/bin/env node

const { execSync } = require('child_process');

function runCommand(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

function release() {
    const args = process.argv.slice(2);
    const releaseType = args[0];
    
    if (!['patch', 'minor', 'major'].includes(releaseType)) {
        console.error('Usage: npm run <patch|minor|major> -m "commit message"');
        process.exit(1);
    }
    
    // Find the commit message
    const msgIndex = args.indexOf('-m');
    let commitMessage = `chore: ${releaseType} release`;
    
    if (msgIndex !== -1 && args[msgIndex + 1]) {
        commitMessage = args[msgIndex + 1];
    }
    
    console.log(`🔄 Creating ${releaseType} release with message: "${commitMessage}"`);
    
    try {
        // Add all changes and commit if there are any
        console.log('📝 Committing changes...');
        runCommand('git add .');
        runCommand(`git diff --staged --quiet || git commit -m "${commitMessage}"`);
        
        // Version bump (this creates another commit with version number)
        console.log('🔢 Bumping version...');
        runCommand(`npm version ${releaseType}`);
        
        // Push everything
        console.log('📤 Pushing to GitHub...');
        runCommand('git push');
        runCommand('git push --tags');
        
        // Publish to npm
        console.log('📦 Publishing to npm...');
        runCommand('npm publish');
        
        console.log('🎉 Release completed successfully!');
        
    } catch (error) {
        console.error('❌ Release failed:', error.message);
        process.exit(1);
    }
}

release();