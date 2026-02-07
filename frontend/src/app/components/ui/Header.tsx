import React from 'react';



interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

interface HeaderProps {
  user: User | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white border-b border-gray-200 pl-64 pr-6 py-4"> {/* pl-64 to account for sidebar */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center">
          <div className="mr-4 text-right">
            <p className="text-sm font-medium text-gray-700">
              Welcome back, {user?.name || user?.email || 'User'}!
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;