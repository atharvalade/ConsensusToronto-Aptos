'use client';

import { useEffect, useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

export default function ClientWalletProvider({ children }) {
  // Track if we're on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if PetraWallet is available
    if (typeof window !== 'undefined') {
      console.log("Checking wallet availability...");
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
    }
  }, []);

  // Only render the provider on the client side to prevent hydration errors
  if (!isClient) {
    return <>{children}</>;
  }

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