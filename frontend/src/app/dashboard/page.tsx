'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { isAuthenticated, removeAuthToken } from '@/lib/auth';
import { Todo, User } from '@/lib/types';
import { calculateTaskStats, TaskStatistics } from '@/lib/tasks';
import StatisticsContainer from '@/components/dashboard/StatisticsContainer';
import AddTaskForm from '@/components/forms/AddTaskForm';
import TaskCard from '@/components/ui/TaskCard';
import EmptyState from '@/components/dashboard/EmptyState';
import FilterControls from '@/components/dashboard/FilterControls';

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

const DashboardPage = () => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTask, setLoadingTask] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<TaskStatistics>({ total: 0, active: 0, completed: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    checkAuthAndLoadData();
  }, []);

  // Recalculate stats whenever todos change
  useEffect(() => {
    const newStats = calculateTaskStats(todos);
    setStats(newStats);
  }, [todos]);

  const checkAuthAndLoadData = async () => {
    if (!isAuthenticated()) {
      router.push('/signin');
      router.refresh(); // Force refresh to ensure redirect happens
      return;
    }

    try {
      // Get the current user from localStorage or fetch from backend
      const { getCurrentUserWithProfile } = await import('@/lib/auth');
      const currentUser = await getCurrentUserWithProfile();

      if (currentUser) {
        setUser(currentUser);
      } else {
        // Fallback to fetching user profile if not available
        try {
          const { fetchAndStoreUserProfile } = await import('@/lib/auth');
          const profileFetched = await fetchAndStoreUserProfile();

          if (profileFetched) {
            const refreshedUser = await getCurrentUserWithProfile();
            setUser(refreshedUser);
          } else {
            console.error("Could not get user profile");
          }
        } catch (profileErr) {
          console.error("Error fetching user profile:", profileErr);
        }
      }

      await fetchTodos();
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      setError("Failed to load todos");
      console.error(err);
    }
  };

  const handleAddTask = async (title: string, description: string) => {
    setLoadingTask(true);
    setError(null);

    try {
      const res = await axios.post(
        `${API_BASE}/api/todos`,
        { title, description: description || undefined },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      setTodos((prev) => [res.data, ...prev]);
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    } finally {
      setLoadingTask(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !completed } : todo
      )
    );

    try {
      await axios.put(
        `${API_BASE}/api/todos/${id}`,
        { completed: !completed },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    } catch (err) {
      // Rollback if API fails
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
      setError("Failed to update task");
      console.error(err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleEditTask = (task: Todo) => {
    // For now, just alert that editing would happen
    alert(`Editing task: ${task.title}`);
  };

  // Filter and search todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (todo.description && todo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (filter === 'active') {
      return matchesSearch && !todo.completed;
    } else if (filter === 'completed') {
      return matchesSearch && todo.completed;
    } else {
      return matchesSearch;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <StatisticsContainer stats={stats} />

      <AddTaskForm onSubmit={handleAddTask} disabled={loadingTask} />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-medium">Your Tasks</h2>
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filter={filter}
            setFilter={setFilter}
          />
        </div>

        {filteredTodos.length === 0 ? (
          <EmptyState onAddTask={() => {}} />
        ) : (
          <div className="divide-y">
            {filteredTodos.map((todo) => (
              <TaskCard
                key={todo.id}
                task={todo}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
                isCompleted={todo.completed}
              />
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;