"use client";

import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}
interface AddTaskFormProps {
  onSubmit: (title: string, description: string) => Promise<Task>;
  initialTitle?: string;
  initialDescription?: string;
  disabled?: boolean;
}

export default function SetTaskForm({
  onSubmit,
  initialTitle = "",
  initialDescription = "",
  disabled = false,
}: AddTaskFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(title.trim(), description.trim());
      setTitle("");
      setDescription("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      id="add-task-form"
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          value={title}
          disabled={disabled || loading}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Finish dashboard UI"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          value={description}
          disabled={disabled || loading}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Extra details about the task..."
          rows={3}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none disabled:bg-gray-100"
        />
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={disabled || loading}
        className="w-full flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </span>
        ) : (
          "Save Task"
        )}
      </button>
    </form>
  );
}
