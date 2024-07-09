import React from 'react';

const DashboardFooter = () => {
  return (
    <footer className="relative z-10 w-full py-6 bg-gradient-to-r from-slate-800 to-slate-900 text-slate-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-2">
            <h3 className="text-xl font-bold tracking-wider">
              BoardHub
            </h3>
          </div>
          <div className="text-xs font-medium uppercase tracking-widest flex items-center">
            <span className="mr-2">Crafted by</span>
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
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 animate-gradient"></div>
      <style jsx>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientAnimation 5s ease infinite;
        }
        @keyframes flash {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-flash {
          animation: flash 2s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default DashboardFooter;