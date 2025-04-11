import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setError(null);

    try {
      // Send a POST request to the FastAPI login endpoint
      const response = await axios.post("/api/login", formData);

      // Check if login was successful
      const { access_token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      // Navigate to the dashboard after successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-200 to-gray-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">Login to Your Account</h2>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col space-y-2">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="px-6 py-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="px-6 py-4 rounded-2xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-yellow-500 text-white text-xl font-semibold rounded-2xl shadow-md transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-500 font-medium hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
