import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can connect this to your FastAPI endpoint
    console.log("Logging in with:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl text-center">
        <h2 className="text-4xl font-semibold text-gray-800 mb-6">
          Login to Your Account
        </h2>
        <br />


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
