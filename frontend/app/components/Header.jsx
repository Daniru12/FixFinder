'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon, UserIcon } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                href="/services"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Find Services
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/add-service"
                className="text-gray-700 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Become a Provider
              </Link>
            </nav>
          </div>

          {/* Desktop Login & Sign Up */}
          <div className="hidden md:flex items-center space-x-4">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-teal-600 hover:bg-gray-100 focus:outline-none"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <span className="sr-only">
                {isMenuOpen ? 'Close menu' : 'Open main menu'}
              </span>
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
            href="/services"
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
            href="/add-service"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-teal-600 hover:bg-gray-100 transition-colors"
            onClick={toggleMenu}
          >
            Become a Provider
          </Link>
        </div>

        <div className="px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-800">Account</p>
            </div>
          </div>

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
        </div>
      </div>
    </header>
  );
};

export default Header;