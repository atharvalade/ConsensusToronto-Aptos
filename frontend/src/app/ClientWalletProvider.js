'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the wallet components to prevent them from being included in SSR
const WalletProviderClient = dynamic(
  () => import('./WalletProviderClient').then((mod) => mod.default),
  { ssr: false }
);

export default function ClientWalletProvider({ children }) {
  // Simply render the children during SSR
  // The dynamic import will handle client-side rendering
  return (
    <WalletProviderClient>
      {children}
    </WalletProviderClient>
  );
} 