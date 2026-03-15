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
    // Hydrate from existing session on first client render
    if (typeof window === "undefined") return;
    if (!userSession.isUserSignedIn()) return;

    const userData = userSession.loadUserData();
    const profileAddress = userData?.profile?.stxAddress;

    if (profileAddress?.mainnet) {
      setAddress(profileAddress.mainnet);
      setNetwork("mainnet");
    } else if (profileAddress?.testnet) {
      setAddress(profileAddress.testnet);
      setNetwork("testnet");
    }
  }, []);

  const connect = () => {
    if (typeof window === "undefined") return;

    setIsConnecting(true);
    setError(null);

    try {
      showConnect({
        appDetails: {
          name: "BitTrust",
          icon: window.location.origin + "/icon.png",
        },
        redirectTo: "/",
        onFinish: () => {
          const userData = userSession.loadUserData();
          const profileAddress = userData?.profile?.stxAddress;

          if (profileAddress?.mainnet) {
            setAddress(profileAddress.mainnet);
            setNetwork("mainnet");
          } else if (profileAddress?.testnet) {
            setAddress(profileAddress.testnet);
            setNetwork("testnet");
          }

          setIsConnecting(false);
        },
        onCancel: () => {
          setIsConnecting(false);
        },
        userSession,
      });
    } catch (e) {
      setIsConnecting(false);
      setError(
        "Failed to open Stacks wallet. Ensure a single wallet extension (e.g. Xverse) is enabled."
      );
    }
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
