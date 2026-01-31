import React, { useState } from 'react';

interface AddTaskFormProps {
  onSubmit: (title: string, description: string) => Promise<void>;
  disabled: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, disabled }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await onSubmit(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-medium mb-4">Add New Task</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        className="w-full border px-4 py-2 rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        rows={3}
        className="w-full border px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={disabled || !title.trim()}
        className="px-5 py-2 bg-black text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
      >
        {disabled ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};

export default AddTaskForm;