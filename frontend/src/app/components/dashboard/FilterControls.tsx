import React from 'react';

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filter: 'all' | 'active' | 'completed';
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
      {/* Search Input */}
      <div className="flex-1 relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter Dropdown */}
      <div className="flex gap-2">
        {(['all', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'all'
              ? 'All Tasks'
              : f === 'active'
              ? 'Active'
              : 'Completed'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;
