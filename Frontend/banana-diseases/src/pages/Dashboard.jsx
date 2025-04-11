import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import DetectDisease from '../components/DetectDisease';
import DetectionHistory from '../components/DetectionHistory';


const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('...');
  const [activeSection, setActiveSection] = useState('detect');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.name) {
      setUserName(user.name);
    } else {
      setUserName('Guest');
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Log out?',
      text: "Are you sure you want to log out?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981', // green
      cancelButtonColor: '#EF4444', // red
      confirmButtonText: 'Yes, log me out',
      background: '#1F2937', // Tailwind's gray-900
      color: '#E5E7EB' // Tailwind's gray-200
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
          title: 'Logged out 💚',
          text: 'You’ve been logged out successfully.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1F2937',
          color: '#E5E7EB'
        });
        navigate("/");
      }
    });
  };

  const handleSectionChange = (section) => {
    setLoading(true);
    setTimeout(() => {
      setActiveSection(section);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 font-inter">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-850 border-r border-gray-700 shadow-md flex flex-col">
        <div className="text-2xl font-extrabold text-green-400 p-6 border-b border-gray-700">
          Dashboard
        </div>
        <nav className="flex flex-col gap-3 p-6 text-gray-300 font-medium">
          <button
            onClick={() => handleSectionChange('detect')}
            className={`px-3 py-2 rounded-md text-left transition duration-200 ${activeSection === 'detect'
                ? 'bg-green-900/20 text-green-400'
                : 'hover:bg-green-900/20 hover:text-green-400'
              }`}
          >
            📤 Detect Disease
          </button>
          <button
            onClick={() => handleSectionChange('history')}
            className={`px-3 py-2 rounded-md text-left transition duration-200 ${activeSection === 'history'
                ? 'bg-green-900/20 text-green-400'
                : 'hover:bg-green-900/20 hover:text-green-400'
              }`}
          >
            🕘 Detection History
          </button>
          <button
            onClick={handleLogout}
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

        <main className="flex-1 bg-gray-900 overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-green-400 border-dashed rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-gray-400">Loading, just a sec 💚</p>
            </div>
          ) : (
            <div className="h-full p-10">
              {activeSection === 'detect' && <DetectDisease />}
              {activeSection === 'history' && <DetectionHistory />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
