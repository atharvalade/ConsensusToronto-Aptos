/**
 * EcoChain NFT Minting Script
 * 
 * This script mints NFTs for all projects displayed in the UI.
 * It uses the Aptos TS SDK to interact with the smart contracts.
 */

const { AptosClient, AptosAccount, TokenClient, HexString } = require('aptos');
const fs = require('fs');
const path = require('path');

// Configuration
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xc3116c5b545f634ae670194f6609a9a0df58dd47fe1eff6f5c916b6b68d559cf'; // Replace with your private key or use env variable
const MODULE_ADDRESS = '0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0';

// Initialize Aptos clients
const client = new AptosClient(NODE_URL);
const tokenClient = new TokenClient(client);

// Load the account using the private key
const account = new AptosAccount(HexString.ensure(PRIVATE_KEY).toUint8Array());

// Load project data from JSON file
const projectDataPath = path.join(__dirname, 'project_data.json');
const { projects } = JSON.parse(fs.readFileSync(projectDataPath, 'utf8'));

async function main() {
  try {
    console.log('EcoChain NFT Minting Script - Started');
    console.log(`Account Address: ${account.address().hex()}`);
    console.log(`Module Address: ${MODULE_ADDRESS}`);
    
    // Check account balance before proceeding
    const resources = await client.getAccountResources(account.address().hex());
    const accountResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    
    if (accountResource) {
      const balance = parseInt(accountResource.data.coin.value);
      console.log(`Account balance: ${balance / 100000000} APT`);
      
      if (balance < 10000000) { // 0.1 APT
        console.error('Warning: Account balance is low. Make sure you have enough APT for transactions.');
      }
    }

    // Create a collection for the projects if it doesn't exist
    console.log('\nCreating collection...');
    const collectionName = 'EcoChain Carbon Credits';
    const collectionDescription = 'Verified carbon credit certificates for environmental projects';
    const collectionUri = 'https://ecochain.org';
    
    try {
      const createCollectionTx = await tokenClient.createCollection(
        account,
        collectionName,
        collectionDescription,
        collectionUri
      );
      await client.waitForTransaction(createCollectionTx);
      console.log(`Collection created. Transaction hash: ${createCollectionTx}`);
    } catch (error) {
      // Collection might already exist
      console.log('Collection may already exist or there was an error creating it.');
      console.log('Error:', error.message);
    }
    
    // Process each project
    console.log('\nMinting NFTs for projects...');
    for (const project of projects) {
      try {
        console.log(`\nMinting NFT for project: ${project.title} (ID: ${project.id})`);
        
        // Create token properties
        const tokenName = `${project.type} - ${project.id}`;
        const tokenDescription = project.description || `Carbon credits for ${project.title}`;
        const tokenUri = project.coordinates ? 
          `https://maps.google.com/maps?q=${project.coordinates.latitude},${project.coordinates.longitude}&z=8&output=embed` :
          "https://ecochain.org/project_image.jpg";
        
        // Mint NFT
        const mintTx = await tokenClient.createToken(
          account,
          collectionName,
          tokenName,
          tokenDescription,
          1, // Supply - 1 for NFT
          tokenUri,
          account.address().hex(), // Royalty payee
          100, // Royalty points denominator
          0, // Royalty points numerator
          [
            'location', 'type', 'co2Offset', 'price', 
            'creditsAvailable', 'verified', 'rating'
          ], // Property keys
          [
            project.location || '', 
            project.type || '', 
            project.co2TonsPerCredit?.toString() || '1', 
            project.price?.toString() || '0',
            project.creditsAvailable?.toString() || '0', 
            project.verified?.toString() || 'false', 
            project.rating?.toString() || '0'
          ], // Property values
          [
            'string', 'string', 'string', 'string',
            'string', 'string', 'string'
          ] // Property types
        );
        
        // Wait for transaction
        await client.waitForTransaction(mintTx);
        console.log(`NFT minted. Transaction hash: ${mintTx}`);
        
        // Record the transaction hash in our data
        project.transactionHash = mintTx;
        project.tokenName = tokenName;
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error minting NFT for project ${project.id}:`, error);
      }
    }
    
    // Update the project data file with transaction hashes
    fs.writeFileSync(
      path.join(__dirname, 'project_data_with_nfts.json'),
      JSON.stringify({ projects }, null, 2)
    );
    
    console.log('\nNFT minting complete!');
    console.log('Updated project data saved to project_data_with_nfts.json');
    
  } catch (error) {
    console.error('Fatal error:', error);
  }
}

// Run the script
main(); 