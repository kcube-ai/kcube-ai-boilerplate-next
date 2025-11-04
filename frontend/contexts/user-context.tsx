"use client";

import { UsersService, type UserPublic } from "@/app/client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface UserContextType {
  user: UserPublic | null;
  setUser: (user: UserPublic | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserPublic | null>(null);

  const refreshUser = async () => {
    try {
      const updatedUser = await UsersService.getMeApiV1UserMeGet();
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
