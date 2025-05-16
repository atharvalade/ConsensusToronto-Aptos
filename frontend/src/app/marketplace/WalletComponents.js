'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Purchase button component with wallet functionality
function PurchaseButton({ project, purchasing, onStartPurchase, onCompletePurchase, onError }) {
  const { connected, wallet, account } = useWallet();
  const contractAddress = "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0";
  
  useEffect(() => {
    console.log("PurchaseButton mounted with wallet state:", {
      connected,
      wallet: wallet ? { name: wallet.name } : null,
      account: account ? { address: account.address } : null
    });
  }, [connected, wallet, account]);
  
  const handlePurchase = async () => {
    console.log("Purchase clicked with wallet state:", {
      connected,
      wallet: wallet ? { name: wallet.name } : null
    });
    
    if (!connected || !wallet) {
      console.log("Not connected to wallet, showing error");
      onError("Please connect your wallet first");
      return;
    }
    
    onStartPurchase();
    
    try {
      console.log("Starting purchase for project:", project.id);
      
      // Create transaction payload for NFT transfer
      const payload = {
        type: "entry_function_payload",
        function: `${contractAddress}::marketplace::purchase_credits`,
        type_arguments: [],
        arguments: [
          project.id, 
          "1", // Just 1 credit for demo
          project.pricePerTokenUSD ? project.pricePerTokenUSD.toString() : "1845" // Use price if available
        ]
      };

      // Format specifically for Petra wallet if needed
      const petraPayload = {
        function: `${contractAddress}::marketplace::purchase_credits`,
        type_arguments: [],
        arguments: [
          project.id, 
          "1", // Just 1 credit for demo
          project.pricePerTokenUSD ? project.pricePerTokenUSD.toString() : "1845" // Use price if available
        ]
      };

      console.log("Submitting transaction with payload:", payload);

      // Check if the Petra wallet is directly available in window
      const directPetraAvailable = typeof window !== 'undefined' && window.petra;
      
      // Try to submit the transaction with better error handling
      let pendingTransaction;
      let txHash;
      
      try {
        // First try direct Petra integration if available (since we know it's Petra wallet extension)
        if (directPetraAvailable) {
          console.log("Trying direct Petra wallet integration");
          try {
            const response = await window.petra.signAndSubmitTransaction(petraPayload);
            console.log("Direct Petra transaction successful:", response);
            txHash = response?.hash || response;
          } catch (petraError) {
            console.error("Direct Petra integration failed:", petraError);
            throw petraError; // Re-throw to try adapter approach
          }
        } 
        // Otherwise try the adapter method
        else if (wallet.signAndSubmitTransaction) {
          console.log("Direct Petra not available, trying wallet adapter transaction submission");
          pendingTransaction = await wallet.signAndSubmitTransaction(petraPayload);
          console.log("Wallet adapter transaction successful:", pendingTransaction);
          txHash = pendingTransaction?.hash || pendingTransaction?.txHash;
        } else {
          throw new Error("No transaction method available");
        }
      } catch (e) {
        console.error("First transaction attempt failed:", e);
        
        // Try alternative payload format as fallback
        try {
          if (directPetraAvailable) {
            console.log("Trying direct Petra with alternative payload format");
            // Try with different payload formats for Petra
            // Format 1: Simple payload without type
            const response = await window.petra.signAndSubmitTransaction({
              function: `${contractAddress}::marketplace::purchase_credits`,
              type_arguments: [],
              arguments: [
                project.id, 
                "1", 
                project.pricePerTokenUSD ? project.pricePerTokenUSD.toString() : "1845"
              ]
            });
            console.log("Alternative format successful:", response);
            txHash = response?.hash || response;
          } else if (wallet.signAndSubmitTransaction) {
            console.log("Trying wallet adapter with standard payload");
            pendingTransaction = await wallet.signAndSubmitTransaction(payload);
            console.log("Standard payload successful:", pendingTransaction);
            txHash = pendingTransaction?.hash || pendingTransaction?.txHash;
          } else {
            throw new Error("No fallback transaction method available");
          }
        } catch (fallbackError) {
          console.error("All transaction attempts failed:", fallbackError);
          throw new Error(`Transaction failed: ${fallbackError.message}`);
        }
      }

      console.log("Transaction submitted, hash:", txHash);
      
      if (!txHash) {
        console.warn("No transaction hash found in response");
        onError("Transaction was submitted but no transaction hash was returned");
        return;
      }
      
      // Try to wait for confirmation if possible
      try {
        if (wallet.aptosClient && typeof wallet.aptosClient.waitForTransaction === 'function') {
          console.log("Waiting for transaction confirmation via wallet adapter");
          await wallet.aptosClient.waitForTransaction(txHash);
        } else if (directPetraAvailable && window.petra.aptosClient) {
          console.log("Waiting for transaction confirmation via direct Petra integration");
          await window.petra.aptosClient.waitForTransaction(txHash);
        } else {
          console.log("No client available to wait for confirmation");
        }
        console.log("Transaction confirmed!");
      } catch (waitError) {
        console.warn("Could not wait for transaction, but it was submitted:", waitError);
        // We continue anyway as the transaction was submitted
      }
      
      onCompletePurchase(txHash);
    } catch (err) {
      console.error("Transaction error:", err);
      onError(err);
    }
  };

  return (
    <button 
      onClick={handlePurchase}
      disabled={purchasing}
      className={`${
        purchasing ? "bg-gray-500" : "bg-green-600 hover:bg-green-700"
      } text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center`}
    >
      {purchasing ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing
        </>
      ) : (
        "Purchase"
      )}
    </button>
  );
}

// Wallet connect button component
function WalletConnectButton() {
  const { connected, wallet, account, connect, disconnect, wallets } = useWallet();
  
  useEffect(() => {
    console.log("WalletConnectButton mounted with wallet state:", {
      connected,
      wallets: wallets.map(w => w.name),
      account: account ? 'present' : 'not present'
    });
  }, [connected, wallet, account, wallets]);
  
  // Format address to show a shortened version
  const formatAddress = (address) => {
    if (!address) return '';
    
    // Handle string addresses
    if (typeof address === 'string') {
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }
    
    // Handle when address is an object with toString() method
    if (address.toString) {
      const addressStr = address.toString();
      return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
    }
    
    // Fallback
    return 'Connected';
  };
  
  const connectWallet = async () => {
    try {
      console.log("Connecting wallet, available wallets:", wallets.map(w => w.name));
      // Specifically target Petra wallet if available
      const petraWallet = wallets.find(w => w.name === "Petra");
      if (petraWallet) {
        console.log("Found Petra wallet, connecting specifically to it");
        await connect(petraWallet.name);
      } else {
        console.log("No specific wallet selected, connecting to first available");
        await connect();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  return (
    <div className="flex items-center">
      {connected && account ? (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
            {formatAddress(account.address)}
          </span>
          <button
            onClick={disconnectWallet}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

// Export the components directly - no need for provider wrappers since we use the shared provider
export function WalletButton() {
  return <WalletConnectButton />;
}

// Main component
export default function WalletComponents(props) {
  return <PurchaseButton {...props} />;
} 