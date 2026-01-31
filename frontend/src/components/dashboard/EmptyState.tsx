import React from 'react';

interface EmptyStateProps {
  onAddTask: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddTask }) => {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">You're all caught up!</h3>
      <p className="text-gray-500 mb-6">Add a new task to get started</p>
      <button
        onClick={onAddTask}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Task
      </button>
    </div>
  );
};

export default EmptyState;