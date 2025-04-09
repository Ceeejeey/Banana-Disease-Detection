import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios"; // using our custom Axios instance

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("/api/register", formData);
      alert("Registered successfully! 🎉");
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4 font-poppins">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl text-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">
          Create Your Account
        </h1>
        <p className="text-gray-600 text-lg mb-6">
          Join us and start detecting banana diseases today! 🍌
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-6 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white text-lg font-semibold rounded-2xl shadow-md hover:bg-yellow-600 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
