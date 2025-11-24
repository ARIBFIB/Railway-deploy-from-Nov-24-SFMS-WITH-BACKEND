import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LogIn, UserPlus } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FAASINOVA</span>
            </div>
            <div className="text-sm text-gray-600">
              Foundation Management System
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Swedish Foundation Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your foundation operations with comprehensive governance, financial management, 
            and regulatory compliance tools designed specifically for Swedish foundations.
          </p>
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Login to Existing Foundation */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Your Foundation
            </h2>
            <p className="text-gray-600 mb-6">
              Login to your existing foundation account to manage operations, view reports, and handle governance.
            </p>
            <Link to="/login">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Login to Foundation
              </button>
            </Link>
          </div>

          {/* Register New Foundation */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Register New Foundation
            </h2>
            <p className="text-gray-600 mb-6">
              Start the process of registering a new Swedish foundation with our guided setup and compliance tools.
            </p>
            <Link to="/register-foundation">
              <button className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Register Foundation
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 FAASINOVA. All rights reserved.</p>
            <p className="mt-2">Swedish Foundation Management System</p>
          </div>
        </div>
      </footer>
    </div>
  );
};