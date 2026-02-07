"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import StatisticsContainer from "@/app/components/dashboard/StatisticsContainer";
import AddTaskForm from "@/app/components/forms/AddTaskForm";
import TaskCard from "@/app/components/ui/TaskCard";
import EmptyState from "@/app/components/dashboard/EmptyState";
import FilterControls from "@/app/components/dashboard/FilterControls";

import { calculateTaskStats } from "@/lib/tasks";
import { Todo, User } from "@/lib/types";
import SetTaskForm from "../components/forms/SetTaskForm";


function useCurrentUser() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  return user;
}

/* ---------------- CONFIG ---------------- */
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";

/* ================= PAGE ================= */
export default function DashboardPage() {
  const router = useRouter();
    const userName = useCurrentUser();


  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);



  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    checkAuth();
  });

  const checkAuth = async () => {
    try {
      await axios.get(`${API_BASE}/api/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser({
        id: "me",
        email: "authenticated",
        name: userName?.name || "User",
        created_at: new Date().toISOString(),
      });

      fetchTodos();
    } catch {
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- TODOS ---------------- */
  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/todos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTodos(res.data);
    } catch {
      setError("Failed to load todos");
    }
  };

  const handleAddTodo = async (title: string, description: string) => {
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
      setShowAddForm(false);
      return res.data;
    } catch {
      setError("Failed to create todo");
      throw new Error("Failed to create todo");
    }
  };

  const toggleComplete = async (id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !completed } : todo))
    );

    try {
      await axios.put(
        `${API_BASE}/api/todos/${id}`,
        { completed: !completed },
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
    } catch {
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  const editTodo = async (updated: Todo) => {
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));

    try {
      await axios.put(
        `${API_BASE}/api/todos/${updated.id}`,
        updated,
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      );
    } catch {
      setError("Failed to update todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  };

  const filteredTodos = todos
    .filter((t) =>
      filter === "all" ? true : filter === "completed" ? t.completed : !t.completed
    )
    .filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                
                <h1 className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">Stay organized, achieve more</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-indigo-50 to-purple-50 rounded-full">
                <div className="w-8 h-8 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                 {userName?.name?.charAt(0).toUpperCase() || "U"}
                  
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* STATISTICS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatisticsContainer stats={calculateTaskStats(todos)} />
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-6">
        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm flex items-start space-x-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <svg className="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* ACTION BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 gap-4">
            <FilterControls
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filter={filter}
              setFilter={setFilter}
            />
            
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          </div>
        </div>

        {/* TODOS LIST */}
        {filteredTodos.length === 0 ? (
          <EmptyState onAddTask={() => setShowAddForm(true)} />
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskCard
                  task={todo}
                  isCompleted={todo.completed}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTodo}
                  onEdit={() => setEditingTodo(todo)}
                />
              </div>
            ))}
          </div>
        )}

        {/* FLOATING ADD BUTTON (Mobile) */}
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed bottom-6 right-6 sm:hidden w-14 h-14 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-110 z-30"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </main>

      {/* ADD TODO MODAL */}
     {showAddForm && (
  <div 
    className="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    {/* Backdrop with improved animation */}
    <div 
      className="fixed inset-0 bg-linear-to-br from-black/70 via-black/60 to-indigo-900/40 backdrop-blur-md transition-opacity duration-300"
      onClick={() => setShowAddForm(false)}
    />
    
    {/* Modal Container */}
    <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
      <div 
        className="relative w-full max-w-lg transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative gradient background */}
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-lg opacity-30 animate-pulse" />
        
        {/* Main Modal */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient accent */}
          <div className="relative bg-linear-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-6">
            <div className="absolute inset-0 bg-black/5" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-white">
                    Create New Task
                  </h2>
                  <p className="text-indigo-100 text-sm mt-0.5">Add a task to your workflow</p>
                </div>
              </div>
              
              {/* Close button */}
              <button
                onClick={() => setShowAddForm(false)}
                className="group p-2 hover:bg-white/10 rounded-xl transition-all duration-200 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <svg 
                  className="w-6 h-6 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="px-6 sm:px-8 py-8 bg-linear-to-br from-gray-50/50 to-white">
            <AddTaskForm
              onSubmit={handleAddTodo}
              disabled={false}
            />
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-task-form"
                className="flex-1 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Create Task
                </span>
              </button>
            </div>
          </div>
          
          {/* Bottom decorative accent */}
          <div className="h-1 bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600" />
        </div>
      </div>
    </div>
  </div>
)}
{editingTodo && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Task</h2>

      <SetTaskForm
        initialTitle={editingTodo.title}
        initialDescription={editingTodo.description ?? undefined}
        onSubmit={async (title, description) => {
          await editTodo({
            ...editingTodo,
            title,
            description,
          });
          setEditingTodo(null);
        }}
      />

      <button
        className="mt-4 text-sm text-gray-500"
        onClick={() => setEditingTodo(null)}
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </div>
  );
}