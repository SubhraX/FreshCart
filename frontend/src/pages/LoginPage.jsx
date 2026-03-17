import React, { useState } from 'react';
import { Mail, Lock, User, ChevronLeft, Eye, EyeOff } from 'lucide-react';
// This now uses your configured baseURL (localhost or Render backend)
import { axiosInstance } from '../utils/axios.js';

const LOGIN_ENDPOINT = '/api/auth/login';
const SIGNUP_ENDPOINT = '/api/auth/signup';

const FormInput = ({ icon, type, placeholder, value, onChange, id, children }) => (
  <div className="relative mb-6">
    <label htmlFor={id} className="sr-only">{placeholder}</label>
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
    />
    {children}
  </div>
);

const LoginPage = ({ setView }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const isValidEmail = (e) => /\S+@\S+\.\S+/.test(e);

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
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      let response;

      if (isLoginView) {
        // --- LOGIN USING AXIOS ---
        response = await axiosInstance.post(LOGIN_ENDPOINT, {
          email: email.trim(),
          password,
        });
        
        setSuccessMessage('Login successful! Redirecting...');
      } else {
        // --- SIGNUP USING AXIOS ---
        response = await axiosInstance.post(SIGNUP_ENDPOINT, {
          name: name.trim(),
          email: email.trim(),
          password,
        });
        
        setSuccessMessage('Account created! Logging you in...');
      }

      const data = response.data;

      // Handle Token and User storage
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }

      const userData = data.user || {
        name: isLoginView ? email.split('@')[0] : name,
        email: email
      };

      localStorage.setItem('user', JSON.stringify(userData));

      setTimeout(() => {
        setView({ name: 'home' });
        window.location.reload();
      }, 700);

    } catch (err) {
      // Axios puts the server response in err.response
      const errorMsg = err.response?.data?.message || err.message || 'Something went wrong.';
      setErrorMessage(errorMsg);
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
      <button
        onClick={() => setView({ name: 'home' })}
        className="absolute top-20 left-4 sm:left-10 flex items-center text-sm text-green-600 hover:text-green-700 transition-colors font-medium"
      >
        <ChevronLeft size={16} className="mr-1" /> Back to Home
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">
            {isLoginView ? 'Welcome Back!' : 'Create Account'}
          </h1>
          <p className="text-gray-500 mt-2">
            {isLoginView ? 'Log in to continue to FreshCart.' : 'Get started with FreshCart today!'}
          </p>
        </div>

        <div className="flex mb-6 rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => switchToLogin(true)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => switchToLogin(false)}
            className={`w-1/2 py-2 font-semibold rounded-md transition-all ${
              !isLoginView ? 'bg-white shadow' : 'text-gray-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 p-2 bg-red-50 rounded border border-red-100">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 text-sm text-green-700 p-2 bg-green-50 rounded border border-green-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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

          <FormInput
            icon={Mail}
            type="email"
            placeholder="Email Address"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Lock className="text-gray-400" size={20} />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-gray-100 border-2 border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-green-500 transition-all"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting
              ? (isLoginView ? 'Logging in...' : 'Creating account...')
              : (isLoginView ? 'Login' : 'Create My Account')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;