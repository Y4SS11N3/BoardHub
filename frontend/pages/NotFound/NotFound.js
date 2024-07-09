import React from 'react';
import { Link } from 'react-router-dom';
import NotFoundSVG from '../../components/SocialLoginButtons/undraw_page_not_found_re_e9o6.svg';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800 p-4">
      <div className="w-full max-w-2xl">
        <img 
          src={NotFoundSVG} 
          alt="Page not found" 
          className="w-full h-auto mb-12 animate-float"
        />
      </div>
      <h2 className="text-4xl font-bold mb-4 text-center animate-fadeIn text-blue-600">
        Oops! Page not found.
      </h2>
      <p className="text-xl mb-8 text-center animate-fadeIn animation-delay-300 text-gray-600">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold 
                   transition duration-300 ease-in-out transform hover:scale-105 
                   hover:shadow-lg hover:bg-blue-700 animate-pulse"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;