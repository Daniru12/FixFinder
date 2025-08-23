import React from 'react';
import Link from 'next/link';
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-teal-400 mb-4">
              Fix<span className="text-blue-400">Finder</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Connecting you with trusted service providers for all your home
              repair needs.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-teal-400 transition-colors"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Find Services
                </Link>
              </li>
              <li>
                <Link href="/add-service" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#plumbing" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Plumbing
                </a>
              </li>
              <li>
                <a href="#electrical" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Electrical
                </a>
              </li>
              <li>
                <a href="#carpentry" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Carpentry
                </a>
              </li>
              <li>
                <a href="#ac-repair" className="text-gray-300 hover:text-teal-400 transition-colors">
                  AC Repair
                </a>
              </li>
              <li>
                <a href="#painting" className="text-gray-300 hover:text-teal-400 transition-colors">
                  Painting
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-teal-400 mr-2 mt-0.5" />
                <span className="text-gray-300">
                  123 Repair Street, Fix City, FC 12345
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-gray-300">(123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 text-teal-400 mr-2" />
                <span className="text-gray-300">support@fixfinder.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} FixFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;