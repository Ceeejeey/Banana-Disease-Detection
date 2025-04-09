import React from 'react';
import { useNavigate } from 'react-router-dom';
import DetectDisease from '../components/DetectDisease';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = "Gihan";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-850 border-r border-gray-700 shadow-md flex flex-col">
        <div className="text-2xl font-extrabold text-green-400 p-6 border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex flex-col gap-3 p-6 text-gray-300 font-medium">
          <button
            onClick={() => navigate('#')}
            className="px-3 py-2 rounded-md text-left hover:bg-green-900/20 hover:text-green-400 transition duration-200"
          >
            📤 Detect Disease
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-3 py-2 rounded-md text-left hover:bg-green-900/20 hover:text-green-400 transition duration-200"
          >
            🕘 Detection History
          </button>
          <button
            onClick={() => navigate('/logout')}
            className="px-3 py-2 rounded-md text-left hover:bg-red-900/20 hover:text-red-400 transition duration-200"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-gray-850 shadow-sm flex items-center justify-between px-8 border-b border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-100">
            Welcome back, <span className="text-green-400">{userName}</span> 👋
          </h1>
        </header>

        {/* Main Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-10 bg-gray-900">
          <DetectDisease />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
