import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  // d'autres champs si besoin
};

interface DevUserContextType {
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
}

const DevUserContext = createContext<DevUserContextType | undefined>(undefined);

export function DevUserProvider({ children }: { children: React.ReactNode }) {
  const [activeUser, setActiveUser] = useState<User | null>(null);

  return (
    <DevUserContext.Provider value={{ activeUser, setActiveUser }}>
      {children}
    </DevUserContext.Provider>
  );
}

export function useDevUser() {
  const context = useContext(DevUserContext);
  if (!context) throw new Error("useDevUser must be used within DevUserProvider");
  return context;
}
