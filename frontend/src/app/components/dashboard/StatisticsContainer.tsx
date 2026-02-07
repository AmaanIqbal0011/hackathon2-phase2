import React from "react";
import StatCard from "@/app/components/ui/StatCard";
import { TaskStatistics } from "@/lib/tasks";
import CountUp from "react-countup";

interface StatisticsContainerProps {
  stats: TaskStatistics;
}

const StatisticsContainer: React.FC<StatisticsContainerProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon="📋"
        value={<CountUp end={stats.total} duration={0.8} />}
        label="Total Tasks"
        className="bg-blue-50 border border-blue-100 transition-transform duration-200 hover:scale-105"
      />
      <StatCard
        icon="⏳"
        value={<CountUp end={stats.active} duration={0.8} />}
        label="Active Tasks"
        className={`border transition-transform duration-200 hover:scale-105 ${
          stats.active === 0 ? "bg-gray-100 border-gray-200" : "bg-yellow-50 border-yellow-100"
        }`}
      />
      <StatCard
        icon="✅"
        value={<CountUp end={stats.completed} duration={0.8} />}
        label="Completed Tasks"
        className="bg-green-50 border border-green-100 transition-transform duration-200 hover:scale-105"
      />
    </div>
  );
};

export default StatisticsContainer;
