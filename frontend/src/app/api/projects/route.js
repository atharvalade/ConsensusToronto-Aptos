import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the projects data file with NFTs
    const projectsFilePath = path.join(process.cwd(), '../../backend/project_data_with_nfts.json');
    
    let projectsData;
    
    try {
      // Try to read the file with NFT data first
      projectsData = JSON.parse(fs.readFileSync(projectsFilePath, 'utf8'));
    } catch (err) {
      // If file not found, use the original project data
      const originalProjectsPath = path.join(process.cwd(), '../../backend/project_data.json');
      projectsData = JSON.parse(fs.readFileSync(originalProjectsPath, 'utf8'));
    }
    
    return NextResponse.json(projectsData);
  } catch (err) {
    console.error('Error reading projects data:', err);
    
    // Return mock data if file reading fails
    return NextResponse.json({
      projects: [
        {
          id: "RF-2023-089",
          title: "Amazon Rainforest Conservation",
          location: "Brazil",
          type: "Reforestation",
          price: 1845,
          creditsAvailable: 12450,
          verified: true,
          nft_data: {
            collection_name: "EcoChain Carbon Credits",
            token_name: "Reforestation - RF-2023-089",
            owner_address: "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0",
            contract_address: "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0",
            object_address: "0xda14cb8535c599bd000000025a",
            transaction_hash: "0x1832770758d52e945e750c8631ea2925ae2638018545647c7eb820b271a8e468",
            explorer_urls: {
              transaction: "https://explorer.aptoslabs.com/txn/0x1832770758d52e945e750c8631ea2925ae2638018545647c7eb820b271a8e468?network=testnet",
              contract: "https://explorer.aptoslabs.com/account/0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0?network=testnet",
              object: "https://explorer.aptoslabs.com/object/0xda14cb8535c599bd000000025a?network=testnet"
            }
          }
        }
      ]
    });
  }
} 