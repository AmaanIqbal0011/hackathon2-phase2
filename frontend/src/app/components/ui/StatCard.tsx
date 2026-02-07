import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string | React.ReactNode;
  label: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 flex items-center ${className}`}>
      <div className="mr-4 text-2xl">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;