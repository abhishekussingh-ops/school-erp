'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, User } from '@/lib/types';
import { users, branches } from '@/lib/mock-data';

interface AppContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: User;
  branchId: string;
  setBranchId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('school_admin');
  const [branchId, setBranchId] = useState<string>(branches[0].id);

  const currentUser = users.find(u => u.role === role) || users[0];

  return (
    <AppContext.Provider value={{ role, setRole, currentUser, branchId, setBranchId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
