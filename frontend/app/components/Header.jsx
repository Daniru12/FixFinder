'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon, UserIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // adjust path if needed

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="flex justify-between h-16">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-teal-600">
                Fix<span className="text-blue-600">Finder</span>
              </span>
            </Link>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link
                href="/service"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Find Services
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/admin-dashboard"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Become a Provider
              </Link>
            </nav>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-700 text-sm font-medium">
                  Hi, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <XIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t border-gray-200`}>
        <div className="px-4 py-3 space-y-1 sm:px-6">
          <Link
            href="/service"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
          >
            Find Services
          </Link>
          <Link
            href="/about"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
          >
            About Us
          </Link>
          <Link
            href="/admin-dashboard"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
          >
            Become a Provider
          </Link>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          {user ? (
            <div>
              <p className="text-base font-medium text-gray-800 mb-2">
                Hi, {user.username}
              </p>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="w-full block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
