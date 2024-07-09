import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header/Header';
import LoginHeader from '../LoginHeader/LoginHeader';
import RegisterHeader from '../RegisterHeader/RegisterHeader';
import DashboardHeader from '../DashboardHeader/DashboardHeader';
import BoardHeader from '../BoardHeader/BoardHeader';
import SlideShowHeader from './SlideShowHeader';

const ConditionalHeader = () => {
  const location = useLocation();

  // Determine which header to show based on the current route
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isSlideShow = location.pathname.includes('/slideshow');
  const isDashboardPage = ['/dashboard', '/shared-with-me', '/trash', '/favorites', '/folder/:folderId'].some(path => 
    path.includes(':folderId') ? location.pathname.startsWith(path.replace(':folderId', '')) : location.pathname === path
  );
  const isBoardCreatePage = /^\/[^/]+\/board\/[^/]+$/.test(location.pathname);
  const isSharedBoardPage = /^\/shared\/[^/]+$/.test(location.pathname);
  const isSettingsPage = location.pathname === '/settings';
  const isProfilePage = location.pathname === '/profile';
  const isUserProfilePage = /^\/user\/[^/]+$/.test(location.pathname);
  const isSlideshowPage = /^\/[^/]+\/board\/[^/]+\/slideshow/.test(location.pathname);
  const isSharedSlideshowPage = /^\/shared-slideshow\/[^/]+$/.test(location.pathname);
  
  if (isLoginPage) {
    return <LoginHeader />;
  } else if (isRegisterPage) {
    return <RegisterHeader />;
  } else if (isDashboardPage) {
    return <DashboardHeader />;
  } else if (isSlideShow) {
    return <SlideShowHeader />;
  } else if (isBoardCreatePage || isSharedBoardPage) {
    return <BoardHeader />;
  } else if (isSettingsPage || isProfilePage || isUserProfilePage || isSlideshowPage || isSharedSlideshowPage) {
    return null;
  } else {
    return <Header />;
  }
};

export default ConditionalHeader;