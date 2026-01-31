'use client'

import React from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { getCurrentUser, removeAuthToken } from '@/lib/auth';

import { User } from '@/lib/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { getCurrentUserWithProfile } = await import('../../lib/auth');
      const currentUser = await getCurrentUserWithProfile();
      setUser(currentUser);
    };

    fetchUser();
  }, []);

  console.log('Current User:', user);

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = '/signin';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/*<Sidebar user={user} onLogout={handleLogout} />*/}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header user={user} />
        <main className="flex-1 overflow-y-auto pt-4 pb-8 px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;