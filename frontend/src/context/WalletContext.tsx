"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  network: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig });

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [network, setNetwork] = useState("testnet");

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      setAddress(userData.profile.stxAddress.testnet);
    }
  }, []);

  const connect = () => {
    setIsConnecting(true);
    setError(null);

    showConnect({
      appDetails: {
        name: "BitTrust",
        icon: "/icon.png",
      },
      redirectTo: "/",
      onFinish: () => {
        const userData = userSession.loadUserData();
        setAddress(userData.profile.stxAddress.testnet);
        setIsConnecting(false);
        window.location.reload();
      },
      onCancel: () => {
        setIsConnecting(false);
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setAddress(null);
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
        network,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
