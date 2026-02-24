import React, { createContext, useContext, useState } from 'react';

interface NetworkContextType {
  selectedNetwork: string;
  setSelectedNetwork: (network: string) => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [selectedNetwork, setSelectedNetwork] = useState('4G');

  return (
    <NetworkContext.Provider value={{ selectedNetwork, setSelectedNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
}