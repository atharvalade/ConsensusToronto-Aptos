'use client';

import { useState, useEffect } from 'react';
import { useWallet, AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

// Purchase button component with wallet functionality
function PurchaseButton({ project, purchasing, onStartPurchase, onCompletePurchase, onError }) {
  const { connected, wallet, account } = useWallet();
  const contractAddress = "0xda14cb8535c599bd7eeedaf980c4e6fa8c1605047ff88403b6120f7437b7b6c0";
  
  const handlePurchase = async () => {
    if (!connected || !wallet) {
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

      console.log("Submitting transaction with payload:", payload);

      // Different wallets might have different API signatures
      let pendingTransaction;
      try {
        // First try the standard method
        pendingTransaction = await wallet.signAndSubmitTransaction(payload);
      } catch (e) {
        console.log("Standard transaction submission failed, trying alternative method");
        // Some wallets might expect a different format
        pendingTransaction = await wallet.signAndSubmitTransaction({
          payload: payload
        });
      }
      
      console.log("Transaction submitted:", pendingTransaction);
      
      // Wait for transaction confirmation if the wallet provides an aptosClient
      if (wallet.aptosClient) {
        try {
          console.log("Waiting for transaction confirmation...");
          await wallet.aptosClient.waitForTransaction(pendingTransaction.hash);
          console.log("Transaction confirmed!");
        } catch (waitError) {
          console.warn("Could not wait for transaction, but it was submitted:", waitError);
          // We continue anyway as the transaction was submitted
        }
      }
      
      onCompletePurchase(pendingTransaction.hash || pendingTransaction.txHash || pendingTransaction);
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
      // Specifically target Petra wallet if available
      const petraWallet = wallets.find(w => w.name === "Petra");
      if (petraWallet) {
        await connect(petraWallet.name);
      } else {
        // Fall back to any available wallet
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

// Exported WalletButton with provider
export function WalletButton() {
  return (
    <AptosWalletAdapterProvider plugins={[new PetraWallet()]} autoConnect={false}>
      <WalletConnectButton />
    </AptosWalletAdapterProvider>
  );
}

// Main component that wraps everything with AptosWalletAdapterProvider
export default function WalletComponents(props) {
  return (
    <AptosWalletAdapterProvider plugins={[new PetraWallet()]} autoConnect={false}>
      <PurchaseButton {...props} />
    </AptosWalletAdapterProvider>
  );
} 