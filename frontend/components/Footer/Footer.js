import React from 'react';
import { Link } from 'react-router-dom';
import { YoutubeIcon, TwitterIcon, FacebookIcon, InstagramIcon, ChevronDownIcon, MapPinIcon, PhoneIcon, MailIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400 animate-gradient-text">BoardHub</h2>
            <p className="text-gray-300">Empowering collaboration and creativity.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                <YoutubeIcon size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                <TwitterIcon size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                <FacebookIcon size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
                <InstagramIcon size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Features</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Tutorials</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Documentation</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">For Education</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Connect</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">About</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Blog</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Contact Us</Link></li>
              <li><Link to="#" className="text-gray-300 hover:text-white transition-colors hover:underline">Community</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPinIcon size={18} className="mr-2 text-teal-400" />
                <span>Casablanca, TechnoPark</span>
              </li>
              <li className="flex items-center">
                <PhoneIcon size={18} className="mr-2 text-teal-400" />
                <span>+212 612-345678</span>
              </li>
              <li className="flex items-center">
                <MailIcon size={18} className="mr-2 text-teal-400" />
                <span>info@boardhub.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0 flex items-center">
            © 2024 BoardHub. All rights reserved. 
            <span className="mr-2 ml-2">Crafted by</span>
            <a 
              href="https://www.linkedin.com/in/yassine-mtejjal" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-teal-400 hover:text-teal-300 transition-colors duration-300 ease-in-out cursor-pointer flex items-center"
            >
              Yassine
              <svg className="w-4 h-4 ml-1 animate-flash" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </a>
          </div>
          <div className="flex items-center">
            <button className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center hover:bg-gray-600 transition-colors">
              <span>English (US)</span>
              <ChevronDownIcon size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes gradientText {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-flash {
          animation: flash 2s ease-in-out infinite;
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradientText 4s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;