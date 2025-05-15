/**
 * EcoChain Single NFT Minting Script
 * 
 * This script mints a single NFT for the Amazon Rainforest Conservation project.
 */

const { AptosClient, AptosAccount, HexString } = require('aptos');
const fs = require('fs');
const path = require('path');

// Configuration
const NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '0xc3116c5b545f634ae670194f6609a9a0df58dd47fe1eff6f5c916b6b68d559cf'; // Replace with your private key or use env variable
const MODULE_ADDRESS = '0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0';

// Initialize Aptos client
const client = new AptosClient(NODE_URL);

// Load the account using the private key
const account = new AptosAccount(HexString.ensure(PRIVATE_KEY).toUint8Array());

async function main() {
  try {
    console.log('EcoChain Single NFT Minting Script - Started');
    console.log(`Account Address: ${account.address().hex()}`);
    
    // Check account balance before proceeding
    const resources = await client.getAccountResources(account.address().hex());
    const accountResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
    
    if (accountResource) {
      const balance = parseInt(accountResource.data.coin.value);
      console.log(`Account balance: ${balance / 100000000} APT`);
    }

    // Create a transaction for minting a simple NFT
    const project = {
      id: "RF-2023-089",
      title: "Amazon Rainforest Conservation",
      location: "Brazil",
      type: "Reforestation"
    };
    
    // Create a simple transaction payload for creating an NFT
    const payload = {
      type: "entry_function_payload",
      function: "0x3::token::create_token_script",
      type_arguments: [],
      arguments: [
        // Collection name
        "EcoChain Carbon Credits",
        // Token name
        `${project.type} - ${project.id}`,
        // Description
        "Carbon credits for Amazon Rainforest Conservation",
        // Collection URI
        "https://ecochain.org",
        // Token URI
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80",
        // Royalty payee address
        account.address().hex(),
        // Collection maximum
        "0", // Unlimited
        // Token maximum
        "1", // NFT (supply = 1)
        // Collection mutability config (array of 3 booleans)
        [true, true, true],
        // Token mutability config (array of 5 booleans)
        [true, true, true, true, true],
        // Property keys
        ["location", "type", "id"],
        // Property values
        ["Brazil", "Reforestation", "RF-2023-089"],
        // Property types
        ["0x1::string::String", "0x1::string::String", "0x1::string::String"],
        // Royalty numerator
        "0",
        // Royalty denominator
        "100"
      ]
    };

    // Submit the transaction
    console.log("Submitting transaction to mint NFT...");
    const txnRequest = await client.generateTransaction(account.address(), payload);
    const signedTxn = await client.signTransaction(account, txnRequest);
    const txnResult = await client.submitTransaction(signedTxn);
    
    console.log(`Transaction submitted: ${txnResult.hash}`);
    
    // Wait for transaction
    await client.waitForTransaction(txnResult.hash);
    console.log("Transaction confirmed!");
    console.log(`View NFT at: https://explorer.aptoslabs.com/account/${account.address().hex()}/tokens?network=testnet`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
main(); 