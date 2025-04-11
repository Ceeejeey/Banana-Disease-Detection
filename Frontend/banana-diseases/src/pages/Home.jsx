import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-200 to-gray-400 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-3xl shadow-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Banana Disease Detector
        </h1>
        <p className="text-gray-700 text-lg mb-10">
          Detect and diagnose diseases in Puwalu bananas using AI — fast, easy, and accurate.
        </p>

        <div className="space-y-4">
          <Link
            to="/register"
            className="block px-8 py-4 bg-yellow-500 text-white text-xl font-semibold rounded-2xl shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="block px-8 py-4 border-2 border-yellow-500 text-yellow-500 text-xl font-semibold rounded-2xl shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Login
          </Link>

          <p className="text-xs text-gray-400 mt-6">Crafted with 💚 by Heshani</p>
        </div>
      </div>
    </div>
  );
}
