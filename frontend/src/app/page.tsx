"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ---------------- TYPES ---------------- */
interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/* ---------------- CONFIG ---------------- */
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/* ================= PAGE ================= */
export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    checkAuth();
  }, []);

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
        name: "User",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
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

      /* 🔥 NEW TODO APPEARS FROM BOTTOM */
      setTodos((prev) => [res.data, ...prev]);

      setTitle("");
      setDescription("");
    } catch {
      setError("Failed to create todo");
    } finally {
      setSubmitting(false);
    }
  };

const toggleComplete = async (id: number, completed: boolean) => {
  // 1️⃣ Optimistic UI update (instant)
  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === id ? { ...todo, completed: !completed } : todo
    )
  );

  try {
    // 2️⃣ Backend update
    await axios.put(
      `${API_BASE}/api/todos/${id}`,
      { completed: !completed },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
  } catch (error) {
    // 3️⃣ Rollback if API fails
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed } : todo
      )
    );
    setError("Failed to update todo");
  }
};

  const deleteTodo = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/api/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  };

  /* ---------------- UI STATES ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-xl font-semibold">Todo App</h1>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* 🔼 TODOS LIST (TOP) */}
        <div className="bg-white rounded-xl shadow">
          <h2 className="text-lg font-medium px-6 py-4 border-b">
            Your Tasks
          </h2>

          {todos.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">
              No tasks yet 👇 Add one below
            </p>
          ) : (
            <ul className="divide-y">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="px-6 py-4 flex justify-between animate-slide-up"
                >
                  <div className="flex gap-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.completed)}
                    />
                    <div>
                      <p
                        className={`font-medium ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {todo.title}
                      </p>
                      {todo.description && (
                        <p className="text-sm text-gray-500">
                          {todo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 🔽 ADD TODO (BOTTOM) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-6"
        >
          <h2 className="text-lg font-medium mb-4">Add New Task</h2>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className="w-full border px-4 py-2 rounded-md mb-3"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description (optional)"
            rows={3}
            className="w-full border px-4 py-2 rounded-md mb-4"
          />

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-black text-white rounded-md disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Task"}
          </button>
        </form>
      </main>

      {/* 🔥 SLIDE-UP ANIMATION */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.35s ease-out;
        }
      `}</style>
    </div>
  );
}
