"use client";

import { createContext, useContext } from "react";

export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
}

export interface UserContextType {
  user: UserData | null;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);
