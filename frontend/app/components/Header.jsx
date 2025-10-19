'use client';
import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white/20 backdrop-blur-lg border-b border-white/30 sticky top-0 z-50 supports-backdrop-blur:bg-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-semibold text-teal-600 drop-shadow-sm">
              Fix<span className="text-blue-600">Finder</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/service"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
            >
              Services
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <Link 
                  href={user.role === 'ROLE_PROVIDER' ? './Provider/providerProfile' : './User/userProfile'}
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
                >
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2 transition-colors duration-200 backdrop-blur-sm rounded-lg hover:bg-white/30"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-teal-600/90 backdrop-blur-sm text-white hover:bg-teal-700/90 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-teal-500/30 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? (
              <XIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/30 bg-white/20 backdrop-blur-xl">
            <div className="py-2 space-y-1">
              <Link
                href="/service"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                href="/products"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                onClick={toggleMenu}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                onClick={toggleMenu}
              >
                About
              </Link>
            </div>

            <div className="border-t border-white/30 py-2">
              {user ? (
                <div className="space-y-1">
                  <Link
                    href={user.role === 'ROLE_PROVIDER' ? './Provider/providerProfile' : './User/userProfile'}
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                    onClick={toggleMenu}
                  >
                    Profile: {user.username}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                    className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/login"
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-white/30 transition-all duration-200 backdrop-blur-sm mx-2 rounded-lg"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;