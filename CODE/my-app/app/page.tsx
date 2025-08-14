"use client";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setMessage("✅ User added!");
        setUsername("");
        setPassword("");
      } else {
        setMessage("❌ Error adding user.");
      }
    } catch (err) {
      setMessage("❌ Network error.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="w-full bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">User Manager</h1>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200">
            Dashboard
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 grid gap-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New User</h2>
          <p className="text-gray-500 text-sm">
            Fill in the details below to create a new account.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 text-black rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-sm transition-all duration-200"
            >
              Add User
            </button>
          </form>

          {/* Render message only if it exists */}
          {message !== null && (
            <div
              className={`mt-2 text-center text-sm font-medium ${
                message.includes("Error") ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
