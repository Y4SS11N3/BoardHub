import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import LoginFooter from './LoginFooter';
import DashboardFooter from './DashboardFooter';

const ConditionalFooter = () => {
  const location = useLocation();

  // Determine which footer to show based on the current route
  const showLoginFooter = location.pathname === '/login' || location.pathname === '/register';
  const showDashboardFooter = ['/dashboard', '/shared-with-me', '/trash', '/favorites', '/folder/:folderId', '/profile', '/user/:username'].some(path => 
    path.includes(':') ? location.pathname.startsWith(path.split(':')[0]) : location.pathname === path
  );
  const isBoardCreatePage = /^\/[^/]+\/board\/[^/]+$/.test(location.pathname);
  const isSharedBoardPage = /^\/shared\/[^/]+$/.test(location.pathname);
  const isSettingsPage = location.pathname === '/settings';
  const isSlideshowPage = /^\/[^/]+\/board\/[^/]+\/slideshow/.test(location.pathname);
  const isSharedSlideshowPage = /^\/shared-slideshow\/[^/]+$/.test(location.pathname);

  if (isBoardCreatePage || isSettingsPage || isSharedBoardPage || isSlideshowPage || isSharedSlideshowPage) {
    return null;
  } else if (showLoginFooter) {
    return <LoginFooter />;
  } else if (showDashboardFooter) {
    return <DashboardFooter />;
  } else {
    return <Footer />;
  }
};

export default ConditionalFooter;