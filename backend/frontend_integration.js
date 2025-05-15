/**
 * Frontend Integration Guide for EcoChain Aptos Blockchain
 * 
 * This file demonstrates how to integrate the frontend with the Aptos blockchain.
 * It contains sample code for connecting to Aptos, sending transactions, and 
 * querying the blockchain for verification data.
 */

// --- INSTALLATION ---
// You'll need to install these packages:
// npm install aptos @aptos-labs/wallet-adapter-react

// --- WALLET INTEGRATION ---
import { 
  AptosWalletAdapterProvider, 
  useWallet 
} from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { MartianWallet } from "@martianwallet/aptos-wallet-adapter";

// Configure wallets
const wallets = [
  new PetraWallet(),
  new MartianWallet(),
];

// Wrap your app with the provider
function AppWithWallet() {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <App />
    </AptosWalletAdapterProvider>
  );
}

// --- SMART CONTRACT INTERACTION ---

// Sample React component that interacts with the Aptos blockchain
function AptosDemoComponent() {
  const { 
    account, 
    connected, 
    wallet, 
    connect, 
    disconnect, 
    signAndSubmitTransaction 
  } = useWallet();
  
  // Contract address - using the Petra wallet address
  const MODULE_ADDRESS = "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0";
  
  // Connect wallet
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  // Check project verification status
  const checkVerificationStatus = async (projectId) => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }
    
    try {
      const response = await wallet.aptosClient.view({
        function: `${MODULE_ADDRESS}::verification::get_verification_status`,
        type_arguments: [],
        arguments: [projectId]
      });
      
      // Status codes: 0 = pending, 1 = verified, 2 = rejected
      const statusCodes = {
        0: "Pending",
        1: "Verified",
        2: "Rejected"
      };
      
      return {
        status: statusCodes[response[0]],
        statusCode: response[0]
      };
    } catch (error) {
      console.error("Error checking verification status:", error);
      return {
        status: "Error",
        statusCode: -1
      };
    }
  };
  
  // Purchase carbon credits
  const purchaseCarbonCredits = async (projectId, credits, pricePerCredit) => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }
    
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::marketplace::purchase_credits`,
          type_arguments: [],
          arguments: [projectId, credits.toString(), pricePerCredit.toString()]
        }
      });
      
      // Wait for transaction to complete
      await wallet.aptosClient.waitForTransaction(response.hash);
      return {
        success: true,
        transactionHash: response.hash
      };
    } catch (error) {
      console.error("Error purchasing carbon credits:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Retire carbon credits
  const retireCarbonCredits = async (projectId, credits, pricePerCredit) => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }
    
    try {
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::marketplace::retire_credits`,
          type_arguments: [],
          arguments: [projectId, credits.toString(), pricePerCredit.toString()]
        }
      });
      
      // Wait for transaction to complete
      await wallet.aptosClient.waitForTransaction(response.hash);
      return {
        success: true,
        transactionHash: response.hash
      };
    } catch (error) {
      console.error("Error retiring carbon credits:", error);
      return {
        success: false,
        error: error.message
      };
    }
  };
  
  // Get market data
  const getMarketData = async () => {
    if (!connected) {
      console.error("Wallet not connected");
      return;
    }
    
    try {
      const totalSold = await wallet.aptosClient.view({
        function: `${MODULE_ADDRESS}::marketplace::get_total_credits_sold`,
        type_arguments: [],
        arguments: []
      });
      
      const totalRetired = await wallet.aptosClient.view({
        function: `${MODULE_ADDRESS}::marketplace::get_total_credits_retired`,
        type_arguments: [],
        arguments: []
      });
      
      return {
        totalCreditsSold: totalSold[0],
        totalCreditsRetired: totalRetired[0]
      };
    } catch (error) {
      console.error("Error getting market data:", error);
      return {
        totalCreditsSold: 0,
        totalCreditsRetired: 0
      };
    }
  };
  
  // UI render (sample)
  return (
    <div>
      {connected ? (
        <>
          <p>Connected: {account.address}</p>
          <button onClick={disconnect}>Disconnect</button>
          
          {/* Verification status check */}
          <button onClick={() => checkVerificationStatus("RF-2023-089")}>
            Check Amazon Project Status
          </button>
          
          {/* Purchase and retire buttons */}
          <button onClick={() => purchaseCarbonCredits("RF-2023-089", 10, 1845)}>
            Purchase 10 Credits (Amazon Project)
          </button>
          
          <button onClick={() => retireCarbonCredits("RF-2023-089", 5, 1845)}>
            Retire 5 Credits (Amazon Project)
          </button>
          
          {/* Get market stats */}
          <button onClick={getMarketData}>
            Get Market Statistics
          </button>
        </>
      ) : (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

// --- USAGE IN NEXTJS PAGES ---

// For verification.js page, you can add this code to display verified projects with blockchain data
function getVerifiedProjects() {
  // This would typically be a hook that fetches data from your API or directly from the blockchain
  const [projects, setProjects] = useState([]);
  const { connected, wallet } = useWallet();
  const MODULE_ADDRESS = "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0";
  
  useEffect(() => {
    // If we're connected to a wallet, fetch verified projects
    if (connected) {
      // This would fetch project data from backend or directly from blockchain
      // For demo purposes, we're using static data from our JSON
      fetch('/api/projects')
        .then(res => res.json())
        .then(async (data) => {
          // For each project, check its verification status
          const projectsWithStatus = await Promise.all(data.projects.map(async (project) => {
            // Check verification status from blockchain
            try {
              const response = await wallet.aptosClient.view({
                function: `${MODULE_ADDRESS}::verification::get_verification_status`,
                type_arguments: [],
                arguments: [project.id]
              });
              
              return {
                ...project,
                verificationStatus: response[0] === 1 ? "Verified" : "Pending"
              };
            } catch (error) {
              console.error(`Error checking status for project ${project.id}:`, error);
              return {
                ...project,
                verificationStatus: "Unknown"
              };
            }
          }));
          
          // Filter only verified projects
          setProjects(projectsWithStatus.filter(p => p.verificationStatus === "Verified"));
        });
    }
  }, [connected, wallet]);
  
  return projects;
}

// --- API ENDPOINTS ---

// Sample Next.js API route for projects
/*
// In pages/api/projects.js
import projectData from '../../backend/project_data.json';

export default function handler(req, res) {
  res.status(200).json(projectData);
}
*/

// --- ENVIRONMENT SETUP ---

// Add this to your .env.local file:
/*
NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0
*/ 