import React, { useState } from 'react';
import { Mail, Lock, User, ChevronLeft } from 'lucide-react';

// A reusable input component for our form
const FormInput = ({ icon, type, placeholder, value, onChange }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      {/* We pass the icon component itself as a prop */}
      {React.createElement(icon, { className: "text-gray-400", size: 20 })}
    </div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-green-500 transition-all"
      required
    />
  </div>
);

// The main Login Page component
const LoginPage = ({ setView }) => {
  // true = Login view, false = Sign Up view
  const [isLoginView, setIsLoginView] = useState(true);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Stop the form from refreshing the page
    if (isLoginView) {
      // --- LOGIN LOGIC (Placeholder) ---
      console.log('Attempting login with:', { email, password });
      // In a real app, you'd call your API here.
      // On success, you might set a user token and go home:
      // alert('Login successful!');
      // setView({ name: 'home' });
    } else {
      // --- SIGN UP LOGIC (Placeholder) ---
      console.log('Attempting sign up with:', { name, email, password });
      // In a real app, you'd call your API here.
      // On success, you might automatically log them in:
      // alert('Sign up successful!');
      // setIsLoginView(true); // Switch to login view
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 px-4">
      
      {/* Back Button */}
      <button
        onClick={() => setView({ name: 'home' })}
        className="absolute top-20 left-4 sm:left-10 flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Home
      </button>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
            {isLoginView ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLoginView ? 'Log in to continue to FreshKart.' : 'Get started with FreshKart today!'}
          </p>
        </div>

        {/* View Toggler (Login / Sign Up) */}
        <div className="flex mb-8 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setIsLoginView(true)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              !isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Input (only for Sign Up) */}
          {!isLoginView && (
            <FormInput
              icon={User}
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {/* Email Input */}
          <FormInput
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <FormInput
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Forgot Password Link (only for Login) */}
          {isLoginView && (
            <a
              href="#"
              className="text-sm text-green-600 hover:text-green-700 font-medium block text-right mb-6"
            >
              Forgot Password?
            </a>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {isLoginView ? 'Login' : 'Create My Account'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;