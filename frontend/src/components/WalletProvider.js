'use client';

import { useEffect, useState } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

export default function WalletProvider({ children }) {
  // Track if we're on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track if PetraWallet is available
  const [petraAvailable, setPetraAvailable] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log("Checking wallet availability...");
      setPetraAvailable(!!window.petra);
      
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

  // Only render the provider on the client side
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