#!/usr/bin/env node

/**
 * Marketplace Initialization Script for EcoChain
 * 
 * This script generates the Aptos CLI commands to initialize the marketplace 
 * and create all projects from the project_data.json file.
 */

const fs = require('fs');
const path = require('path');

// Load project data
const projectData = JSON.parse(fs.readFileSync(path.join(__dirname, 'project_data.json'), 'utf8'));

/**
 * Generate a command to initialize the marketplace
 */
function generateMarketplaceInitCommand() {
  return `aptos move run \\
  --function-id YOUR_ADDRESS::marketplace::initialize \\
  --max-gas=5000`;
}

/**
 * Generate a command to create a project in the marketplace
 */
function generateCreateProjectCommand(project) {
  // Convert price from cents to the price format used in the contract
  const price = project.price;
  const creditsAvailable = project.creditsAvailable;
  
  return `aptos move run \\
  --function-id YOUR_ADDRESS::verification::create_project \\
  --args string:"${project.id}" string:"${project.title}" string:"${project.location}" \\
  string:"${project.description}" \\
  string:"${project.category}" u64:${creditsAvailable} u64:${price} \\
  --max-gas=5000`;
}

/**
 * Main function
 */
function main() {
  // Create scripts directory if it doesn't exist
  const scriptsDir = path.join(__dirname, 'marketplace_scripts');
  
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }
  
  console.log('EcoChain Marketplace Initialization');
  console.log('==================================');
  
  // Generate marketplace init command
  const initCommand = generateMarketplaceInitCommand();
  fs.writeFileSync(
    path.join(scriptsDir, 'init_marketplace.sh'),
    `#!/bin/bash\n\n${initCommand}\n`
  );
  console.log('Generated marketplace initialization command');
  
  // Generate create project commands for each project
  for (const project of projectData.projects) {
    const createCommand = generateCreateProjectCommand(project);
    
    const commandFileName = `create_${project.id.replace(/-/g, '_')}.sh`;
    fs.writeFileSync(
      path.join(scriptsDir, commandFileName),
      `#!/bin/bash\n\n${createCommand}\n`
    );
    
    console.log(`Generated command to create project: ${project.title} (${project.id})`);
  }
  
  // Create the run-all script
  const allCommands = [
    './init_marketplace.sh',
    ...projectData.projects.map(p => `./create_${p.id.replace(/-/g, '_')}.sh`)
  ].join('\n');
  
  fs.writeFileSync(
    path.join(scriptsDir, 'initialize_all.sh'),
    `#!/bin/bash\n\n# Initialize marketplace\n${allCommands}\n`
  );
  
  // Make scripts executable
  fs.chmodSync(path.join(scriptsDir, 'initialize_all.sh'), 0o755);
  fs.chmodSync(path.join(scriptsDir, 'init_marketplace.sh'), 0o755);
  
  console.log('\nAll initialization scripts generated successfully.');
  console.log('To initialize the marketplace and create all projects:');
  console.log('1. Update the YOUR_ADDRESS placeholder in the scripts with your actual address');
  console.log('2. Run: cd marketplace_scripts && ./initialize_all.sh');
}

// Run the main function
main(); 