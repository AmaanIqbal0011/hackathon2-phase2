import React from 'react';

interface EmptyStateProps {
  onAddTask: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
      {/* Animated celebration icon */}
      <div className="text-6xl animate-bounce mb-2">🎉</div>

      <h3 className="text-2xl font-semibold text-gray-900">
        You&apos;re all caught up!
      </h3>

      <p className="text-gray-500 max-w-xs">
        Looks like there are no tasks pending. Add a new task to stay productive!
      </p>

      <button
        onClick={onAddTask}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-1"
      >
        Add Task
      </button>

      {/* Optional AI suggestion placeholder */}
      <p className="mt-6 text-gray-400 italic text-sm max-w-xs">
        Tip: Try using AI suggestions to create tasks faster!
      </p>
    </div>
  );
};

export default EmptyState;
