import React from 'react';
import StatCard from '@/components/ui/StatCard';
import { TaskStatistics } from '@/lib/tasks';

interface StatisticsContainerProps {
  stats: TaskStatistics;
}

const StatisticsContainer: React.FC<StatisticsContainerProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon="📋"
        value={stats.total}
        label="Total Tasks"
        className="bg-blue-50 border border-blue-100"
      />
      <StatCard
        icon="⏳"
        value={stats.active}
        label="Active Tasks"
        className="bg-yellow-50 border border-yellow-100"
      />
      <StatCard
        icon="✅"
        value={stats.completed}
        label="Completed Tasks"
        className="bg-green-50 border border-green-100"
      />
    </div>
  );
};

export default StatisticsContainer;