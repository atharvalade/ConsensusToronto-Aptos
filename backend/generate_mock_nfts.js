/**
 * EcoChain Mock NFT Data Generator
 * 
 * This script generates mock NFT data for the UI to display.
 * Since we're having issues with the Aptos SDK, we'll create simulated NFT data
 * that can be used in the UI without actually minting NFTs on testnet.
 */

const fs = require('fs');
const path = require('path');

// Module address from our deployed contract
const MODULE_ADDRESS = '0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0';

// Load project data from JSON file
const projectDataPath = path.join(__dirname, 'project_data.json');
const { projects } = JSON.parse(fs.readFileSync(projectDataPath, 'utf8'));

// Recent transaction hashes from our contract deployments
const TRANSACTION_HASHES = [
  '0x1832770758d52e945e750c8631ea2925ae2638018545647c7eb820b271a8e468',
  '0xa1f57142a184ddb1ec4b0b658fb6b4614cb4fd7eb61630319b604831f294b0e2',
  '0x53655ef3c663b504a01f447f6d7f0e36a4a93e254af4bd4bcd5253aba297b52e',
  '0xb17a1ea8e874bf2e5ad671477b28111e9e3424397fa9a57809fba47536763387',
  '0x25763aa8658b825e8081b2ac9e6198f4edb54370b98a741a6ec434c88a8fdeef'
];

// Generate mock object addresses for each project
function generateObjectAddress(projectId) {
  // Use project ID to create a deterministic but unique address
  const hash = Array.from(projectId).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `${MODULE_ADDRESS.substring(0, 18)}${hash.toString(16).padStart(10, '0')}`;
}

// Generate NFT data
function generateNftDataForProject(project, index) {
  // Transaction hash for this NFT (cycle through available hashes)
  const txHash = TRANSACTION_HASHES[index % TRANSACTION_HASHES.length];
  
  // Generate deterministic object address based on project ID
  const objectAddress = generateObjectAddress(project.id);
  
  // Create NFT data
  return {
    ...project,
    nft_data: {
      collection_name: "EcoChain Carbon Credits",
      token_name: `${project.type} - ${project.id}`,
      token_uri: project.image || `https://images.unsplash.com/photo-${project.id}`,
      owner_address: MODULE_ADDRESS,
      contract_address: MODULE_ADDRESS,
      object_address: objectAddress,
      transaction_hash: txHash,
      minted_at: new Date().toISOString(),
      explorer_urls: {
        transaction: `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`,
        contract: `https://explorer.aptoslabs.com/account/${MODULE_ADDRESS}?network=testnet`,
        object: `https://explorer.aptoslabs.com/object/${objectAddress}?network=testnet`
      }
    }
  };
}

// Process projects and add NFT data
const projectsWithNftData = projects.map((project, index) => 
  generateNftDataForProject(project, index)
);

// Write the updated data to a new file
fs.writeFileSync(
  path.join(__dirname, 'project_data_with_nfts.json'),
  JSON.stringify({ projects: projectsWithNftData }, null, 2)
);

console.log('Mock NFT data generation complete!');
console.log('Updated project data saved to project_data_with_nfts.json');
console.log(`Total projects processed: ${projectsWithNftData.length}`);
console.log('\nSample NFT data for first project:');
console.log(JSON.stringify(projectsWithNftData[0].nft_data, null, 2)); 