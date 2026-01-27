// LoginPage.jsx (Restored to use real API endpoints)

import React, { useState } from 'react';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff } from 'lucide-react';

// NOTE: Replace these endpoints with your real backend endpoints
const LOGIN_ENDPOINT = '/api/auth/login';
const SIGNUP_ENDPOINT = '/api/auth/signup';

// A reusable input component for our form
const FormInput = ({ icon, type, placeholder, value, onChange, id, children }) => (
  <div className="relative mb-6">
    <label htmlFor={id} className="sr-only">
      {placeholder}
    </label>
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      {React.createElement(icon, { className: 'text-gray-400', size: 20 })}
    </div>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-green-500 transition-all"
      required
      aria-required="true"
    />
    {children}
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
  const [showPassword, setShowPassword] = useState(false);

  // UX state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // simple validation helpers
  const isValidEmail = (e) => {
    // basic RFC-ish check — replace with your preferred validation if desired
    return /\S+@\S+\.\S+/.test(e);
  };

  const validateForm = () => {
    if (!isLoginView && name.trim().length === 0) {
      setErrorMessage('Please enter your name.');
      return false;
    }
    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the form from refreshing the page

    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isLoginView) {
        // LOGIN
        const res = await fetch(LOGIN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          // show backend error message if available
          throw new new Error(data?.message || 'Login failed. Please try again.');
        }

        // expected: { token: '...', user: { ... } }
        const token = data.token;
        if (token) {
          localStorage.setItem('auth_token', token);
        }

        setSuccessMessage('Login successful! Redirecting...');
        // simulate redirect by calling setView to go home
        setTimeout(() => setView({ name: 'home' }), 500);
      } else {
        // SIGN UP
        const res = await fetch(SIGNUP_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || 'Sign up failed. Please try again.');
        }

        setSuccessMessage('Account created! Logging you in...');

        // Optionally auto-login after successful sign up (if backend returns token, we use it)
        if (data.token) {
          localStorage.setItem('auth_token', data.token);
          setTimeout(() => setView({ name: 'home' }), 600);
        } else {
          // If backend doesn't return token, call login endpoint automatically
          const loginRes = await fetch(LOGIN_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.trim(), password }),
          });
          const loginData = await loginRes.json();
          if (!loginRes.ok) throw new Error(loginData?.message || 'Auto-login failed.');
          if (loginData.token) localStorage.setItem('auth_token', loginData.token);
          setTimeout(() => setView({ name: 'home' }), 600);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const switchToLogin = (shouldLogin) => {
    setIsLoginView(shouldLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pt-20 px-4">

      {/* Back Button */}
      <button
        onClick={() => setView({ name: 'home' })}
        className="absolute top-20 left-4 sm:left-10 flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
        aria-label="Back to home"
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
        <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => switchToLogin(true)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
            aria-pressed={isLoginView}
          >
            Login
          </button>
          <button
            onClick={() => switchToLogin(false)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              !isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
            aria-pressed={!isLoginView}
          >
            Sign Up
          </button>
        </div>

        {/* Inline status messages */}
        {errorMessage && (
          <div className="mb-4 text-sm text-red-600" role="alert" aria-live="assertive">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-sm text-green-700" role="status" aria-live="polite">
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Input (only for Sign Up) */}
          {!isLoginView && (
            <FormInput
              icon={User}
              type="text"
              placeholder="Your Name"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {/* Email Input */}
          <FormInput
            icon={Mail}
            type="email"
            placeholder="Email Address"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input (with toggle) */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="text-gray-400" size={20} />
            </div>

            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-green-500 transition-all"
              required
              aria-required="true"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Forgot Password Link (only for Login) */}
          {isLoginView && (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert('Implement forgot password flow on your backend.'); }}
              className="text-sm text-green-600 hover:text-green-700 font-medium block text-right mb-6"
            >
              Forgot Password?
            </a>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed hover:shadow-none hover:translate-y-0' : ''
            }`}
          >
            {isSubmitting ? (isLoginView ? 'Logging in...' : 'Creating account...') : (isLoginView ? 'Login' : 'Create My Account')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginPage;