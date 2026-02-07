import React from 'react';
import Link from 'next/link';
import { NAVIGATION_ITEMS } from '@/lib/constants';

interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  user: User | null;
  navigationItems: NavigationItem[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, navigationItems = NAVIGATION_ITEMS, onLogout }) => {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">TodoApp</h1>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span className="mr-3 text-lg">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">
              {user?.name || user?.email}
            </p>
            <button
              onClick={onLogout}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;