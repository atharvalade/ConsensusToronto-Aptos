'use client';

import { useEffect } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

export default function WalletProviderClient({ children }) {
  useEffect(() => {
    // Check if PetraWallet is available
    console.log("WalletProviderClient mounted");
    console.log("Petra wallet available:", !!window.petra);
      
    // Log available wallet interfaces for debugging
    console.log("Available wallet interfaces:", {
      petra: !!window.petra,
      martian: !!window.martian,
      aptosWallet: !!window.aptosWallet,
      hippoWallet: !!window.hippoWallet,
      pontem: !!window.pontem,
      fewcha: !!window.fewcha
    });
  }, []);

  return (
    <AptosWalletAdapterProvider 
      plugins={[new PetraWallet()]} 
      autoConnect={false}
      onError={(error) => console.error("Wallet adapter error:", error)}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
} 